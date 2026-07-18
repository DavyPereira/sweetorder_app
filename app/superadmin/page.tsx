import { createElement } from "react";
import Link from "next/link";
import { ArrowRight, Package, Receipt, UserPlus, Users, Wallet } from "lucide-react";
import { getAllClientsOverview } from "@/lib/superadmin";
import { getStoreIcon } from "@/lib/store-icons";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function SuperAdminDashboardPage() {
  const clients = await getAllClientsOverview();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Clientes</h1>
          <p className="mt-1.5 text-muted-foreground">
            Todas as lojas cadastradas na plataforma.
          </p>
        </div>
        <Link
          href="/superadmin/clientes/novo"
          className="shrink-0 h-11 px-5 rounded-full font-heading font-bold text-sm flex items-center gap-2 text-white transition-all active:scale-[0.97]"
          style={{ backgroundColor: "var(--brand-sage)" }}
        >
          <UserPlus className="w-4 h-4" />
          Novo cliente
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-4 h-4" />} label="Lojas ativas" value={clients.length} color="var(--brand-sage)" />
        <StatCard
          icon={<Package className="w-4 h-4" />}
          label="Produtos cadastrados"
          value={clients.reduce((acc, c) => acc + c.productCount, 0)}
          color="var(--brand-amber)"
        />
        <StatCard
          icon={<Receipt className="w-4 h-4" />}
          label="Pedidos"
          value={clients.reduce((acc, c) => acc + c.orderCount, 0)}
          color="var(--brand-sage)"
        />
        <StatCard
          icon={<Wallet className="w-4 h-4" />}
          label="Faturamento total"
          value={fmt(clients.reduce((acc, c) => acc + c.revenueTotal, 0))}
          color="var(--brand-amber)"
        />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {clients.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhuma loja cadastrada ainda.</p>
        )}
        {clients.map((client) => {
          const storeIcon = createElement(getStoreIcon(client.brandIcon), { className: "w-5 h-5" });
          return (
            <Link
              key={client.storeId}
              href={`/superadmin/clientes/${client.storeId}`}
              className="group flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-4 transition-all hover:border-foreground active:scale-[0.99]"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklch, ${client.brandColor} 16%, var(--card))`, color: client.brandColor }}
              >
                {storeIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold truncate">{client.storeName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  /{client.slug} · {client.adminName} ({client.adminEmail})
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end text-sm text-muted-foreground shrink-0">
                <span className="font-heading font-semibold text-foreground">{fmt(client.revenueTotal)}</span>
                <span>
                  {client.orderCount} {client.orderCount === 1 ? "pedido" : "pedidos"} · {client.productCount} produtos
                </span>
                <span className="text-xs">Desde {formatDate(client.createdAt)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <span className="font-heading font-bold text-sm">{label}</span>
      </div>
      <span className="font-heading text-3xl font-black tracking-tight tabular-nums">{value}</span>
    </div>
  );
}
