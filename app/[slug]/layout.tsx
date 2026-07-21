import { notFound } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { getStoreBySlug } from "@/lib/settings";

const COOKIE_ICON_SVG_PATHS = [
  "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5",
  "M8.5 8.5v.01",
  "M16 15.5v.01",
  "M12 12v.01",
  "M11 17v.01",
  "M7 14v.01",
];

function buildCookieFaviconUrl(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${COOKIE_ICON_SVG_PATHS.map(
    (d) => `<path d="${d}"/>`
  ).join("")}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) return {};

  if (slug === "lolocookies") {
    const themeColor = /^#[0-9a-fA-F]{6}$/.test(settings.themeColor)
      ? settings.themeColor
      : "#4f7a5c";
    return {
      title: settings.storeName,
      description: settings.storeDescription,
      icons: { icon: buildCookieFaviconUrl(themeColor) },
    };
  }

  return {
    title: settings.storeName,
    description: settings.storeDescription,
  };
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) notFound();

  const themeColor = /^#[0-9a-fA-F]{6}$/.test(settings.themeColor)
    ? settings.themeColor
    : "#4f7a5c";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { --primary: ${themeColor}; --ring: ${themeColor}; }`,
        }}
      />
      <CartProvider settings={settings}>{children}</CartProvider>
    </>
  );
}
