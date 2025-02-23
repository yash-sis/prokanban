"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Clock,
  Loader2,
  CheckCircle2,
  Flag,
  Paperclip,
  Link,
  Pin,
  File,
  Calendar,
  MessageSquare,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/lib/store";
import type { Task, Priority, Attachment } from "@/types";
import { UpdateTaskDialog } from "@/components/update-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isAfter, isBefore, addDays } from "date-fns";

interface TaskCardProps {
  task: Task;
  projectId: string;
}

const statusConfig = {
  WAITING: { label: "Waiting", icon: Clock, color: "bg-yellow-500" },
  IN_PROGRESS: { label: "In Progress", icon: Loader2, color: "bg-blue-500" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, color: "bg-green-500" },
  ARCHIVED: { label: "Archived", icon: Archive, color: "bg-gray-500" },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  LOW: { label: "Low", color: "bg-gray-500" },
  MEDIUM: { label: "Medium", color: "bg-orange-500" },
  HIGH: { label: "High", color: "bg-red-500" },
};

export function TaskCard({ task, projectId }: TaskCardProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [comment, setComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    deleteTask,
    updateTaskPriority,
    pinTask,
    unpinTask,
    addAttachment,
    removeAttachment,
    addComment,
    removeComment,
    addTagToTask,
    removeTagFromTask,
    updateTaskDueDate,
    archiveTask,
  } = useProjects();

  const {
    label: statusLabel,
    icon: StatusIcon,
    color: statusColor,
  } = statusConfig[task.status];
  const { label: priorityLabel, color: priorityColor } =
    priorityConfig[task.priority];

  const handleAddUrlAttachment = () => {
    const newAttachment: Attachment = {
      id: crypto.randomUUID(),
      type: "link",
      url: attachmentUrl,
      name: attachmentName || attachmentUrl,
    };
    addAttachment(projectId, task.id, newAttachment);
    setAttachmentUrl("");
    setAttachmentName("");
    setShowAttachmentDialog(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: crypto.randomUUID(),
          type: "file",
          name: file.name,
          fileData: e.target?.result as string,
          mimeType: file.type,
        };
        addAttachment(projectId, task.id, newAttachment);
        setShowAttachmentDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComment = () => {
    addComment(projectId, task.id, comment, "Current User"); // Replace with actual user name
    setComment("");
    setShowCommentDialog(false);
  };

  const getDueDateColor = () => {
    if (!task.dueDate) return "bg-gray-500";
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    if (isAfter(today, dueDate)) return "bg-red-500";
    if (isBefore(today, addDays(dueDate, -2))) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <Card className={task.isPinned ? "border-2 border-primary" : ""}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3">
        <div>
          <CardTitle className="text-sm">{task.title}</CardTitle>
          <CardDescription className="text-xs">
            {task.description}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Flag className="h-4 w-4 mr-2" />
                Set Priority
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={task.priority}
                  onValueChange={(value) =>
                    updateTaskPriority(
                      projectId,
                      task.id,
                      value as "LOW" | "MEDIUM" | "HIGH"
                    )
                  }
                >
                  <DropdownMenuRadioItem value="LOW">Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MEDIUM">
                    Medium
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="HIGH">
                    High
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => setShowAttachmentDialog(true)}>
              <Paperclip className="h-4 w-4 mr-2" />
              Add Attachment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCommentDialog(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                task.isPinned
                  ? unpinTask(projectId, task.id)
                  : pinTask(projectId, task.id)
              }
            >
              <Pin className="h-4 w-4 mr-2" />
              {task.isPinned ? "Unpin Task" : "Pin Task"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => archiveTask(projectId, task.id)}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Task
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => deleteTask(projectId, task.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={`${statusColor} text-white`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusLabel}
          </Badge>
          <Badge variant="secondary" className={`${priorityColor} text-white`}>
            <Flag className="h-3 w-3 mr-1" />
            {priorityLabel}
          </Badge>
          {task.dueDate && (
            <Badge
              variant="secondary"
              className={`${getDueDateColor()} text-white`}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </Badge>
          )}
        </div>
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags?.map((tag) => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color }}
                className="text-white"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        {task.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.attachments.map((attachment) => (
              <Badge
                key={attachment.id}
                variant="outline"
                className="flex items-center gap-1"
              >
                {attachment.type === "link" ? (
                  <Link className="h-3 w-3" />
                ) : (
                  <File className="h-3 w-3" />
                )}
                {attachment.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() =>
                    removeAttachment(projectId, task.id, attachment.id)
                  }
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
        {/* {task.comments?.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold mb-1">Comments</h4>
            {task.comments?.map((comment) => (
              <div key={comment.id} className="text-xs mb-1">
                <span className="font-semibold">{comment.author}:</span>{" "}
                {comment.content}
              </div>
            ))}
          </div>
        )} */}
      </CardContent>
      <UpdateTaskDialog
        task={task}
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
      />
      <Dialog
        open={showAttachmentDialog}
        onOpenChange={setShowAttachmentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachment</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddUrlAttachment}>
                Add URL Attachment
              </Button>
            </TabsContent>
            <TabsContent value="file">
              <div className="grid gap-4 py-4">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="comment">Comment</Label>
            <Input
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <Button onClick={handleAddComment}>Add Comment</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
