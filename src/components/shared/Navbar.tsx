/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Menu,
  Sun,
  Moon,
  ChevronDown,
  Briefcase,
  User,
  LogOut,
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
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import NotificationBell from "./NotificationBell"


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
  user?: NavUser | null
  links?: NavLink[]
  onLogout?: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
]

const ROLE_DASHBOARD_HREF: Record<NonNullable<UserRole>, string> = {
  candidate: "/candidate",
  employer: "/employer",
  admin: "/admin",
}

const ROLE_BADGE_VARIANT: Record<NonNullable<UserRole>, string> = {
  candidate: "bg-primary/10 text-primary border-primary/20",
  employer: "bg-secondary/10 text-secondary border-secondary/20",
  admin: "bg-warning/20 text-warning-foreground border-warning/30",
}

const ROLE_LABEL: Record<NonNullable<UserRole>, string> = {
  candidate: "Candidate",
  employer: "Company",
  admin: "Admin",
}

// ─── ThemeToggle ──────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return <div className="size-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
    </Button>
  )
}

// ─── User Menu ────────────────────────────────────────────────────────────────

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

  const dashboardHref = user.role ? ROLE_DASHBOARD_HREF[user.role] : "/dashboard"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-xl px-2 py-1.5",
            "hover:bg-muted transition-colors duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          )}
          aria-label="Open user menu"
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
            {user.name}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 bg-popover border border-border rounded-xl shadow-lg shadow-primary/5 p-1 animate-scale-in"
      >
        {/* User info header */}
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
          {user.role && (
            <span
              className={cn(
                "mt-2 inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold border",
                ROLE_BADGE_VARIANT[user.role]
              )}
            >
              {ROLE_LABEL[user.role]}
            </span>
          )}
        </div>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem asChild>
          <Link
            href={dashboardHref}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer hover:bg-muted hover:text-primary focus:bg-muted transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground cursor-pointer hover:bg-muted hover:text-primary focus:bg-muted transition-colors"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Mobile Drawer Nav ────────────────────────────────────────────────────────

interface MobileNavProps {
  links: NavLink[]
  user: NavUser | null
  pathname: string
  onLogout?: () => void
}

function MobileNav({ links, user, pathname, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : ""

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0 bg-card border-r border-border flex flex-col"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Access navigation links</SheetDescription>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="Employzen Logo" width={40} height={40} className="rounded-xl bg-white p-1.5 object-contain shadow-sm ring-1 ring-border/50" />
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Employ</span>
              <span className="text-foreground">zen</span>
            </span>
          </Link>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close navigation"
              className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              ✕
            </Button>
          </SheetClose>
        </div>

        {/* User info (if logged in) */}
        {user && (
          <div className="px-5 py-4 border-b border-border bg-muted/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            {user.role && (
              <span
                className={cn(
                  "mt-3 inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold border",
                  ROLE_BADGE_VARIANT[user.role]
                )}
              >
                {ROLE_LABEL[user.role]}
              </span>
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
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <>
              <Separator className="my-2 bg-border" />
              {user.role && (
                <Link
                  href={ROLE_DASHBOARD_HREF[user.role]}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 py-4 border-t border-border space-y-2">
          {user ? (
            <Button
              className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-xl font-semibold"
              variant="ghost"
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
              <Button variant="outline" className="flex-1 rounded-xl" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>Log In</Link>
              </Button>
              <Button variant="gradient" className="flex-1 rounded-xl" asChild>
                <Link href="/register" onClick={() => setOpen(false)}>Sign Up</Link>
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
  const authContext = useAuth()

  const activeUser = user || (authContext?.user ? {
    name: authContext.user.role === "admin"
      ? (authContext.user.name || "Administrator")
      : (authContext.profile?.name || "User"),
    email: authContext.user.email,
    role: authContext.user.role,
    avatarUrl: authContext.user.role === "admin"
      ? authContext.user.avatarUrl
      : authContext.profile?.avatarUrl,
  } : null)

  const handleLogout = onLogout || (() => {
    authContext?.logout()
  })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  if (pathname === '/login' || pathname === '/register') return null

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border",
        "transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm shadow-primary/5"
          : "bg-background"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Left: Logo + Nav Links ─────────────────── */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-xl"
              aria-label="Employzen home"
            >
              <Image src="/images/logo.png" alt="Employzen Logo" width={40} height={40} className="rounded-xl bg-white p-1.5 object-contain shadow-sm ring-1 ring-border/50" />
              <span className="font-bold text-xl tracking-tight font-[family-name:var(--font-heading)]">
                <span className="gradient-text">Employ</span>
                <span className="text-foreground">zen</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Right: Actions ──────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search jobs"
              className="hidden sm:flex text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
              asChild
            >
              <Link href="/jobs">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Authenticated actions */}
            {activeUser ? (
              <>
                <NotificationBell />
                <UserMenu user={activeUser} onLogout={handleLogout} />
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" className="text-sm rounded-xl" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button variant="gradient" className="text-sm rounded-xl px-5" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <MobileNav
              links={links}
              user={activeUser}
              pathname={pathname}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  )
}