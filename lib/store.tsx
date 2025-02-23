"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type {
  Project,
  Task,
  Status,
  Priority,
  Attachment,
  FilterOptions,
  Comment,
  Tag,
  SortOption,
} from "@/types";

interface ProjectContextType {
  projects: Project[];
  searchQuery: string;
  filterOptions: FilterOptions;
  sortOrder: "asc" | "desc";
  sortOption: SortOption;
  createProject: (title: string, description: string) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  createTask: (
    projectId: string,
    title: string,
    description: string,
    priority: Priority
  ) => void;
  updateTask: (task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: Status) => void;
  updateTaskPriority: (
    projectId: string,
    taskId: string,
    priority: Priority
  ) => void;
  pinTask: (projectId: string, taskId: string) => void;
  unpinTask: (projectId: string, taskId: string) => void;
  addAttachment: (
    projectId: string,
    taskId: string,
    attachment: Attachment
  ) => void;
  removeAttachment: (
    projectId: string,
    taskId: string,
    attachmentId: string
  ) => void;
  addComment: (
    projectId: string,
    taskId: string,
    content: string,
    author: string
  ) => void;
  removeComment: (projectId: string, taskId: string, commentId: string) => void;
  addTag: (projectId: string, name: string, color: string) => void;
  removeTag: (projectId: string, tagId: string) => void;
  addTagToTask: (projectId: string, taskId: string, tagId: string) => void;
  removeTagFromTask: (projectId: string, taskId: string, tagId: string) => void;
  updateTaskDueDate: (
    projectId: string,
    taskId: string,
    dueDate: string
  ) => void;
  archiveTask: (projectId: string, taskId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterOptions: (options: FilterOptions) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSortOption: (option: SortOption) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortOption, setSortOption] = useState<SortOption>("createdAt");

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage when updated
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const createProject = (title: string, description: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title,
      description,
      tasks: [],
      createdAt: new Date().toISOString(),
      tags: [],
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const createTask = (
    projectId: string,
    title: string,
    description: string,
    priority: Priority
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "WAITING",
      priority,
      createdAt: new Date().toISOString(),
      projectId,
      isPinned: false,
      attachments: [],
      comments: [],
      tags: [],
    };

    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [...project.tasks, newTask],
          };
        }
        return project;
      })
    );
  };

  const updateTask = (updatedTask: Task) => {
    setProjects(
      projects.map((project) => {
        if (project.id === updatedTask.projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          };
        }
        return project;
      })
    );
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
          };
        }
        return project;
      })
    );
  };

  const updateTaskStatus = (
    projectId: string,
    taskId: string,
    status: Status
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, status } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const updateTaskPriority = (
    projectId: string,
    taskId: string,
    priority: Priority
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, priority } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const pinTask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, isPinned: true } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const unpinTask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, isPinned: false } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const addAttachment = (
    projectId: string,
    taskId: string,
    attachment: Attachment
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId
                ? { ...task, attachments: [...task.attachments, attachment] }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const removeAttachment = (
    projectId: string,
    taskId: string,
    attachmentId: string
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    attachments: task.attachments.filter(
                      (a) => a.id !== attachmentId
                    ),
                  }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const addComment = (
    projectId: string,
    taskId: string,
    content: string,
    author: string
  ) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString(),
      author,
    };

    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId
                ? { ...task, comments: [...task.comments, newComment] }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const removeComment = (
    projectId: string,
    taskId: string,
    commentId: string
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    comments: task.comments.filter((c) => c.id !== commentId),
                  }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const addTag = (projectId: string, name: string, color: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
    };

    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tags: [...project.tags, newTag],
          };
        }
        return project;
      })
    );
  };

  const removeTag = (projectId: string, tagId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tags: project.tags.filter((tag) => tag.id !== tagId),
            tasks: project.tasks.map((task) => ({
              ...task,
              tags: task.tags.filter((tag) => tag.id !== tagId),
            })),
          };
        }
        return project;
      })
    );
  };

  const addTagToTask = (projectId: string, taskId: string, tagId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const tag = project.tags.find((t) => t.id === tagId);
          if (tag) {
            return {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, tags: [...task.tags, tag] }
                  : task
              ),
            };
          }
        }
        return project;
      })
    );
  };

  const removeTagFromTask = (
    projectId: string,
    taskId: string,
    tagId: string
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    tags: task.tags.filter((tag) => tag.id !== tagId),
                  }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const updateTaskDueDate = (
    projectId: string,
    taskId: string,
    dueDate: string
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, dueDate } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const archiveTask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, status: "ARCHIVED" } : task
            ),
          };
        }
        return project;
      })
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        searchQuery,
        filterOptions,
        sortOrder,
        sortOption,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        updateTaskPriority,
        pinTask,
        unpinTask,
        addAttachment,
        removeAttachment,
        addComment,
        removeComment,
        addTag,
        removeTag,
        addTagToTask,
        removeTagFromTask,
        updateTaskDueDate,
        archiveTask,
        setSearchQuery,
        setFilterOptions,
        setSortOrder,
        setSortOption,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
