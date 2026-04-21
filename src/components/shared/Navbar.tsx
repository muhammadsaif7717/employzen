"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Briefcase,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "candidate" | "employer" | "admin" | null

interface NavUser {
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
  unreadNotifications?: number
}

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  /** Pass null when the user is not logged in */
  user?: NavUser | null
  /** Override the default nav links */
  links?: NavLink[]
  onLogout?: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Resources", href: "/resources" },
]

const ROLE_DASHBOARD_HREF: Record<NonNullable<UserRole>, string> = {
  candidate: "/candidate/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
}

const ROLE_BADGE_CLASS: Record<NonNullable<UserRole>, string> = {
  candidate:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  employer:
    "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
  admin:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
}

const ROLE_LABEL: Record<NonNullable<UserRole>, string> = {
  candidate: "Candidate",
  employer: "Employer",
  admin: "Admin",
}

// ─── ThemeToggle (internal) ───────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50
                 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950
                 rounded-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

// ─── Notification Bell (internal) ────────────────────────────────────────────

interface NotificationBellProps {
  count: number
}

function NotificationBell({ count }: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${count} unread notifications`}
      className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50
                 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950
                 rounded-lg"
      asChild
    >
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center
                       justify-center rounded-full bg-blue-600 text-[10px]
                       font-bold text-white leading-none"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </Button>
  )
}

// ─── User Menu (internal) ─────────────────────────────────────────────────────

interface UserMenuProps {
  user: NavUser
  onLogout?: () => void
}

function UserMenu({ user, onLogout }: UserMenuProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const dashboardHref =
    user.role ? ROLE_DASHBOARD_HREF[user.role] : "/dashboard"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-xl px-2 py-1.5
                     hover:bg-slate-100 dark:hover:bg-slate-800
                     transition-colors focus:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500"
          aria-label="Open user menu"
        >
          <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-900">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback
              className="bg-blue-100 text-blue-600 font-semibold text-xs
                         dark:bg-blue-950 dark:text-blue-400"
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
            {user.name}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 bg-white border border-slate-200 rounded-xl shadow-md p-1
                   dark:bg-slate-900 dark:border-slate-800"
      >
        {/* User info header */}
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
            {user.email}
          </p>
          {user.role && (
            <Badge
              className={cn(
                "mt-2 text-xs font-medium px-2 py-0.5",
                ROLE_BADGE_CLASS[user.role]
              )}
            >
              {ROLE_LABEL[user.role]}
            </Badge>
          )}
        </div>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        <DropdownMenuItem asChild>
          <Link
            href={dashboardHref}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-slate-700 dark:text-slate-300 cursor-pointer
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       hover:text-blue-600 dark:hover:text-blue-400
                       focus:bg-slate-50 dark:focus:bg-slate-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-slate-700 dark:text-slate-300 cursor-pointer
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       hover:text-blue-600 dark:hover:text-blue-400
                       focus:bg-slate-50 dark:focus:bg-slate-800"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                       text-slate-700 dark:text-slate-300 cursor-pointer
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       hover:text-blue-600 dark:hover:text-blue-400
                       focus:bg-slate-50 dark:focus:bg-slate-800"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                     text-red-600 dark:text-red-400 cursor-pointer
                     hover:bg-red-50 dark:hover:bg-red-950
                     focus:bg-red-50 dark:focus:bg-red-950"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Mobile Drawer Nav (internal) ────────────────────────────────────────────

interface MobileNavProps {
  links: NavLink[]
  user: NavUser | null
  pathname: string
  onLogout?: () => void
}

function MobileNav({ links, user, pathname, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50
                     dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-950
                     rounded-lg lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0 bg-white border-r border-slate-200
                   dark:bg-slate-900 dark:border-slate-800 flex flex-col"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-blue-600 font-bold text-lg tracking-tight">
              Employ<span className="text-violet-600">zen</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            className="rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info (if logged in) */}
        {user && (
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-900">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback
                  className="bg-blue-100 text-blue-600 font-semibold
                             dark:bg-blue-950 dark:text-blue-400"
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {user.role && (
              <Badge
                className={cn(
                  "mt-2 text-xs font-medium",
                  ROLE_BADGE_CLASS[user.role]
                )}
              >
                {ROLE_LABEL[user.role]}
              </Badge>
            )}
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Authenticated quick links */}
          {user && (
            <>
              <Separator className="my-2 bg-slate-100 dark:bg-slate-800" />
              {user.role && (
                <Link
                  href={ROLE_DASHBOARD_HREF[user.role]}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                             text-slate-600 hover:bg-slate-100 hover:text-slate-900
                             dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
                             transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                           text-slate-600 hover:bg-slate-100 hover:text-slate-900
                           dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
                           transition-colors"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                           text-slate-600 hover:bg-slate-100 hover:text-slate-900
                           dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
                           transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {user ? (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
              onClick={() => {
                setOpen(false)
                onLogout?.()
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-slate-300
                           font-medium dark:bg-slate-800 dark:hover:bg-slate-700
                           dark:text-slate-200 dark:border-slate-700"
                asChild
              >
                <Link href="/login" onClick={() => setOpen(false)}>
                  Log In
                </Link>
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                asChild
              >
                <Link href="/register" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Navbar (main export) ─────────────────────────────────────────────────────

export default function Navbar({
  user = null,
  links = DEFAULT_NAV_LINKS,
  onLogout,
}: NavbarProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // Add subtle shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const notificationCount = user?.unreadNotifications ?? 0

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b border-slate-200",
        "dark:bg-slate-900 dark:border-slate-800",
        "transition-shadow duration-200",
        scrolled ? "shadow-sm" : "shadow-none"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Left: Logo + Nav Links ──────────────────────────────── */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 focus:outline-none
                         focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
              aria-label="Employzen home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-sm">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-blue-600 font-bold text-xl tracking-tight">
                Employ<span className="text-violet-600">zen</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Primary navigation"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Right: Actions ───────────────────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search button (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search jobs"
              className="hidden sm:flex text-slate-500 hover:text-blue-600 hover:bg-blue-50
                         dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950
                         rounded-lg"
              asChild
            >
              <Link href="/jobs">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Authenticated actions */}
            {user ? (
              <>
                <NotificationBell count={notificationCount} />
                <UserMenu user={user} onLogout={onLogout} />
              </>
            ) : (
              /* Guest auth buttons (desktop) */
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300
                             font-medium dark:bg-slate-800 dark:hover:bg-slate-700
                             dark:text-slate-200 dark:border-slate-700 text-sm"
                  asChild
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                             px-5 py-2.5 rounded-lg transition-colors duration-200
                             focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <MobileNav
              links={links}
              user={user}
              pathname={pathname}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  )
}