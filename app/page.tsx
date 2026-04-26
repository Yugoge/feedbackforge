"use client";

import { Sparkles } from "lucide-react";
import { employees } from "@/lib/employees";
import { EmployeeCard } from "@/components/EmployeeCard";

function DashboardHeader() {
  return (
    <header className="mb-12 py-8 text-center sm:mb-16 sm:py-10">
      <div className="inline-flex items-center justify-center gap-2">
        <Sparkles className="h-6 w-6 text-blue-600" aria-hidden="true" />
        <h1 className="text-4xl font-bold text-slate-900">FeedbackCoach</h1>
      </div>
      <div className="mt-2 inline-flex items-center justify-center gap-2 text-sm text-slate-500">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
          aria-label="NormalCompany"
        >
          NC
        </div>
        <span>NormalCompany — Marketing Team</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Logged in as Alex, Marketing Team Manager
      </p>
    </header>
  );
}

// Dashboard — spec 5.5 + 5.7.3 (descriptions on cards).
export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <DashboardHeader />
      <section>
        <h2 className="mb-5 text-2xl font-semibold text-slate-900">Your Team</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </section>
    </main>
  );
}
