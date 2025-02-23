"use client";

import type React from "react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useProjects } from "@/lib/store";
import type { Project, Status, Task, SortOption } from "@/types";
import { TaskCard } from "@/components/task-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2, CheckCircle2, Archive } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskListProps {
  project: Project;
}

const columns: { id: Status; title: string; icon: React.ReactNode }[] = [
  { id: "WAITING", title: "Waiting", icon: <Clock className="h-4 w-4" /> },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    icon: <Loader2 className="h-4 w-4" />,
  },
  {
    id: "COMPLETED",
    title: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  { id: "ARCHIVED", title: "Archived", icon: <Archive className="h-4 w-4" /> },
];

export function TaskList({ project }: TaskListProps) {
  const {
    updateTaskStatus,
    searchQuery,
    filterOptions,
    sortOrder,
    sortOption,
    setSortOption,
  } = useProjects();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    updateTaskStatus(
      project.id,
      draggableId,
      destination.droppableId as Status
    );
  };

  const getFilteredTasks = (tasks: Task[], status: Status) => {
    return tasks
      .filter((task) => task.status === status)
      .filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(
        (task) =>
          (!filterOptions.status || task.status === filterOptions.status) &&
          (!filterOptions.priority ||
            task.priority === filterOptions.priority) &&
          (!filterOptions.tags ||
            filterOptions.tags.every((tagId) =>
              task.tags.some((tag) => tag.id === tagId)
            ))
      )
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        switch (sortOption) {
          case "dueDate":
            return sortOrder === "asc"
              ? new Date(a.dueDate || "").getTime() -
                  new Date(b.dueDate || "").getTime()
              : new Date(b.dueDate || "").getTime() -
                  new Date(a.dueDate || "").getTime();
          case "priority":
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            return sortOrder === "asc"
              ? priorityOrder[a.priority] - priorityOrder[b.priority]
              : priorityOrder[b.priority] - priorityOrder[a.priority];
          case "createdAt":
            return sortOrder === "asc"
              ? new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime();
          case "title":
            return sortOrder === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mb-4">
        <Select
          value={sortOption}
          onValueChange={(value: SortOption) => setSortOption(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Card key={column.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {column.icon}
                {column.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[200px]"
                  >
                    {getFilteredTasks(project.tasks, column.id).length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground p-4">
                        No tasks in this column
                      </div>
                    ) : (
                      getFilteredTasks(project.tasks, column.id).map(
                        (task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard task={task} projectId={project.id} />
                              </div>
                            )}
                          </Draggable>
                        )
                      )
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
}
