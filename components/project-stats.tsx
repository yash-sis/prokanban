"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/lib/store"
import { CheckCircle2, Clock, Loader2, ListTodo } from "lucide-react"

export function ProjectStats() {
  const { projects } = useProjects()

  const stats = projects.reduce(
    (acc, project) => {
      project.tasks.forEach((task) => {
        acc.total++
        if (task.status === "IN_PROGRESS") acc.inProgress++
        if (task.status === "WAITING") acc.waiting++
        if (task.status === "COMPLETED") acc.completed++
      })
      return acc
    },
    {
      total: 0,
      inProgress: 0,
      waiting: 0,
      completed: 0,
    },
  )

  const completionPercentage = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">PROJECT STATS</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="relative flex items-center justify-center">
          <svg className="h-48 w-48 transform -rotate-90">
            <circle
              className="text-muted stroke-current"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
            <circle
              className="text-emerald-500 stroke-current"
              strokeWidth="12"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * completionPercentage) / 100}
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
          </svg>
          <span className="absolute text-2xl font-bold">{completionPercentage}%</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard title="TOTAL" value={stats.total.toString()} icon={<ListTodo className="h-4 w-4" />} />
          <StatCard title="IN PROGRESS" value={stats.inProgress.toString()} icon={<Loader2 className="h-4 w-4" />} />
          <StatCard title="WAITING" value={stats.waiting.toString()} icon={<Clock className="h-4 w-4" />} />
          <StatCard title="COMPLETED" value={stats.completed.toString()} icon={<CheckCircle2 className="h-4 w-4" />} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {title}
      </div>
      <div className="mt-1 font-semibold flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        {value}
      </div>
    </div>
  )
}

