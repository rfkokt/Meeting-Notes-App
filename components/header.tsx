"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Moon, Users, Plus } from "lucide-react"

interface HeaderProps {
  onNewMeeting: () => void
}

export function Header({ onNewMeeting }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search meetings..." className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Users className="h-4 w-4" />
          </Button>
          <Button onClick={onNewMeeting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm">AH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
