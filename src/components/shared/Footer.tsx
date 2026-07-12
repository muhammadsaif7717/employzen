"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
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
      { label: "Company Dashboard", href: "/employer" },
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
  { label: "Twitter / X", href: "https://twitter.com/employzen", Icon: FaTwitter },
  { label: "LinkedIn", href: "https://linkedin.com/company/employzen", Icon: FaLinkedin },
  { label: "GitHub", href: "https://github.com/employzen", Icon: FaGithub },
  { label: "Facebook", href: "https://facebook.com/employzen", Icon: FaFacebook },
  { label: "Instagram", href: "https://instagram.com/employzen", Icon: FaInstagram },
]

const CONTACT_ITEMS = [
  { icon: Mail, label: "hello@employzen.com", href: "mailto:hello@employzen.com" },
  { icon: Phone, label: "+1 (800) 123-4567", href: "tel:+18001234567" },
  { icon: MapPin, label: "San Francisco, CA, USA", href: null },
]

// ─── Newsletter form ──────────────────────────────────────────────────────────

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
        className="flex-1 bg-white/15 border-white/25 text-white placeholder:text-white/60
                   focus-visible:border-white/60 focus-visible:ring-white/20 focus-visible:bg-white/20"
      />
      <Button
        type="submit"
        className="bg-white hover:bg-white/90 text-primary font-bold px-6 rounded-xl shrink-0 shadow-lg"
      >
        Subscribe
      </Button>
    </form>
  )
}

// ─── Footer (main export) ─────────────────────────────────────────────────────

export default function Footer({ year }: FooterProps) {
  const currentYear = React.useMemo(
    () => year ?? new Date().getFullYear(),
    [year]
  )

  const pathname = usePathname()
  if (pathname === '/login' || pathname === '/register') return null

  return (
    <footer
      className="bg-card border-t border-border"
      aria-label="Site footer"
    >
      {/* ── Newsletter CTA Banner ─────────────────────────────────────── */}
      <div className="gradient-brand">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
                Stay ahead in your career
              </h2>
              <p className="text-white/75 text-sm mt-1">
                Get the latest job alerts and career tips delivered to your inbox.
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[420px]">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Links Grid ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-xl"
              aria-label="Employzen home"
            >
              <Image src="/images/logo.png" alt="Employzen Logo" width={48} height={48} className="rounded-xl bg-white p-2 object-contain shadow-sm ring-1 ring-border/50" />
              <span className="font-bold text-xl tracking-tight font-[family-name:var(--font-heading)]">
                <span className="gradient-text">Employ</span>
                <span className="text-foreground">zen</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The modern job platform connecting talented candidates with the
              world&rsquo;s best companies.{" "}
              <span className="text-primary font-medium">
                Discover, Apply, Get Hired.
              </span>
            </p>

            {/* Contact details */}
            <ul className="space-y-2.5" aria-label="Contact information">
              {CONTACT_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    )}
                  </li>
                )
              })}
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl
                             text-muted-foreground hover:text-primary hover:bg-primary/10
                             transition-all duration-150"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-4">
              <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                {group.heading}
              </h3>
              <ul className="space-y-2.5" aria-label={group.heading}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground
                                 hover:text-primary transition-colors duration-150 group"
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

      <Separator className="bg-border" />

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              &copy; {currentYear}{" "}
              <span className="font-semibold text-foreground/70">Employzen</span>
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
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                  {index < arr.length - 1 && (
                    <span className="h-3 w-px bg-border" aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}