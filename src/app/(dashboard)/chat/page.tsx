/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Loader2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Building,
  RefreshCw,
} from "lucide-react";
import Linkify from "react-linkify";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();

  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Parse query params for direct chat navigation
  const queryPartnerId = searchParams.get("partnerId");
  const queryPartnerName = searchParams.get("partnerName") || "New Chat";
  const queryPartnerRole = searchParams.get("partnerRole") || "candidate";

  // 1. Fetch chat rooms/partners
  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/chat/rooms");
      if (response.data?.success) {
        let list = response.data.data || [];
        
        // If query partnerId is present but not in rooms, insert a temporary one
        if (queryPartnerId && !list.find((r: any) => String(r.partnerId) === String(queryPartnerId))) {
          const tempRoom = {
            partnerId: queryPartnerId,
            partnerName: queryPartnerName,
            partnerRole: queryPartnerRole,
            lastMessage: "Start a conversation",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            isTemp: true,
          };
          list = [tempRoom, ...list];
        }
        
        setRooms(list);

        // Auto-select partner if query partnerId is matching
        if (queryPartnerId) {
          const partnerRoom = list.find((r: any) => String(r.partnerId) === String(queryPartnerId));
          if (partnerRoom) {
            setSelectedPartner(partnerRoom);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch chat rooms:", err);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, queryPartnerId]);

  // 2. Fetch message history when selected partner changes
  const fetchMessageHistory = async (partnerId: string) => {
    setLoadingMessages(true);
    try {
      const response = await axiosInstance.get(`/chat/history/${partnerId}`);
      if (response.data?.success) {
        setMessages(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!selectedPartner || !currentUser) return;

    fetchMessageHistory(selectedPartner.partnerId);

    // Socket.IO is disabled for Vercel deployment
    /*
    // Initialize Socket.IO connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";
    const socket = io(socketUrl, {
      withCredentials: true,
    });
    socketRef.current = socket;

    // Construct private room key (sorted user IDs to avoid order issues)
    const sortedIds = [String(currentUser._id), String(selectedPartner.partnerId)].sort();
    const roomName = `room_${sortedIds[0]}_${sortedIds[1]}`;

    // Join room when connected (handles reconnections)
    socket.on("connect", () => {
      socket.emit("join_room", roomName);
    });

    // Listen to incoming messages
    socket.on("receive_message", (message: any) => {
      // Only append if it's from the other person (we optimistically add our own)
      if (String(message.sender) !== String(currentUser._id)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Cleanup on partner change or unmount
    return () => {
      socket.disconnect();
    };
    */
  }, [selectedPartner, currentUser]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 3. Scroll to bottom of message list on new messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // 4. Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !currentUser || !selectedPartner) return;

    const messageContent = newMessageText.trim();
    const messageData = {
      sender: currentUser._id,
      receiver: selectedPartner.partnerId,
      content: messageContent,
    };

    // Optimistically add message to UI instantly
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      sender: currentUser._id,
      receiver: selectedPartner.partnerId,
      content: messageContent,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessageText("");

    try {
      // Send via REST API fallback since Socket.IO is disabled
      const response = await axiosInstance.post("/chat/send", messageData);
      
      if (response.data?.success) {
         // Replace temp message with actual message if needed, or just let polling handle it
         // fetchMessageHistory(selectedPartner.partnerId); // optional immediate refresh
      }
    } catch (error) {
      console.error("Failed to send message", error);
      // Remove temp message if failed
      setMessages((prev) => prev.filter(m => m._id !== tempMessage._id));
    }

    // Clear temp status on first message
    if (selectedPartner.isTemp) {
      setRooms((prev) =>
        prev.map((r) => (r.partnerId === selectedPartner.partnerId ? { ...r, isTemp: false } : r))
      );
    }
  };


  return (
    <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-[calc(100vh-64px-32px-180px)] overflow-hidden">
      {/* Left Pane: Rooms / Chats List */}
      <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex-col h-full bg-slate-50/40 dark:bg-slate-950/10 ${selectedPartner ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Conversations
          </h2>
        </div>

        <ScrollArea className="flex-1">
          {loadingRooms ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No conversations started yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {rooms.map((room) => {
                const isActive = selectedPartner?.partnerId === room.partnerId;
                const partnerInitials = room.partnerName
                  ?.split(" ")
                  ?.map((n: string) => n[0])
                  ?.join("")
                  ?.toUpperCase()
                  ?.slice(0, 2) || "CO";

                return (
                  <button
                    key={room.partnerId}
                    onClick={() => {
                      setSelectedPartner(room);
                      // Clear URL queries
                      router.replace("/chat");
                    }}
                    className={`w-full text-left p-4 flex gap-3 items-start transition-colors ${
                      isActive
                        ? "bg-blue-50/50 dark:bg-blue-950/20"
                        : "hover:bg-slate-100/40 dark:hover:bg-slate-800/20"
                    }`}
                  >
                    <div className="h-10 w-10 shrink-0 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl font-bold text-sm">
                      {partnerInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {room.partnerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(room.lastMessageTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {room.contextJobTitle && (
                        <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 truncate mt-0.5">
                          {room.contextJobTitle}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {room.lastMessage}
                      </p>
                    </div>
                    {room.unreadCount > 0 && (
                      <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[10px] font-bold rounded-full h-4.5 min-w-4.5 flex items-center justify-center">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Pane: Chat History & Input */}
      <div className={`flex-1 flex flex-col h-full ${!selectedPartner ? "hidden md:flex" : "flex"}`}>
        {selectedPartner ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl font-bold text-sm">
                  {selectedPartner.partnerName
                    ?.split(" ")
                    ?.map((n: string) => n[0])
                    ?.join("")
                    ?.toUpperCase()
                    ?.slice(0, 2) || "CO"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedPartner.partnerName}
                  </h3>
                  <Badge className="capitalize text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 mt-0.5 font-medium border-none">
                    {selectedPartner.partnerRole}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-500"
                  onClick={() => {
                    fetchMessageHistory(selectedPartner.partnerId);
                    axiosInstance.get("/chat/rooms").then(res => {
                      if (res.data?.success) setRooms(res.data.data);
                    }).catch(() => {});
                  }}
                  title="Refresh messages"
                >
                  <RefreshCw className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
                {/* Close chat (for mobile view back toggle) */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-slate-500"
                  onClick={() => setSelectedPartner(null)}
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Message History list */}
            <div ref={scrollContainerRef} className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 p-4 overflow-y-auto">
              {loadingMessages ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMyMessage = msg.sender === currentUser?._id;
                    return (
                      <div
                        key={msg._id || Math.random()}
                        className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3.5 rounded-2xl shadow-sm text-sm ${
                            isMyMessage
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-tl-none"
                          }`}
                        >
                          {msg.content && (
                            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                              <a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                                {decoratedText}
                              </a>
                            )}>
                              <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                            </Linkify>
                          )}
                          <span
                            className={`text-[9px] block text-right mt-1.5 ${
                              isMyMessage ? "text-blue-200" : "text-slate-400"
                            }`}
                          >
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Message Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3 items-center"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 rounded-xl h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={!newMessageText.trim()}
                className="h-11 w-11 p-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
            <MessageSquare className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start Messaging</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Select an active conversation room from the list or contact recruiters directly from applications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-[calc(100vh-64px-32px-180px)] overflow-hidden flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <span className="text-slate-500 dark:text-slate-400 mt-4 font-semibold">Loading chat room...</span>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
