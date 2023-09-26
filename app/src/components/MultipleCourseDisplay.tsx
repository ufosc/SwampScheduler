import { Course } from "@scripts/soc";
import CourseDisplay from "@components/CourseDisplay";

interface Props {
    courses: Course[];
    handleHoverSection: (courseID: string | null) => void;
    handleUnhoverSection: () => void;
    handleHoverCourse: (courseId: string) => void;
    handleUnhoverCourse: () => void;
}

export default function MultipleCourseDisplay(props: Props) {
    const courses = props.courses.map((course: Course) => (
        <CourseDisplay
            key={course.uid}
            course={course}
            handleHoverSection={props.handleHoverSection}
            handleUnhoverSection={props.handleUnhoverSection}
            handleHoverCourse={props.handleHoverCourse}
            handleUnhoverCourse={props.handleUnhoverCourse}
        />
    ));

    return <div className="my-1">{courses}</div>;
}
