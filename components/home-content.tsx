"use client"

import { ThemedButton } from "@/components/themed-button"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { Input } from "@/components/ui/input"
import { Mic, Sparkles, ArrowRight, Upload, FileText, BarChart3 } from "lucide-react"

interface HomeContentProps {
  onNewMeeting: () => void
}

export function HomeContent({ onNewMeeting }: HomeContentProps) {
  const { themeColors } = useThemeColors()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      {/* Main Icon */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-xl backdrop-blur-xl"
        style={{ backgroundColor: themeColors.primary }}
      >
        <Mic className="h-12 w-12 text-white" />
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl font-bold text-center mb-4">
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`,
          }}
        >
          Your Smart Meeting Assistant Awaits.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl leading-relaxed">
        Transform your meetings with AI-powered transcription, intelligent summaries, and instant insights. Upload audio
        files or start live recording to get started.
      </p>

      {/* Quick Action Input */}
      <div className="w-full max-w-2xl mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-5 w-5" style={{ color: themeColors.primary }} />
          </div>
          <Input
            placeholder="Ask AI to transcribe, summarize, or analyze your meeting instantly..."
            className="pl-12 pr-12 py-4 text-base rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/20 focus:bg-white/80 dark:focus:bg-gray-800/80 transition-colors"
          />
          <ThemedButton
            variant="primary"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl hover:scale-105"
          >
            <ArrowRight className="h-4 w-4" />
          </ThemedButton>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <ThemedButton
          variant="primary"
          onClick={onNewMeeting}
          className="px-8 py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Audio File
        </ThemedButton>
        <ThemedButton
          variant="outline"
          className="px-8 py-4 rounded-2xl font-medium hover:scale-105"
          style={{
            backgroundColor: "transparent",
            borderColor: themeColors.secondary,
            color: themeColors.secondary,
          }}
        >
          <Mic className="h-5 w-5 mr-2" />
          Start Live Recording
        </ThemedButton>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColors.primary}20` }}
          >
            <FileText className="h-6 w-6" style={{ color: themeColors.primary }} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Transcription</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Convert audio to accurate text with speaker identification and timestamps.
          </p>
        </div>

        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColors.secondary}20` }}
          >
            <Sparkles className="h-6 w-6" style={{ color: themeColors.secondary }} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Summaries</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate key points, decisions, and action items automatically.
          </p>
        </div>

        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColors.primary}20` }}
          >
            <BarChart3 className="h-6 w-6" style={{ color: themeColors.primary }} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ask questions about your meetings and get instant AI-powered answers.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-12 text-center">
        MeetingAI aims to help, but reviewing key info is always wise.
      </p>
    </div>
  )
}
