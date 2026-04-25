"use client";

import { Sparkles } from "lucide-react";
import { employees } from "@/lib/employees";
import { EmployeeCard } from "@/components/EmployeeCard";

// Dashboard — spec 5.5 + 5.7.3 (descriptions on cards).
export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-slate-900">FeedbackForge</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          NormalCompany — Marketing Team
        </p>
        <p className="text-xs text-slate-400">
          Logged in as Alex, Marketing Team Manager
        </p>
      </header>

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
