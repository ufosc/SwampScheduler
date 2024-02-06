import { SOC_Endpoints } from "@constants/soc";
import { SOC_Course, SOC_Filters, SOC_Response } from "@type/soc";
import { Term } from "@type/swampy";

export async function getSocFilters(): Promise<SOC_Filters | null> {
  const res = await fetch(SOC_Endpoints.filters);

  if (res.ok) return await res.json();
  return null;
}

export async function searchSocCourses(
  term: string,
  program: string,
  courseCode: string,
  lastControlNum: number = 0
) {
  const res = await fetch(
    `${SOC_Endpoints.soc}?term=${term}&category=${program}&course-code=${courseCode}&`
  );
  if (res.ok) {
    const socResponse: SOC_Response = await res.json().then((x) => x[0]);
    return socResponse.COURSES;
  }
  return null;
}
