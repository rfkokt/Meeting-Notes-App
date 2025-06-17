"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Home,
  FileText,
  Mic,
  Clock,
  BookOpen,
  BarChart3,
  Settings,
  Puzzle,
  HelpCircle,
  ChevronLeft,
} from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const featureItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "transcripts", label: "Transcripts", icon: FileText },
    { id: "new-meeting", label: "New Meeting", icon: Mic },
    { id: "scheduled", label: "Scheduled", icon: Clock },
    { id: "summaries", label: "Summaries", icon: BookOpen },
    { id: "insights", label: "Insights", icon: BarChart3 },
  ]

  const settingsItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "integrations", label: "Integrations", icon: Puzzle },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">MeetingAI</h2>
                <p className="text-xs text-gray-500">Smart assistant for you.</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 h-8 w-8">
            <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Feature Section */}
        <div>
          {!isCollapsed && <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">FEATURE</h3>}
          <nav className="space-y-1">
            {featureItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onPageChange(item.id)}
                  className={`w-full justify-start h-10 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${isCollapsed ? "px-2" : "px-3"}`}
                >
                  <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && item.label}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Settings Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">SETTINGS</h3>
          )}
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onPageChange(item.id)}
                  className={`w-full justify-start h-10 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${isCollapsed ? "px-2" : "px-3"}`}
                >
                  <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && item.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">AH</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Achmad Hakim</p>
              <p className="text-xs text-gray-500 truncate">achmadhakim@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
