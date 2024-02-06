import { Semester, Term } from "@type/swampy";
import { getSocFilters } from "@/app/api/soc";
import { parseSocTerm } from "@/app/utils/soc-to-swampy";
import { log } from "node:util";

export enum WhichTerms {
  All,
  CurrentSchoolYear,
}

export async function getTerms(which: WhichTerms = WhichTerms.All) {
  const filters = await getSocFilters();
  if (filters == null) return null;

  const terms: Term[] = filters.terms.map(parseSocTerm);
  if (which == WhichTerms.CurrentSchoolYear) {
    const cutoff = // Index of next term whose semester is the same as the latest
      1 + terms.slice(1).findIndex((t) => t.semester == terms[0].semester);
    return terms.slice(0, cutoff); // "Year" of terms
  }
  return terms;
}
