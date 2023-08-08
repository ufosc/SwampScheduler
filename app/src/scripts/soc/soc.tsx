import { API_Course, API_Section } from "@scripts/apiTypes";
import {
    getProgram,
    getProgramString,
    getSearchByString,
    getTerm,
    Program,
    SearchBy,
    Term,
} from "@constants/soc";
import { CancellablePromise, Cancellation } from "real-cancellable-promise";
import { Course, Section } from "@scripts/soc";
import { fetchCORS } from "@scripts/utils";

interface SOCInfo {
    termStr: string;
    term: Term;
    year: number;
    program: Program;
    scraped_at: Date;
}

interface UID {
    courseUID: string;
    sectionUID: string | null;
}

export abstract class SOC_Generic {
    info: SOCInfo;
    courses: Course[];

    /* CONSTRUCT & INITIALIZE */

    protected constructor(info: SOCInfo, courses: Course[]) {
        this.info = info;
        this.courses = courses;
    }

    static async initialize(): Promise<SOC_Generic> {
        throw new Error("SOC initializer not implemented.");
    }

    /* UID */

    /**
     * Used to form a course/section's UID from the SOC.
     * @param courseInd -- The course/section's associated course index.
     * @param sectionInd -- The section's section index.
     * @returns The UID.
     */
    static formUID(
        courseInd: number,
        sectionInd: number | undefined = undefined,
    ) {
        return sectionInd === undefined
            ? `${courseInd}`
            : `${courseInd}#${sectionInd}`;
    }

    /**
     * Used to split a course/section's UID.
     * @param uid -- The course/section's UID.
     * @returns The split UID.
     */
    static splitUID(uid: string): UID {
        const sepInd = uid.indexOf("#");
        if (sepInd < 0)
            // No separator => Course
            return { courseUID: uid, sectionUID: null };

        // Separator => Section (in a Course)
        return {
            courseUID: uid.substring(0, sepInd),
            sectionUID: uid.substring(sepInd + 1),
        };
    }

    /**
     * Used to get a course/section from the SOC.
     * @param uid -- The course/section's UID.
     * @returns The course/section; null if there are no matches.
     */
    get(uid: string): Course | Section | null {
        const splitUID = SOC_Generic.splitUID(uid);
        if (!splitUID.sectionUID)
            // Resolve course
            return this.courses.at(parseInt(uid)) ?? null;
        else {
            // Resolve section
            const course = this.get(splitUID.courseUID);
            if (course instanceof Course)
                return (
                    course.sections.at(parseInt(splitUID.sectionUID)) ?? null
                ); // Section resolve
            return null;
        }
    }

    /* UID UTILS */

    /**
     * Used to get the course that a section belongs to.
     * @param sectionUID -- A `Section`'s UID.
     * @returns The course; null if it doesn't exist.
     */
    getCourseBySectionUID(sectionUID: string): Course | null {
        const splitUID = SOC_Generic.splitUID(sectionUID),
            course = this.get(splitUID.courseUID);
        if (course instanceof Course) return course;
        return null;
    }

    /* SEARCHING */

    /**
     * Note: Search for courses by a SearchBy and phrase.
     * @param searchBy -- The SearchBy to use.
     * @param phrase -- Ex. COT3100 (not case-sensitive)
     * @returns A promise for all courses that match; null if one doesn't exist.
     */
    searchCourses(searchBy: SearchBy, phrase: string): Course[] {
        console.log(`Searching by ${searchBy} for "${phrase}"`);
        if (!phrase)
            // Empty search phrase should not return all courses
            return [];

        const upperPhrase: string = phrase.toUpperCase();
        if (searchBy === SearchBy.COURSE_CODE) {
            return this.courses.filter((c) => c.code.includes(upperPhrase));
        } else if (searchBy === SearchBy.COURSE_TITLE) {
            return this.courses.filter((c) =>
                c.name.toUpperCase().includes(upperPhrase),
            );
        }
        throw new Error("Unhandled SearchBy.");
    }

    /* UTILS */

    static decodeTermString(termStr: string): { term: Term; year: number } {
        return {
            term: getTerm(termStr.substring(3)),
            year: parseInt(termStr.charAt(0) + "0" + termStr.substring(1, 3)),
        };
    }

    protected existsCourse(courseID: string, courseName: string): boolean {
        // There exists courses that are under the same course ID, but have different names (ex. MUN2800)
        return this.courses.some(
            (c) => c.id == courseID && c.name == courseName,
        );
    }
}

export class SOC_API extends SOC_Generic {
    static async initialize(
        {
            termStr,
            programStr,
        }: {
            termStr: string | undefined;
            programStr: string | undefined;
        } = {
            termStr: undefined,
            programStr: undefined,
        },
    ): Promise<SOC_API> {
        if (!termStr || !programStr)
            throw new Error("Term or program string was not provided.");

        const termStringInfo = this.decodeTermString(termStr);
        return new SOC_API(
            {
                termStr: termStr,
                term: termStringInfo.term,
                year: termStringInfo.year,
                program: getProgram(programStr),
                scraped_at: new Date(),
            },
            [],
        );
    }

    fetchSearchCourses(
        searchBy: SearchBy,
        phrase: string,
        cont: AbortController,
    ): CancellablePromise<Course[]> {
        const fetchPromise = this.fetchCourses(searchBy, phrase, cont);
        return new CancellablePromise<Course[]>(
            fetchPromise
                .then(() => this.searchCourses(searchBy, phrase))
                .catch((e) => {
                    if (e instanceof Cancellation)
                        console.log("Fetch was aborted.");
                    else throw e;
                    return [];
                }),
            () => cont.abort(),
        );
    }

    private fetchCache = new Set<string>();

    private async fetchCourses(
        searchBy: SearchBy,
        phrase: string,
        controller: AbortController,
        lcn = 0,
    ): Promise<void> {
        if (!phrase) return Promise.resolve();

        const search = JSON.stringify({ by: searchBy, phrase });
        if (this.fetchCache.has(search)) {
            console.log("Search has already already fetched. Not fetching.");
            return Promise.resolve();
        }
        console.log(
            `Fetching by ${searchBy} for "${phrase}"${
                lcn > 0 ? ` @ #${lcn}` : ""
            }`,
        );

        const searchURL =
            "https://one.uf.edu/apix/soc/schedule" +
            `?term=${this.info.termStr}` +
            `&category=${getProgramString(this.info.program)}` +
            `&last-control-number=${lcn}` +
            `&${getSearchByString(searchBy)}=${phrase}`;
        return fetchCORS(searchURL, { signal: controller.signal })
            .then(async (r) => await r.json())
            .then(async (j) => {
                const { COURSES, LASTCONTROLNUMBER, RETRIEVEDROWS } = j[0];

                // Add each course, if appropriate
                COURSES.forEach((courseJson: API_Course) => {
                    const courseID: string = courseJson.courseId,
                        courseCode: string = courseJson.code,
                        courseInd: number = this.courses.length;

                    // Prevent duplicates
                    const courseName = courseJson.name;
                    if (!this.existsCourse(courseID, courseName)) {
                        const course: Course = new Course(
                            SOC_API.formUID(courseInd),
                            this.info.term,
                            courseJson,
                        );
                        courseJson.sections.forEach(
                            (sectionJson: API_Section, sectionInd: number) => {
                                course.sections.push(
                                    new Section(
                                        SOC_API.formUID(courseInd, sectionInd),
                                        this.info.term,
                                        sectionJson,
                                        courseCode,
                                    ),
                                );
                            },
                        );
                        this.courses.push(course); // Add the course to the courses array
                    }
                });

                if (RETRIEVEDROWS == 50)
                    await this.fetchCourses(
                        searchBy,
                        phrase,
                        controller,
                        LASTCONTROLNUMBER,
                    );
            })
            .then(() => {
                this.fetchCache.add(search);
            })
            .catch((e) => {
                if (e.name === "AbortError") throw new Cancellation();
                throw e;
            });
    }
}
