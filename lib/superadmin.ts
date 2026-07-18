import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ClientOverviewDTO = {
  storeId: string;
  storeName: string;
  slug: string;
  brandColor: string;
  brandIcon: string;
  createdAt: string;
  productCount: number;
  orderCount: number;
  revenueTotal: number;
  adminName: string;
  adminEmail: string;
};

async function buildUserLookup(): Promise<Map<string, { name: string; email: string }>> {
  const admin = createAdminClient();
  const lookup = new Map<string, { name: string; email: string }>();

  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    for (const user of data.users) {
      lookup.set(user.id, {
        name: (user.user_metadata?.name as string | undefined) ?? "Sem nome",
        email: user.email ?? "",
      });
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  return lookup;
}

export async function getAllClientsOverview(): Promise<ClientOverviewDTO[]> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [
    { data: stores, error: storesError },
    { data: storeAdmins, error: adminsError },
    { data: products, error: productsError },
    { data: orders, error: ordersError },
  ] = await Promise.all([
    supabase
      .from("stores")
      .select("id, store_name, slug, brand_color, brand_icon, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("store_admins").select("store_id, user_id"),
    supabase.from("products").select("store_id"),
    admin.from("orders").select("store_id, total"),
  ]);
  if (storesError) throw storesError;
  if (adminsError) throw adminsError;
  if (productsError) throw productsError;
  if (ordersError) throw ordersError;

  const userLookup = await buildUserLookup();

  const adminByStore = new Map((storeAdmins ?? []).map((row) => [row.store_id, row.user_id]));
  const productCountByStore = new Map<string, number>();
  for (const row of products ?? []) {
    productCountByStore.set(row.store_id, (productCountByStore.get(row.store_id) ?? 0) + 1);
  }
  const orderCountByStore = new Map<string, number>();
  const revenueByStore = new Map<string, number>();
  for (const row of orders ?? []) {
    orderCountByStore.set(row.store_id, (orderCountByStore.get(row.store_id) ?? 0) + 1);
    revenueByStore.set(row.store_id, (revenueByStore.get(row.store_id) ?? 0) + row.total);
  }

  return (stores ?? []).map((store) => {
    const userId = adminByStore.get(store.id);
    const user = userId ? userLookup.get(userId) : undefined;
    return {
      storeId: store.id,
      storeName: store.store_name,
      slug: store.slug,
      brandColor: store.brand_color,
      brandIcon: store.brand_icon,
      createdAt: store.created_at,
      productCount: productCountByStore.get(store.id) ?? 0,
      orderCount: orderCountByStore.get(store.id) ?? 0,
      revenueTotal: revenueByStore.get(store.id) ?? 0,
      adminName: user?.name ?? "Sem administrador",
      adminEmail: user?.email ?? "—",
    };
  });
}

export type ClientDetailDTO = {
  storeId: string;
  storeName: string;
  storeDescription: string;
  slug: string;
  email: string;
  whatsappNumber: string;
  brandColor: string;
  brandIcon: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  acceptsPix: boolean;
  acceptsCash: boolean;
  acceptsCard: boolean;
  hasBusinessHours: boolean;
  createdAt: string;
  productCount: number;
  orderCount: number;
  revenueTotal: number;
  adminName: string;
  adminEmail: string;
};

export async function getClientDetail(storeId: string): Promise<ClientDetailDTO | null> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [
    { data: store, error: storeError },
    { data: storeAdmin },
    { count: productCount },
    { count: businessHoursCount },
    { data: orders, error: ordersError },
  ] = await Promise.all([
    supabase
      .from("stores")
      .select(
        "id, store_name, store_description, slug, email, whatsapp_number, brand_color, brand_icon, free_delivery_threshold, delivery_fee, accepts_pix, accepts_cash, accepts_card, created_at"
      )
      .eq("id", storeId)
      .maybeSingle(),
    supabase.from("store_admins").select("user_id").eq("store_id", storeId).maybeSingle(),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("store_id", storeId),
    supabase
      .from("business_hour_shifts")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId),
    admin.from("orders").select("total").eq("store_id", storeId),
  ]);
  if (storeError) throw storeError;
  if (!store) return null;
  if (ordersError) throw ordersError;

  let adminName = "Sem administrador";
  let adminEmail = "—";
  if (storeAdmin?.user_id) {
    const { data } = await admin.auth.admin.getUserById(storeAdmin.user_id);
    if (data.user) {
      adminName = (data.user.user_metadata?.name as string | undefined) ?? "Sem nome";
      adminEmail = data.user.email ?? "—";
    }
  }

  return {
    storeId: store.id,
    storeName: store.store_name,
    storeDescription: store.store_description,
    slug: store.slug,
    email: store.email,
    whatsappNumber: store.whatsapp_number,
    brandColor: store.brand_color,
    brandIcon: store.brand_icon,
    freeDeliveryThreshold: store.free_delivery_threshold,
    deliveryFee: store.delivery_fee,
    acceptsPix: store.accepts_pix,
    acceptsCash: store.accepts_cash,
    acceptsCard: store.accepts_card,
    hasBusinessHours: (businessHoursCount ?? 0) > 0,
    createdAt: store.created_at,
    productCount: productCount ?? 0,
    orderCount: (orders ?? []).length,
    revenueTotal: (orders ?? []).reduce((acc, row) => acc + row.total, 0),
    adminName,
    adminEmail,
  };
}
