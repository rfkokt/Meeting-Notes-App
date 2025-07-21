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
import axios from "axios";
import {
  Download,
  Gauge,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Upload,
  Volume2,
  VolumeX,
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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const speedControlRef = useRef<HTMLDivElement>(null);
  const { themeColors } = useThemeColors();

  const speedOptions = [0.5, 1, 1.25, 1.5, 1.75, 2];

  // Handle click outside to close controls
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeControlRef.current &&
        !volumeControlRef.current.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false);
      }
      if (
        speedControlRef.current &&
        !speedControlRef.current.contains(event.target as Node)
      ) {
        setShowSpeedControl(false);
      }
    };

    if (showVolumeSlider || showSpeedControl) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showVolumeSlider, showSpeedControl]);

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
        audio.volume = isMuted ? 0 : volume;
        audio.playbackRate = playbackSpeed;
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

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmute: restore previous volume
      const volumeToRestore = previousVolume > 0 ? previousVolume : 0.5;
      setVolume(volumeToRestore);
      setIsMuted(false);
      audio.volume = volumeToRestore;
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      audio.volume = 0;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    // If volume is set to 0, consider it muted
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      // If we're changing volume from 0 to something else, unmute
      setIsMuted(false);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
    // Close speed control if open
    if (showSpeedControl) {
      setShowSpeedControl(false);
    }
  };

  const toggleSpeedControl = () => {
    setShowSpeedControl(!showSpeedControl);
    // Close volume control if open
    if (showVolumeSlider) {
      setShowVolumeSlider(false);
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
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await axios.post(
        "https://notulensi-api.cml.apps.dataservice.kemenkeu.go.id/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { transcription, summary } = response.data;

      setTranscript(transcription);
      setSummary(summary);
    } catch (err) {
      console.error(err);
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

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !transcript) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      setIsThinking(true);
      const response = await axios.post(
        "https://notulensi-api.cml.apps.dataservice.kemenkeu.go.id/chat",
        {
          message: chatInput,
          max_history: 0,
        }
      );
      console.log("debug response", response);

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.data.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content:
          "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsThinking(false);
    }
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

                        {/* Volume Control */}
                        <div className="relative" ref={volumeControlRef}>
                          <button
                            onClick={toggleVolumeSlider}
                            className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors"
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="h-4 w-4 text-gray-400 cursor-pointer" />
                            ) : (
                              <Volume2 className="h-4 w-4 text-gray-400 cursor-pointer" />
                            )}
                          </button>

                          {showVolumeSlider && (
                            <div className="absolute left-0 bottom-full mb-2 z-20">
                              <div className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/30 dark:border-gray-700/30 min-w-[160px]">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={toggleMute}
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    {isMuted || volume === 0 ? (
                                      <VolumeX className="h-3 w-3 text-gray-500" />
                                    ) : (
                                      <Volume2 className="h-3 w-3 text-gray-500" />
                                    )}
                                  </button>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={(e) =>
                                      handleVolumeChange(
                                        Number.parseFloat(e.target.value)
                                      )
                                    }
                                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                                    style={{
                                      background: `linear-gradient(to right, ${
                                        themeColors.primary
                                      } 0%, ${themeColors.primary} ${
                                        volume * 100
                                      }%, #e5e7eb ${
                                        volume * 100
                                      }%, #e5e7eb 100%)`,
                                    }}
                                  />
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[2.5rem] font-mono">
                                    {Math.round(volume * 100)}%
                                  </span>
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-gray-400">
                                  <button
                                    onClick={() => handleVolumeChange(0.25)}
                                    className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    25%
                                  </button>
                                  <button
                                    onClick={() => handleVolumeChange(0.5)}
                                    className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    50%
                                  </button>
                                  <button
                                    onClick={() => handleVolumeChange(0.75)}
                                    className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    75%
                                  </button>
                                  <button
                                    onClick={() => handleVolumeChange(1)}
                                    className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    100%
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Speed Control */}
                        <div className="relative" ref={speedControlRef}>
                          <button
                            onClick={toggleSpeedControl}
                            className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors flex items-center space-x-1"
                          >
                            <Gauge className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono min-w-[2rem]">
                              {playbackSpeed}x
                            </span>
                          </button>

                          {showSpeedControl && (
                            <div className="absolute left-0 bottom-full mb-2 z-20">
                              <div className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/30 dark:border-gray-700/30 min-w-[180px]">
                                <div className="mb-3">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Gauge className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                      Playback Speed
                                    </span>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                      {playbackSpeed}x
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {speedOptions.map((speed) => (
                                    <button
                                      key={speed}
                                      onClick={() => handleSpeedChange(speed)}
                                      className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                                        playbackSpeed === speed
                                          ? "text-white shadow-md"
                                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      }`}
                                      style={
                                        playbackSpeed === speed
                                          ? {
                                              backgroundColor:
                                                themeColors.primary,
                                            }
                                          : {}
                                      }
                                    >
                                      {speed}x
                                    </button>
                                  ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <div className="flex justify-between text-xs text-gray-400">
                                    <span>Slower</span>
                                    <span>Normal</span>
                                    <span>Faster</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

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

                          .slider-thumb::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background: ${themeColors.primary};
                            cursor: pointer;
                            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                            transition: transform 0.2s ease;
                          }

                          .slider-thumb::-webkit-slider-thumb:hover {
                            transform: scale(1.1);
                          }

                          .slider-thumb::-moz-range-thumb {
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background: ${themeColors.primary};
                            cursor: pointer;
                            border: none;
                            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
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
                        {isPlaying ? "Yes" : "No"} | Muted:{" "}
                        {isMuted ? "Yes" : "No"} | Speed: {playbackSpeed}x |
                        Volume Slider: {showVolumeSlider ? "Open" : "Closed"} |
                        Speed Control: {showSpeedControl ? "Open" : "Closed"}
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
                      className="flex-1 border-red-300/50 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:border-red-400/50 rounded-2xl py-4 font-medium transition-all duration-200 hover:scale-105 bg-transparent"
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

            {/* Hidden Audio Element */}
            <audio ref={audioRef} preload="metadata" />
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
        isThinking={isThinking}
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
