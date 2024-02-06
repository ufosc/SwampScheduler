import { getTerms, WhichTerms } from "@/app/api/swampy";
import { NextRequest } from "next/server";

interface Route {
  params: {
    which: string;
  };
}

export async function GET(request: NextRequest, route: Route) {
  const { which } = route.params;
  if (which == "all") return Response.json(await getTerms());
  else if (which == "latest")
    return Response.json(await getTerms(WhichTerms.CurrentSchoolYear));
  return Response.error();
}
