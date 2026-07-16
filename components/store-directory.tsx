"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cookie, Search, Store as StoreIcon, ArrowRight, Rocket, Smartphone, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { StoreListItemDTO } from "@/lib/types";

const THEME = {
  base: "#08160e",
  mid: "#102a1b",
  glow: "#1f4c2f",
  accent: "#8fd39f",
  panel: "rgba(255,255,255,0.05)",
  panelBorder: "rgba(255,255,255,0.10)",
  textMuted: "rgba(235,242,237,0.68)",
};

const CARD_PALETTE = [
  "color-mix(in oklch, var(--brand-sage) 16%, var(--card))",
  "color-mix(in oklch, var(--brand-amber) 14%, var(--card))",
  "color-mix(in oklch, var(--brand-sage) 9%, var(--card))",
  "color-mix(in oklch, var(--brand-amber) 8%, var(--card))",
];

function pickFromSlug<T>(slug: string, palette: T[]): T {
  const hash = Array.from(slug).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function StoreCard({ store, index }: { store: StoreListItemDTO; index: number }) {
  const bg = pickFromSlug(store.slug, CARD_PALETTE);
  const initial = store.storeName.trim().charAt(0).toUpperCase() || "?";
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link
      href={`/${store.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      style={{
        animation: `card-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s both`,
      }}
    >
      <div
        className="relative aspect-[16/9] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: logoFailed ? bg : "#ffffff" }}
      >
        {logoFailed ? (
          <span
            className="font-heading text-4xl font-bold select-none text-foreground/70"
            style={{ letterSpacing: "-0.02em" }}
          >
            {initial}
          </span>
        ) : (
          <Image
            src={`/logos/${store.slug}.png`}
            alt={store.storeName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6"
            onError={() => setLogoFailed(true)}
          />
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold leading-tight tracking-tight text-foreground">
            {store.storeName}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {store.storeDescription}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground truncate">/{store.slug}</span>
          <span
            className="flex items-center gap-1.5 text-sm font-semibold shrink-0"
            style={{ color: "var(--brand-sage)" }}
          >
            Ver loja
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StoreDirectory({ stores }: { stores: StoreListItemDTO[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.storeName.toLowerCase().includes(q) || s.storeDescription.toLowerCase().includes(q)
    );
  }, [stores, search]);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: THEME.base,
        backgroundImage: `
          radial-gradient(ellipse 90% 55% at 50% -8%, ${THEME.glow} 0%, transparent 62%),
          linear-gradient(180deg, ${THEME.mid} 0%, ${THEME.base} 40%, ${THEME.base} 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ borderBottom: `1px solid ${THEME.panelBorder}`, backgroundColor: "rgba(8,22,14,0.75)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <span className="flex items-center gap-2 shrink-0">
            <Cookie className="w-5 h-5" style={{ color: THEME.accent }} />
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              SweetOrder
            </span>
          </span>

          <div className="flex-1 max-w-lg mx-auto relative hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            <Input
              placeholder="Buscar lojas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 rounded-full border-0 text-sm text-white placeholder:text-white/50 focus-visible:ring-white/25 transition-all"
              style={{ backgroundColor: THEME.panel }}
            />
          </div>
        </div>

        <div className="sm:hidden px-4 pb-3 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          <Input
            placeholder="Buscar lojas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 rounded-full border-0 text-sm text-white placeholder:text-white/50 focus-visible:ring-white/25 transition-all"
            style={{ backgroundColor: THEME.panel }}
          />
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 pt-16 pb-12 overflow-hidden">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium animate-slide-up"
          style={{
            border: `1px solid ${THEME.panelBorder}`,
            backgroundColor: THEME.panel,
            color: THEME.textMuted,
            animationDelay: "0s",
          }}
        >
          <StoreIcon className="w-3.5 h-3.5" style={{ color: THEME.accent }} />
          Diretório de lojas
        </span>

        <h1
          className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white animate-slide-up"
          style={{ animationDelay: "0.06s" }}
        >
          Encontre lojas artesanais
          <br />
          <span style={{ color: THEME.accent }}>perto de você.</span>
        </h1>

        <p
          className="mt-5 text-base sm:text-lg max-w-md leading-relaxed animate-slide-up"
          style={{ color: THEME.textMuted, animationDelay: "0.18s" }}
        >
          Cada loja tem seu próprio catálogo e entrega direto para você.
        </p>

        <div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm animate-slide-up"
          style={{ color: THEME.textMuted, animationDelay: "0.28s" }}
        >
          <span className="flex items-center gap-1.5">
            <StoreIcon className="w-3.5 h-3.5" style={{ color: THEME.accent }} />
            <span className="font-heading font-semibold text-white">{stores.length}</span>{" "}
            {stores.length === 1 ? "loja cadastrada" : "lojas cadastradas"}
          </span>
        </div>
      </section>

      <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <span
              className="flex items-center justify-center w-14 h-14 rounded-full"
              style={{ backgroundColor: THEME.panel }}
            >
              <Search className="w-6 h-6" style={{ color: THEME.textMuted }} />
            </span>
            <h2 className="font-heading text-2xl font-bold text-white">
              {stores.length === 0 ? "Nenhuma loja por aqui ainda" : "Nenhuma loja encontrada"}
            </h2>
            <p style={{ color: THEME.textMuted }}>
              {stores.length === 0
                ? "Assim que uma loja for cadastrada, ela aparece por aqui."
                : "Tente buscar por outro nome."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        )}
      </main>

      <section className="relative" style={{ borderTop: `1px solid ${THEME.panelBorder}`, backgroundColor: "rgba(255,255,255,0.03)" }}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">
            <span
              className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
              style={{ backgroundColor: THEME.panel, border: `1px solid ${THEME.panelBorder}` }}
            >
              <StoreIcon className="w-5 h-5" style={{ color: THEME.accent }} />
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Tem uma loja artesanal?
            </h2>
            <p className="mt-3 leading-relaxed" style={{ color: THEME.textMuted }}>
              Crie seu catálogo, receba pedidos pelo WhatsApp e comece a
              vender online em poucos minutos.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              className="flex flex-col items-center text-center gap-2 p-5 rounded-xl"
              style={{ backgroundColor: THEME.panel, border: `1px solid ${THEME.panelBorder}` }}
            >
              <Rocket className="w-5 h-5" style={{ color: THEME.accent }} />
              <h3 className="font-heading font-bold text-white">Comece rápido</h3>
              <p className="text-sm leading-relaxed" style={{ color: THEME.textMuted }}>
                Monte seu catálogo e publique sua loja em minutos, sem
                precisar de site próprio.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center gap-2 p-5 rounded-xl"
              style={{ backgroundColor: THEME.panel, border: `1px solid ${THEME.panelBorder}` }}
            >
              <Smartphone className="w-5 h-5" style={{ color: THEME.accent }} />
              <h3 className="font-heading font-bold text-white">Pedidos pelo WhatsApp</h3>
              <p className="text-sm leading-relaxed" style={{ color: THEME.textMuted }}>
                Cada pedido chega direto no seu WhatsApp, sem app novo pra
                aprender.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center gap-2 p-5 rounded-xl"
              style={{ backgroundColor: THEME.panel, border: `1px solid ${THEME.panelBorder}` }}
            >
              <Wallet className="w-5 h-5" style={{ color: THEME.accent }} />
              <h3 className="font-heading font-bold text-white">Você no controle</h3>
              <p className="text-sm leading-relaxed" style={{ color: THEME.textMuted }}>
                Defina preços, entrega e formas de pagamento do seu jeito.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative" style={{ borderTop: `1px solid ${THEME.panelBorder}` }}>
        <div
          className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ color: THEME.textMuted }}
        >
          <span className="flex items-center gap-2">
            <Cookie className="w-4 h-4" style={{ color: THEME.accent }} />
            <span className="font-heading font-semibold text-white">SweetOrder</span>
          </span>
          <span>© {new Date().getFullYear()} SweetOrder. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
