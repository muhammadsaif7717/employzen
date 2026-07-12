"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import axiosInstance from "@/services/axiosInstance"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchNotifications = async () => {
      try {
        const { data } = await axiosInstance.get("/notifications")
        if (data.success) setNotifications(data.data)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }
    fetchNotifications()
  }, [user])

  useEffect(() => {
    if (!user) return
    const interval = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get("/notifications")
        if (data.success) setNotifications(data.data)
      } catch (error) {
        console.error("Failed to fetch notifications during polling:", error)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      try {
        await axiosInstance.patch(`/notifications/${notification._id}/read`)
        setNotifications((prev) =>
          prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
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

  const deleteAllNotifications = async () => {
    try {
      await axiosInstance.delete("/notifications/delete-all")
      setNotifications([])
    } catch (error) {
      console.error("Failed to delete all notifications:", error)
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
          className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center",
                "justify-center rounded-full bg-primary text-[10px]",
                "font-bold text-primary-foreground leading-none",
                "animate-pulse-dot"
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-popover border border-border rounded-xl shadow-lg shadow-primary/5 p-0 animate-scale-in overflow-hidden"
      >
        {/* Top accent border */}
        <div className="h-0.5 gradient-brand w-full" />

        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-foreground">Notifications</p>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                title="Delete all"
                onClick={deleteAllNotifications}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Mark all as read"
                  onClick={markAllAsRead}
                  className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-transparent"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="max-h-[320px] overflow-y-auto scrollbar-none">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "flex flex-col gap-1 px-4 py-3 cursor-pointer",
                  "border-b border-border/50 last:border-0",
                  "hover:bg-muted/60 transition-colors duration-150",
                  !notification.isRead ? "bg-primary/5" : ""
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      !notification.isRead
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5 animate-pulse-dot" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground/70">
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
