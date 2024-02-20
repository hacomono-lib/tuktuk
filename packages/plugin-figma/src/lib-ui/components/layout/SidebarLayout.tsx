// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import type { PropsWithChildren } from 'preact/compat'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type EmptyProps = {}

export function SidebarLayout({ children }: PropsWithChildren<EmptyProps>) {
  return (
    // tailwind's h-[calc(100%_-_3.5rem)] doesn't work for some reason
    <div class="flex overflow-hidden" style="height: calc(100% - 3.5rem)">
      {children}
    </div>
  )
}

SidebarLayout.Sidebar = function Sidebar({ children }: PropsWithChildren<EmptyProps>) {
  return (
    <aside class="flex flex-col bg-gray-100 shadow w-60 h-full">
      {/* overflow-y-auto doesn't work for some reason */}
      <div class="overflow-y-auto">{children}</div>
    </aside>
  )
}

SidebarLayout.MainContent = function MainContent({ children }: PropsWithChildren<EmptyProps>) {
  return <section class="container bg-white mx-auto">{children}</section>
}

SidebarLayout.MainContentHeader = function Header({ children }: PropsWithChildren<EmptyProps>) {
  return <header class="flex flex-row px-2 py-4 h-14 justify-between">{children}</header>
}

SidebarLayout.MainContentBody = function Body({ children }: PropsWithChildren<EmptyProps>) {
  // tailwind's h-[calc(100%_-_3.5rem)] doesn't work for some reason
  return (
    <div class="container overflow-y-auto" style="height: calc(100% - 3.5rem);">
      {children}
    </div>
  )
}

SidebarLayout.Footer = function Footer({ children }: PropsWithChildren<EmptyProps>) {
  return <footer class="bg-white border-t border-t-gray-100 h-14">{children}</footer>
}
