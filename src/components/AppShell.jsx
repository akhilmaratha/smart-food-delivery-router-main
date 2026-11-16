"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/place-order", label: "Place order" },
  { href: "/track-order", label: "Track" },
  { href: "/rider", label: "Rider" },
  { href: "/routing", label: "Routing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
];

export default function AppShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-black bg-surface">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block h-2 w-8 rounded-sm bg-accent"
            />
            <span className="text-[15px] font-medium tracking-tight text-foreground">
              Smart Food Delivery Router
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border border-black bg-raised text-foreground"
                      : "text-secondary hover:bg-raised hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="rounded-lg border border-black bg-surface px-3 py-2 text-sm text-secondary transition-colors hover:bg-raised hover:text-foreground"
          >
            Change role
          </Link>
        </div>

        <div className="border-t border-black md:hidden">
          <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 py-2">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-raised text-foreground"
                      : "text-secondary hover:bg-raised"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="mb-2 text-sm text-muted">{eyebrow}</p>
            ) : null}
            <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 text-base leading-7 text-secondary">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
