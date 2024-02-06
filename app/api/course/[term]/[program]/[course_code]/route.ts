import { searchSocCourses } from "@/app/api/soc";
import { NextRequest } from "next/server";

interface Route {
  params: {
    term: string;
    program: string;
    course_code: string;
  };
}

export async function GET(request: NextRequest, route: Route) {
  const { term, program, course_code } = route.params;
  return Response.json(await searchSocCourses(term, program, course_code));
}
