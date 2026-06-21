export type Internship = {
  id: string;
  company: string;
  position: string;
  location: string;
  status: "applied" | "interview" | "accepted" | "rejected";
};

export const internships: Internship[] = [];