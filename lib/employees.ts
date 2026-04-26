import type { Employee } from "@/lib/types";

// Hardcoded NormalCompany Marketing team. Manager is "Alex" (interpolated server-side).
// Spec 5.3 + 5.7.3 (descriptions). Manager is hardcoded in lib/prompts.ts.
export const employees: Employee[] = [
  {
    id: "ken",
    name: "Ken",
    age: 25,
    role: "Junior Social Media Manager",
    tenure: "1 year at NormalCompany",
    department: "Marketing",
    avatarColor: "bg-blue-500",
    description: "Energetic newcomer, eager to learn",
  },
  {
    id: "jenny",
    name: "Jenny",
    age: 35,
    role: "Senior Social Media Manager",
    tenure: "7 years",
    department: "Marketing",
    avatarColor: "bg-purple-500",
    description: "Team veteran, deep institutional knowledge",
  },
  {
    id: "john",
    name: "John",
    age: 32,
    role: "Senior Marketing Manager",
    tenure: "5 years",
    department: "Marketing",
    avatarColor: "bg-green-500",
    description: "Reliable performer, strong client relationships",
  },
  {
    id: "clara",
    name: "Clara",
    age: 27,
    role: "Junior Marketing Manager",
    tenure: "2 years",
    department: "Marketing",
    avatarColor: "bg-amber-500",
    description: "Growing fast, detail-oriented",
  },
];

export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}
