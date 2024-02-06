export enum Semester {
  Fall = "Fall",
  Spring = "Spring",
  Summer = "Summer",
  Summer_A = "Summer A",
  Summer_B = "Summer B",
  Summer_C = "Summer C",
}

export type Term = {
  term_id: string;
  semester: Semester;
  year: number;
};
