"use client"

import { ChevronDown, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/lib/store"
import { ProjectCard } from "@/components/project-card"

export function ProjectBoard() {
  const { projects, searchQuery, sortOrder, setSortOrder } = useProjects()

  const filteredProjects = projects
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tasks.some(
          (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      const comparison = a.title.localeCompare(b.title)
      return sortOrder === "asc" ? comparison : -comparison
    })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Projects
        </CardTitle>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-sm gap-1"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            A-Z Sort
            <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProjects.length === 0 ? (
          <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
            {searchQuery ? "No matching projects or tasks found" : "No Projects Yet!"}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

