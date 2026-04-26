"use client";

import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import type { Employee } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { employee: Employee };

function EmployeeHeader({ employee }: Props) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-12 w-12" aria-label={`${employee.name} avatar`}>
        <AvatarFallback
          className={`${employee.avatarColor} text-white font-semibold`}
        >
          {employee.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{employee.name}</h3>
        <p className="text-sm text-slate-500">{employee.role}</p>
        {employee.description ? (
          <p className="mt-1 text-xs italic text-slate-400">
            {employee.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function EmployeeBadges({ employee }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{employee.tenure}</Badge>
      <Badge variant="secondary">{employee.age}yo</Badge>
    </div>
  );
}

// Dashboard card — spec 5.5 + 5.7.3 description, ui-specialist F2 left-side
// color bar (4px wide, employee.avatarColor) for visual consistency.
export function EmployeeCard({ employee }: Props) {
  const router = useRouter();
  return (
    <Card className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-200 ease-out hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${employee.avatarColor}`}
        aria-hidden="true"
      />
      <CardContent className="flex flex-col gap-4 p-6 pl-7">
        <EmployeeHeader employee={employee} />
        <EmployeeBadges employee={employee} />
        <Button
          onClick={() => router.push(`/feedback/${employee.id}`)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Give Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
