import { createClient } from "@/lib/supabase/server";
import type { StoreSettingsDTO } from "@/lib/types";

export async function getStoreSettings(): Promise<StoreSettingsDTO> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;

  return {
    storeName: row.store_name,
    storeDescription: row.store_description,
    slug: row.slug,
    email: row.email,
    whatsappNumber: row.whatsapp_number,
    whatsappMessageTemplate: row.whatsapp_message_template,
    freeDeliveryThreshold: row.free_delivery_threshold,
    deliveryFee: row.delivery_fee,
    instagramUrl: row.instagram_url,
    acceptsPix: row.accepts_pix,
    pixKey: row.pix_key,
    acceptsCash: row.accepts_cash,
    acceptsCard: row.accepts_card,
  };
}
