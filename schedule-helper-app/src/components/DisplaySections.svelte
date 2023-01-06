<script lang="ts">
    import {slide} from 'svelte/transition';

    import {Course, Section, SOC} from "../scripts/soc";
    import {Generator} from "../scripts/generator";

    let soc = SOC.fetchSOC("https://tinyurl.com/uf-soc-scraped");

    async function getCoursesToDisplay() {
        let coursesToDisplay: Course[] = [];

        // Example Spring '23 Schedule
        coursesToDisplay.push(await (await soc).getCourse("CDA3101"));
        coursesToDisplay.push(await (await soc).getCourse("COP3530"));
        coursesToDisplay.push(await (await soc).getCourse("ENC3246"));
        coursesToDisplay.push(await (await soc).getCourse("MAP2302"));
        coursesToDisplay.push(await (await soc).getCourse("MHF3202"));

        return coursesToDisplay;
    }

    // We don't actually want to pass an array of courses, but this is just an
    // example so that we reuse the courses we are to display
    async function doGenerate(courses: Promise<Course[]>) {
        let selections: Array<Section[]> = [];
        for (const c of await courses)
            selections.push((await c).sections)

        let gen = await Generator.createGenerator("https://raw.githubusercontent.com/ufosc/Schedule_Helper/main/dev/schedule_of_courses/soc_scraped.json");
        gen.loadSelections(selections);
        console.log(await gen.generateSchedules());
    }

    let displayCourses = getCoursesToDisplay();
    doGenerate(displayCourses);
</script>

{#await displayCourses then courses}
    <!-- Courses -->
    {#each courses as course}
        <div class="mb-3">
            <p class="mx-4 text-xl text-slate-700 underline"><b>{course.code}</b> {course.name}</p>
            <div class="mx-5">
                <p class="text-slate-700">{course.description}</p>
            </div>

            <!-- Sections -->
            <div class="mx-6 my-2">
                {#each course.sections as section}
                    <!-- Section Card -->
                    <div transition:slide class="inline-block m-1">
                        <div class="w-full min-h-10 p-2 rounded-lg shadow-sm shadow-slate-400">
                            <!-- Card Header -->
                            <div class="flex flex-row justify-between items-center">
                                <p class="text-lg text-slate-600">{section.number}</p>
                            </div>

                            <p class="text-lg text-slate-400">{section.displayName}</p>
                            <p class="text-lg text-slate-400"><i>{section.instructors.join(', ')}</i></p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
{/await}
