"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const etapes = [
  { numero: 1, label: "Import", href: "/dashboard/import" },
  { numero: 2, label: "Rapprochement", href: "/dashboard/rapprochement" },
  { numero: 3, label: "Relevés", href: "/dashboard/releves" },
  { numero: 4, label: "Envoi", href: "/dashboard/envoi" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const indexActif = etapes.findIndex((e) => e.href === pathname);
  const progression =
    indexActif === -1 ? 0 : (indexActif / (etapes.length - 1)) * 100;

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-64 bg-teal text-white flex flex-col py-8 px-5 shrink-0">
        <Link
          href="/dashboard/accueil"
          className="flex items-center gap-2 mb-10 px-2 hover:opacity-80 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" className="text-coral">
            <path
              d="M20 4C20 4 14 10 14 18C14 22 16.5 24 20 24C23.5 24 26 22 26 18C26 10 20 4 20 4Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path d="M20 24V36" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className="font-serif text-lg">Enjoy Riviera</span>
        </Link>

        <Link
          href="/dashboard/accueil"
          className={`flex items-center gap-3 px-3 py-2.5 mb-4 rounded-md text-sm transition-colors ${
            pathname === "/dashboard/accueil"
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white/90"
          }`}
        >
          Accueil
        </Link>

        <div className="relative">
          {/* Trait de fond, vertical, derrière les étapes */}
          <div className="absolute left-[13px] top-3 bottom-3 w-px bg-white/15" />
          {/* Trait de progression, corail, qui se remplit */}
          <div
            className="absolute left-[13px] top-3 w-px bg-coral transition-all duration-500"
            style={{ height: `calc(${progression}% - ${progression > 0 ? "0px" : "0px"})`, maxHeight: "calc(100% - 24px)" }}
          />

          <nav className="flex flex-col gap-1 relative">
            {etapes.map((etape) => {
              const active = pathname === etape.href;
              return (
                <Link
                  key={etape.href}
                  href={etape.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white/90"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border shrink-0 bg-teal ${
                      active
                        ? "bg-coral border-coral text-white"
                        : "border-white/30"
                    }`}
                  >
                    {etape.numero}
                  </span>
                  {etape.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            Connecté à Superhote
          </div>
          <div className="text-xs text-white/40">Septembre 2026</div>
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}