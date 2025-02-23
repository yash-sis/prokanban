"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskList } from "@/components/task-list"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useProjects } from "@/lib/store"
import type { Project } from "@/types"
import { UpdateProjectDialog } from "@/components/update-project-dialog"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const { deleteProject } = useProjects()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start space-x-4">
          <Folder className="h-6 w-6 text-muted-foreground mt-1" />
          <div>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => deleteProject(project.id)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <CreateTaskDialog projectId={project.id} />
        </div>
        <TaskList project={project} />
      </CardContent>
      <UpdateProjectDialog project={project} open={showUpdateDialog} onOpenChange={setShowUpdateDialog} />
    </Card>
  )
}

