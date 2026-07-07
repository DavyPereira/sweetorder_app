"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/session-helpers";
import { storeSettingsSchema, type StoreSettingsFormData } from "@/lib/schemas/store-settings";
import { businessHoursSchema, type BusinessHoursFormData } from "@/lib/schemas/business-hours";

export type SettingsInput = StoreSettingsFormData;
export type SettingsActionState = { error?: string };

export async function updateStoreSettings(data: SettingsInput): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = storeSettingsSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("store_settings")
    .update({
      store_name: parsed.data.storeName,
      store_description: parsed.data.storeDescription,
      slug: parsed.data.slug,
      email: parsed.data.email,
      whatsapp_number: parsed.data.whatsappNumber,
      whatsapp_message_template: parsed.data.whatsappMessageTemplate,
      free_delivery_threshold: parsed.data.freeDeliveryThreshold,
      delivery_fee: parsed.data.deliveryFee,
      instagram_url: parsed.data.instagramUrl,
      accepts_pix: parsed.data.acceptsPix,
      pix_key: parsed.data.pixKey,
      accepts_cash: parsed.data.acceptsCash,
      accepts_card: parsed.data.acceptsCard,
    })
    .eq("id", 1);
  if (error) return { error: "Erro ao salvar configurações" };

  revalidatePath("/admin/loja");
  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/loja/[slug]", "page");
  return {};
}

export type BusinessHoursInput = BusinessHoursFormData;

export async function updateBusinessHours(data: BusinessHoursInput): Promise<SettingsActionState> {
  await requireAdmin();
  const parsed = businessHoursSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const rows = parsed.data.days.flatMap((day) =>
    day.isOpen
      ? day.shifts.map((shift, sortOrder) => ({
          day_of_week: day.dayOfWeek,
          open_time: shift.openTime,
          close_time: shift.closeTime,
          sort_order: sortOrder,
        }))
      : []
  );

  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("business_hour_shifts")
    .delete()
    .gte("day_of_week", 0);
  if (deleteError) return { error: "Erro ao salvar horários" };

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("business_hour_shifts").insert(rows);
    if (insertError) return { error: "Erro ao salvar horários" };
  }

  revalidatePath("/admin/loja");
  revalidatePath("/");
  revalidatePath("/loja/[slug]", "page");
  return {};
}
