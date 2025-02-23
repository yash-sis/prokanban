"use client"

import { Search, Filter } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useProjects } from "@/lib/store"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import type { Status, Priority } from "@/types"

export function Header() {
  const { setSearchQuery, setFilterOptions } = useProjects()
  const [status, setStatus] = useState<Status | "ALL">("ALL")
  const [priority, setPriority] = useState<Priority | "ALL">("ALL")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleStatusChange = (value: Status | "ALL") => {
    setStatus(value)
    setFilterOptions((prev) => ({
      ...prev,
      status: value === "ALL" ? undefined : value,
    }))
  }

  const handlePriorityChange = (value: Priority | "ALL") => {
    setPriority(value)
    setFilterOptions((prev) => ({
      ...prev,
      priority: value === "ALL" ? undefined : value,
    }))
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">Pro</div>
          <span>KanBan</span>
        </Link>
        <div className="flex-1 max-w-xl mx-auto relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search projects and tasks..."
              className="w-full pl-8"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
                <DropdownMenuRadioItem value="ALL">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="WAITING">Waiting</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="IN_PROGRESS">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="COMPLETED">Completed</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={priority} onValueChange={handlePriorityChange}>
                <DropdownMenuRadioItem value="ALL">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="LOW">Low</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="MEDIUM">Medium</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="HIGH">High</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <CreateProjectDialog />
        </div>
      </div>
    </header>
  )
}

