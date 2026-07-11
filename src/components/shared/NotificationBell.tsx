"use client"

import { useState, useEffect } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@/contexts/AuthContext"
import axiosInstance from "@/services/axiosInstance"
import { useRouter } from "next/navigation"

interface INotification {
  _id: string
  message: string
  type: string
  link: string
  isRead: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch initial notifications
  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const { data } = await axiosInstance.get("/notifications")
        if (data.success) {
          setNotifications(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
  }, [user])

  // Setup polling since Socket.IO is disabled for Vercel
  useEffect(() => {
    if (!user) return

    // Socket.IO is disabled for Vercel deployment
    /*
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const socketInstance = io(socketUrl, {
      withCredentials: true,
    })
    
    socketInstance.on("connect", () => {
      console.log("NotificationBell socket connected, registering user:", user._id)
      socketInstance.emit("register_user", user._id)
    })

    socketInstance.on("new_notification", (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev])
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
    */

    // Polling fallback
    const interval = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get("/notifications")
        if (data.success) {
          setNotifications(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch notifications during polling:", error)
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      try {
        await axiosInstance.patch(`/notifications/${notification._id}/read`)
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        )
      } catch (error) {
        console.error("Failed to mark as read:", error)
      }
    }
    setIsOpen(false)
    router.push(notification.link)
  }

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/notifications/read-all")
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${unreadCount} unread notifications`}
          className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50
                     dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950
                     rounded-lg"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center
                         justify-center rounded-full bg-blue-600 text-[10px]
                         font-bold text-white leading-none"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-white border border-slate-200 rounded-xl shadow-md p-0
                   dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex flex-col gap-1 px-4 py-3 cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "font-medium text-slate-900 dark:text-slate-100"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(notification.createdAt).toLocaleDateString()}{" "}
                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
