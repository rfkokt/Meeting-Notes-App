"use client";

import type React from "react";

import { AnimatedFloatingChat } from "@/components/animated-floating-chat";
import { HomeContent } from "@/components/home-content";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemedButton } from "@/components/themed-button";
import { TopNavbar } from "@/components/top-navbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  Download,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Upload,
  Volume2,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

function MeetingNotesApp() {
  const [currentPage, setCurrentPage] = useState("home");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [error, setError] = useState<string>("");
  const [audioReady, setAudioReady] = useState(false);
  const [expandedView, setExpandedView] = useState<
    "transcript" | "summary" | null
  >(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeColors } = useThemeColors();

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      console.log("Audio loaded, duration:", audio.duration);
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
        setAudioReady(true);
        setError("");
      }
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime !== undefined && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      setError("Failed to load audio file");
      setAudioReady(false);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      console.log("Audio can play");
      setAudioReady(true);
      setError("");
    };

    const handleLoadStart = () => {
      console.log("Audio load start");
      setAudioReady(false);
    };

    const handleLoadedData = () => {
      console.log("Audio data loaded");
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      console.log("Duration changed:", audio.duration);
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [uploadedFile]); // Empty dependency array to avoid re-running

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type);

    // Reset states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioReady(false);
    setError("");

    // Clean up previous audio URL
    const audio = audioRef.current;
    if (audio && audio.src) {
      URL.revokeObjectURL(audio.src);
    }

    setUploadedFile(file);

    if (file.type.startsWith("audio/")) {
      if (audio) {
        // Create object URL for the file
        const url = URL.createObjectURL(file);
        console.log("Created audio URL:", url);

        // Set the source and load
        audio.src = url;
        audio.load();
      }
    }
  };

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !audioReady) {
      console.log("Audio not ready");
      return;
    }

    try {
      if (isPlaying) {
        console.log("Pausing audio");
        audio.pause();
      } else {
        console.log("Playing audio");
        await audio.play();
      }
    } catch (err) {
      console.error("Play/pause error:", err);
      setError("Unable to play audio");
      setIsPlaying(false);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const time = Number.parseFloat(event.target.value);

    if (audio && !isNaN(time) && audioReady) {
      // Update UI immediately for smooth interaction
      setCurrentTime(time);
      // Then update audio position
      audio.currentTime = time;
    }
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        audio.pause();
      }
    }
  };

  const formatTime = (time: number): string => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSummarize = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTranscript = `Meeting Transcript - ${new Date().toLocaleDateString()}

[00:00] John: Good morning everyone, thank you for joining today's quarterly review meeting.
[00:15] Sarah: Thanks John. I'd like to start by reviewing our Q3 performance metrics.
[00:30] Mike: Our sales numbers exceeded expectations by 15%, reaching $2.3M in revenue.
[00:45] Sarah: That's excellent news. The marketing campaigns we launched in July really paid off.
[01:00] John: What about our customer satisfaction scores?
[01:15] Lisa: We maintained a 4.7/5 rating across all platforms, with particularly strong feedback on our customer support.
[01:30] Mike: I think we should discuss the upcoming product launch for Q4.
[01:45] Sarah: Yes, we're on track for the November release. Beta testing starts next week.
[02:00] John: Any concerns or blockers we need to address?
[02:15] Lisa: We might need additional support staff for the holiday season.
[02:30] John: Let's schedule a follow-up meeting to discuss staffing needs. Great work everyone!`;

      const mockSummary = `Meeting Summary

Date & Time: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

Participants:
• John (Meeting Lead)
• Sarah (Marketing)  
• Mike (Sales)
• Lisa (Customer Support)

Short Summary:
Quarterly review meeting discussing Q3 performance and Q4 planning. Strong sales performance with 15% growth and excellent customer satisfaction scores.

Key Points:
• Q3 revenue reached $2.3M, exceeding targets by 15%
• Customer satisfaction maintained at 4.7/5 rating
• Marketing campaigns in July were highly successful
• Product launch scheduled for November

Decisions:
• Proceed with November product launch as planned
• Beta testing to begin next week
• Schedule follow-up meeting for staffing discussion

Follow-Up Actions:
• Schedule staffing needs meeting (John)
• Begin beta testing preparation (Sarah)
• Prepare holiday season support plan (Lisa)`;

      setTranscript(mockTranscript);
      setSummary(mockSummary);
    } catch (err) {
      setError("Failed to process the file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
      audio.src = "";
    }

    setUploadedFile(null);
    setTranscript("");
    setSummary("");
    setChatMessages([]);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioReady(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim() || !transcript) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Based on the meeting transcript, I can help answer your question about "${chatInput}". The meeting covered quarterly performance, with strong sales growth of 15% and excellent customer satisfaction scores. Is there a specific aspect you'd like me to elaborate on?`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setChatInput("");
  };

  const handleDownload = () => {
    if (!summary) return;

    try {
      const element = document.createElement("a");
      const file = new Blob([summary], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `meeting-summary-${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (err) {
      setError("Failed to download the summary. Please try again.");
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomeContent onNewMeeting={() => setCurrentPage("new-meeting")} />
        );

      case "new-meeting":
        return (
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                New Meeting
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your meeting audio or start a new recording
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Upload Section */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 mb-8 overflow-hidden">
              <div className="p-8">
                <div className="space-y-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Upload audio with format MP3, WAV or TXT file
                  </div>

                  <div
                    className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-opacity-70 transition-all duration-200"
                    style={{ borderColor: `${themeColors.primary}60` }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110"
                      style={{ backgroundColor: `${themeColors.primary}20` }}
                    >
                      <Upload
                        className="h-8 w-8"
                        style={{ color: themeColors.primary }}
                      />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                      {uploadedFile
                        ? uploadedFile.name
                        : "Click to upload or drag and drop your file here"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports MP3, WAV, and TXT files
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".mp3,.wav,.txt,audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Audio Controls */}
                  {uploadedFile && uploadedFile.type.startsWith("audio/") && (
                    <div className="bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-600/20">
                      <div className="flex items-center space-x-4 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={togglePlayPause}
                          disabled={!audioReady}
                          className="flex items-center space-x-2 rounded-full border-white/20 dark:border-gray-600/20 bg-white/50 dark:bg-gray-700/50 transition-all hover:scale-105 disabled:opacity-50"
                          style={{ borderColor: `${themeColors.primary}40` }}
                        >
                          {!audioReady ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetAudio}
                          disabled={!audioReady}
                          className="rounded-full border-white/20 dark:border-gray-600/20 bg-white/50 dark:bg-gray-700/50 transition-all hover:scale-105 disabled:opacity-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>

                        <Volume2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="relative">
                        <style jsx>{`
                          .audio-slider {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 100%;
                            height: 8px;
                            border-radius: 5px;
                            background: linear-gradient(
                              to right,
                              ${themeColors.primary} 0%,
                              ${themeColors.primary}
                                ${Math.min(
                                  100,
                                  (currentTime / (duration || 1)) * 100
                                )}%,
                              #e5e7eb
                                ${Math.min(
                                  100,
                                  (currentTime / (duration || 1)) * 100
                                )}%,
                              #e5e7eb 100%
                            );
                            outline: none;
                            transition: background 0.1s linear;
                          }

                          .audio-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: ${themeColors.primary};
                            cursor: pointer;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                            transition: transform 0.2s ease,
                              box-shadow 0.2s ease;
                            position: relative;
                            z-index: 1;
                          }

                          .audio-slider::-moz-range-thumb {
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: ${themeColors.primary};
                            cursor: pointer;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                            transition: transform 0.2s ease,
                              box-shadow 0.2s ease;
                            position: relative;
                            z-index: 1;
                          }
                        `}</style>
                        <input
                          type="range"
                          min="0"
                          max={duration || 0.001}
                          step="0.1"
                          value={currentTime}
                          onChange={handleSeek}
                          disabled={!audioReady || !duration}
                          className="audio-slider"
                        />
                      </div>

                      {/* Debug info - can be removed in production */}
                      <div className="mt-2 text-xs text-gray-500">
                        Audio Ready: {audioReady ? "Yes" : "No"} | Duration:{" "}
                        {duration.toFixed(1)}s | Current:{" "}
                        {currentTime.toFixed(1)}s | Playing:{" "}
                        {isPlaying ? "Yes" : "No"}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <ThemedButton
                      variant="primary"
                      onClick={handleSummarize}
                      disabled={!uploadedFile || isProcessing}
                      className="flex-1 rounded-2xl py-4 font-medium shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "SUMMARIZE"
                      )}
                    </ThemedButton>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-red-300/50 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:border-red-400/50 rounded-2xl py-4 font-medium transition-all duration-200 hover:scale-105"
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {(transcript || summary) && (
              <>
                {/* Expanded View */}
                {expandedView && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
                      <div
                        className="text-white p-6 flex items-center justify-between"
                        style={{
                          backgroundColor: "#2c2c2c",
                          // backgroundColor:
                          //   expandedView === "transcript"
                          //     ? themeColors.primary
                          //     : themeColors.secondary,
                        }}
                      >
                        <h3 className="text-xl font-semibold">
                          {expandedView === "transcript"
                            ? "Hasil Transkip"
                            : "Ringkasan"}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const content =
                                expandedView === "transcript"
                                  ? transcript
                                  : summary;
                              const filename =
                                expandedView === "transcript"
                                  ? "meeting-transcript"
                                  : "meeting-summary";
                              const element = document.createElement("a");
                              const file = new Blob([content], {
                                type: "text/plain",
                              });
                              element.href = URL.createObjectURL(file);
                              element.download = `${filename}-${
                                new Date().toISOString().split("T")[0]
                              }.txt`;
                              document.body.appendChild(element);
                              element.click();
                              document.body.removeChild(element);
                              URL.revokeObjectURL(element.href);
                            }}
                            className="text-white hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedView(null)}
                            className="text-white hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 p-8">
                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-w-none">
                          {expandedView === "transcript" ? transcript : summary}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}

                {/* Normal Grid View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                    <div
                      className="text-white p-6 flex items-center justify-between"
                      style={{ backgroundColor: "#2c2c2c" }} //backgroundColor: themeColors.primary }}
                    >
                      <h3 className="text-lg font-semibold">Hasil Transkip</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedView("transcript")}
                          className="text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const element = document.createElement("a");
                            const file = new Blob([transcript], {
                              type: "text/plain",
                            });
                            element.href = URL.createObjectURL(file);
                            element.download = `meeting-transcript-${
                              new Date().toISOString().split("T")[0]
                            }.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                            URL.revokeObjectURL(element.href);
                          }}
                          className="text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-96 p-6">
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {transcript || "No transcript available yet..."}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                    <div
                      className="text-white p-6 flex items-center justify-between"
                      style={{ backgroundColor: "#2c2c2c" }} //backgroundColor: themeColors.primary }}
                    >
                      <h3 className="text-lg font-semibold">Ringkasan</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedView("summary")}
                          className="text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const element = document.createElement("a");
                            const file = new Blob([summary], {
                              type: "text/plain",
                            });
                            element.href = URL.createObjectURL(file);
                            element.download = `meeting-summary-${
                              new Date().toISOString().split("T")[0]
                            }.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                            URL.revokeObjectURL(element.href);
                          }}
                          className="text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-96 p-6">
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {summary || "No summary available yet..."}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </>
            )}

            {/* Download Button
            {summary && (
              <div className="text-center">
                <ThemedButton
                  variant="secondary"
                  onClick={handleDownload}
                  className="px-12 py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <Download className="h-5 w-5 mr-3" />
                  DOWNLOAD SUMMARIZE
                </ThemedButton>
              </div>
            )} */}

            {/* Hidden Audio Element */}
            <audio ref={audioRef} preload="metadata" />
          </div>
        );

      case "settings":
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure your preferences and account settings.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This feature is under development.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TopNavbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onNewMeeting={() => setCurrentPage("new-meeting")}
      />
      <main className="transition-all duration-300">{renderContent()}</main>
      <AnimatedFloatingChat
        transcript={transcript}
        chatMessages={chatMessages}
        chatInput={chatInput}
        onChatInputChange={setChatInput}
        onChatSubmit={handleChatSubmit}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="meetingai-theme">
      <MeetingNotesApp />
    </ThemeProvider>
  );
}
