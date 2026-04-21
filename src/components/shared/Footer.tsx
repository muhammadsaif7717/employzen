"use client"
import Link from "next/link"
import {
  Briefcase,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react"
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterLinkGroup {
  heading: string
  links: FooterLink[]
}

interface SocialLink {
  label: string
  href: string
  Icon: React.ComponentType<{ className?: string }>
}

interface FooterProps {
  /** Current year override (defaults to real current year) */
  year?: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: "For Candidates",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Companies", href: "/companies" },
      { label: "Resume Builder", href: "/resume-builder" },
      { label: "Career Resources", href: "/resources" },
      { label: "Saved Jobs", href: "/candidate/saved-jobs" },
    ],
  },
  {
    heading: "For Employers",
    links: [
      { label: "Post a Job", href: "/employer/post-job" },
      { label: "Browse Candidates", href: "/employer/candidates" },
      { label: "Pricing", href: "/pricing" },
      { label: "Employer Dashboard", href: "/employer/dashboard" },
      { label: "Company Profile", href: "/employer/profile" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
]

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Twitter / X",
    href: "https://twitter.com/employzen",
    Icon: FaTwitter,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/employzen",
    Icon: FaLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/employzen",
    Icon: FaGithub,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/employzen",
    Icon: FaFacebook,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/employzen",
    Icon: FaInstagram,
  },
]

const CONTACT_ITEMS = [
  {
    icon: <Mail className="h-4 w-4 shrink-0 text-blue-500" />,
    label: "hello@employzen.com",
    href: "mailto:hello@employzen.com",
  },
  {
    icon: <Phone className="h-4 w-4 shrink-0 text-blue-500" />,
    label: "+1 (800) 123-4567",
    href: "tel:+18001234567",
  },
  {
    icon: <MapPin className="h-4 w-4 shrink-0 text-blue-500" />,
    label: "San Francisco, CA, USA",
    href: null,
  },
]

// ─── Newsletter form (internal) ───────────────────────────────────────────────

function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row gap-2 w-full"
      aria-label="Newsletter signup"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300
                   bg-white text-slate-900 placeholder:text-slate-400
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   dark:bg-slate-800 dark:border-slate-700
                   dark:text-slate-100 dark:placeholder:text-slate-500
                   dark:focus:border-blue-500"
      />
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                   px-5 py-2.5 rounded-lg transition-colors duration-200
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   shrink-0"
      >
        Subscribe
      </Button>
    </form>
  )
}

// ─── Footer (main export) ─────────────────────────────────────────────────────

export default function Footer({ year }: FooterProps) {
  // Bug fix 2: honour the `year` prop; fall back to the real current year
  const currentYear = React.useMemo(
    () => year ?? new Date().getFullYear(),
    [year]
  )

  return (
    <footer
      className="bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800"
      aria-label="Site footer"
    >
      {/* ── Top band: Newsletter CTA ──────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Stay ahead in your career
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Get the latest job alerts and career tips delivered to your inbox.
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[420px]">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main links grid ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 focus:outline-none
                         focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
              aria-label="Employzen home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-sm">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-blue-600 font-bold text-xl tracking-tight">
                Employ<span className="text-violet-600">zen</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              The modern job platform connecting talented candidates with the
              world&rsquo;s best companies.{" "}
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Discover, Apply, Get Hired.
              </span>
            </p>

            {/* Contact details */}
            <ul className="space-y-2.5" aria-label="Contact information">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-blue-600
                                 dark:text-slate-400 dark:hover:text-blue-400
                                 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-1" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg
                             text-slate-400 hover:text-blue-600 hover:bg-blue-50
                             dark:hover:text-blue-400 dark:hover:bg-blue-950
                             transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-600">
                {group.heading}
              </h3>
              <ul className="space-y-2.5" aria-label={group.heading}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-sm text-slate-500
                                 hover:text-blue-600 dark:text-slate-400
                                 dark:hover:text-blue-400 transition-colors group"
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRight
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-100 dark:bg-slate-800" />

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center sm:text-left">
            &copy; {currentYear}{" "}
            <span className="font-medium text-slate-500 dark:text-slate-400">
              Employzen
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-4" aria-label="Legal links">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
            ].map((item, index, arr) => (
              <span key={item.href} className="flex items-center gap-4">
                <Link
                  href={item.href}
                  className="text-xs text-slate-400 hover:text-blue-600
                             dark:text-slate-500 dark:hover:text-blue-400
                             transition-colors"
                >
                  {item.label}
                </Link>
                {index < arr.length - 1 && (
                  <span
                    className="h-3 w-px bg-slate-200 dark:bg-slate-700"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}