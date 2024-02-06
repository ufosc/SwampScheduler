import { Semester, Term } from "@type/swampy";
import { SOC_Filter_Term } from "@type/soc";

export function parseSocTerm({ CODE }: SOC_Filter_Term): Term {
  const termSufferToSemester: Record<string, Semester> = {
    "1": Semester.Spring,
    "5": Semester.Summer,
    "56W1": Semester.Summer_A,
    "56W2": Semester.Summer_B,
    "51": Semester.Summer_C,
    "8": Semester.Fall,
  };

  const prefix = CODE.substring(0, 3),
    suffix = CODE.substring(3);
  return {
    term_id: CODE,
    semester: termSufferToSemester[suffix],
    year: parseInt(`${prefix.charAt(0)}0${prefix.substring(1)}`),
  };
}
