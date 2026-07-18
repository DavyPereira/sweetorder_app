import { createElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  Mail,
  Package,
  Phone,
  QrCode,
  Receipt,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { getClientDetail } from "@/lib/superadmin";
import { getStoreIcon } from "@/lib/store-icons";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const client = await getClientDetail(storeId);
  if (!client) notFound();

  const storeIcon = createElement(getStoreIcon(client.brandIcon), { className: "w-5 h-5" });
  const paymentMethods = [
    client.acceptsPix && { label: "Pix", icon: <QrCode className="w-3.5 h-3.5" /> },
    client.acceptsCash && { label: "Dinheiro", icon: <Banknote className="w-3.5 h-3.5" /> },
    client.acceptsCard && { label: "Cartão", icon: <CreditCard className="w-3.5 h-3.5" /> },
  ].filter(Boolean) as { label: string; icon: React.ReactNode }[];

  return (
    <div>
      <Link
        href="/superadmin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `color-mix(in oklch, ${client.brandColor} 16%, var(--card))`, color: client.brandColor }}
          >
            {storeIcon}
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight truncate">{client.storeName}</h1>
        </div>
        <a
          href={`/${client.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 h-10 px-4 rounded-full border-2 border-border font-semibold text-sm flex items-center gap-2 hover:border-foreground transition-colors"
        >
          Ver loja
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className="mt-1 text-muted-foreground">
        /{client.slug} · Desde {formatDate(client.createdAt)}
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={<User className="w-4 h-4" />} label="Administrador" value={client.adminName} />
        <InfoCard icon={<Mail className="w-4 h-4" />} label="E-mail" value={client.adminEmail} />
        <InfoCard icon={<Phone className="w-4 h-4" />} label="WhatsApp da loja" value={client.whatsappNumber || "—"} />
        <InfoCard icon={<Package className="w-4 h-4" />} label="Produtos cadastrados" value={String(client.productCount)} />
        <InfoCard icon={<Receipt className="w-4 h-4" />} label="Pedidos" value={String(client.orderCount)} />
        <InfoCard icon={<Wallet className="w-4 h-4" />} label="Faturamento total" value={fmt(client.revenueTotal)} />
        <InfoCard icon={<Truck className="w-4 h-4" />} label="Frete grátis a partir de" value={fmt(client.freeDeliveryThreshold)} />
        <InfoCard icon={<Clock className="w-4 h-4" />} label="Horário de funcionamento" value={client.hasBusinessHours ? "Definido" : "Não definido"} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Entrega
          </p>
          <p className="text-sm">
            Taxa de entrega: <strong className="font-heading font-bold">{fmt(client.deliveryFee)}</strong>
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
            Formas de pagamento aceitas
          </p>
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma configurada</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method.label}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold"
                >
                  {method.icon}
                  {method.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {client.storeDescription && (
        <div className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Descrição da loja
          </p>
          <p className="text-sm">{client.storeDescription}</p>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5">
      <div className="flex items-center gap-2.5 mb-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-heading font-bold truncate">{value}</p>
    </div>
  );
}
