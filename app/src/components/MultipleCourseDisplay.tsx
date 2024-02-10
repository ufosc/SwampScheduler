import { Course } from "@scripts/soc";
import CourseDisplay from "@components/CourseDisplay";

interface Props {
    courses: Course[];
    storeHoveredElementSection: (courseID: string | null) => void;
    forgetHoveredElementSection: () => void;
    storeHoveredElementCourse: (courseId: string) => void;
    forgetHoveredElementCourse: () => void;
}

export default function MultipleCourseDisplay(props: Props) {
    const courses = props.courses.map((course: Course) => (
        <CourseDisplay
            key={course.uid}
            course={course}
            storeHoveredElementSection={props.storeHoveredElementSection}
            forgetHoveredElementSection={props.forgetHoveredElementSection}
            storeHoveredElementCourse={props.storeHoveredElementCourse}
            forgetHoveredElementCourse={props.forgetHoveredElementCourse}
        />
    ));

    return <div className="my-1">{courses}</div>;
}
