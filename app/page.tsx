import Course from "@components/Course";
import FigmaCourse from "@components/FigmaCourse";

export default function Test() {
  return (
    <div className={"flex text-white"}>
      <div className={"w-min m-2"}>
        <Course />
      </div>
      <div className={"m-2"}>
        <FigmaCourse />
      </div>
    </div>
  );
}
