import { notFound } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { getStoreBySlug } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getStoreBySlug(slug);
  if (!settings) return {};
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

  const brandColor = /^#[0-9a-fA-F]{6}$/.test(settings.brandColor)
    ? settings.brandColor
    : "#4f7a5c";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { --primary: ${brandColor}; --ring: ${brandColor}; }`,
        }}
      />
      <CartProvider settings={settings}>{children}</CartProvider>
    </>
  );
}
