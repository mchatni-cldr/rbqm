'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { studies } from '@/data/studies'
import { TrafficLight } from '@/components/ui/traffic-light'
import { cn } from '@/lib/utils'
import {
  Activity,
  LayoutDashboard,
  FlaskConical,
  Server,
  AlertTriangle,
  Layers,
} from 'lucide-react'

const STUDY_ICONS: Record<string, string> = {
  'STUDY-001': '🧬',
  'STUDY-002': '❤️',
  'STUDY-003': '🧠',
}

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Activity className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-none text-sidebar-foreground">RBQM Agent</p>
          <p className="text-[10px] text-sidebar-foreground/50 leading-none mt-0.5">Veridian Therapeutics</p>
        </div>
        <span className="ml-auto shrink-0 rounded bg-sidebar-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-sidebar-primary tracking-wide">CDP</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Main nav */}
        <div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Portfolio</p>
          <NavItem href="/" icon={<LayoutDashboard className="h-4 w-4" />} label="Portfolio Overview" active={pathname === '/'} />
          <NavItem href="/architecture" icon={<Server className="h-4 w-4" />} label="Data Architecture" active={isActive('/architecture')} />
        </div>

        {/* Studies */}
        <div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-1">Studies</p>
          {studies.map(study => (
            <div key={study.id} className="mb-0.5">
              <Link
                href={`/studies/${study.id}`}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                  isActive(`/studies/${study.id}`)
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <span className="text-base leading-none">{STUDY_ICONS[study.id]}</span>
                <span className="flex-1 truncate min-w-0">{study.name}</span>
                <TrafficLight tier={study.riskTier} size="sm" showLabel={false} />
              </Link>

              {/* Sub-nav for active study */}
              {isActive(`/studies/${study.id}`) && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  <SubNavItem href={`/studies/${study.id}`} label="Overview" active={pathname === `/studies/${study.id}`} />
                  <SubNavItem href={`/studies/${study.id}/sites`} label="Site Risk Table" active={isActive(`/studies/${study.id}/sites`)} />
                  <SubNavItem
                    href={`/studies/${study.id}/signals`}
                    label={
                      <span className="flex items-center gap-1.5">
                        Signals
                        {study.criticalSignals > 0 && (
                          <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                            {study.criticalSignals}
                          </span>
                        )}
                      </span>
                    }
                    active={isActive(`/studies/${study.id}/signals`)}
                  />
                  <SubNavItem href={`/studies/${study.id}/agent`} label="Agent Activity" active={isActive(`/studies/${study.id}/agent`)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-md bg-violet-500/10 border border-violet-400/25 p-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🤖</span>
            <div>
              <p className="text-[11px] font-semibold text-violet-300">Cloudera AI Agent</p>
              <p className="text-[10px] text-violet-400/80">Monitoring active · 48 sites</p>
            </div>
            <span className="ml-auto h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active }: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-primary font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

function SubNavItem({ href, label, active }: {
  href: string
  label: React.ReactNode
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'block rounded-sm px-2 py-1 text-xs transition-colors',
        active
          ? 'text-sidebar-primary font-medium bg-sidebar-primary/10'
          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'
      )}
    >
      {label}
    </Link>
  )
}
