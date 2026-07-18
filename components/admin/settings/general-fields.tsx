"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, FieldLabel, inputClass } from "@/components/form-kit";
import { STORE_ICONS, STORE_ICON_NAMES } from "@/lib/store-icons";
import type { SettingsFormData } from "@/components/admin/store-settings-form";

export function GeneralFields({ isPending }: { isPending: boolean }) {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<SettingsFormData>();

  const slug = watch("slug");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-5 md:p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <FieldLabel>Nome da loja</FieldLabel>
          <Input
            placeholder="Lolo Cookies"
            disabled={isPending}
            className={inputClass(!!errors.storeName)}
            {...register("storeName")}
          />
          <FieldError>{errors.storeName?.message}</FieldError>
        </div>

        <div>
          <FieldLabel>E-mail de contato</FieldLabel>
          <Input
            type="email"
            placeholder="contato@sualoja.com"
            disabled={isPending}
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>

      <div>
        <FieldLabel>Descrição</FieldLabel>
        <Textarea
          placeholder="Uma frase curta sobre a loja"
          disabled={isPending}
          rows={2}
          className={inputClass(
            !!errors.storeDescription,
            "rounded-xl px-4 py-2.5 border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none"
          )}
          {...register("storeDescription")}
        />
        <FieldError>{errors.storeDescription?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Slug (link público da loja)</FieldLabel>
        <Input
          placeholder="minha-loja"
          disabled={isPending}
          className={inputClass(!!errors.slug)}
          {...register("slug")}
        />
        <FieldError>{errors.slug?.message}</FieldError>
        {slug && !errors.slug && (
          <p className="mt-1.5 text-xs text-muted-foreground truncate">
            {origin || "seudominio.com"}/{slug}
          </p>
        )}
      </div>

      <div>
        <FieldLabel>Cor de marca</FieldLabel>
        <Controller
          name="brandColor"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <input
                type="color"
                disabled={isPending}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="h-12 w-14 shrink-0 rounded-xl border-2 border-border bg-transparent p-1 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Selecionar cor de marca"
              />
              <Input
                placeholder="#4f7a5c"
                disabled={isPending}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className={inputClass(!!errors.brandColor, "rounded-xl h-12 px-4 py-0 leading-[2.75rem] border-2 focus-visible:ring-0 focus-visible:border-foreground transition-colors font-mono")}
              />
            </div>
          )}
        />
        <FieldError>{errors.brandColor?.message}</FieldError>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Usada para destacar sua loja no diretório inicial.
        </p>
      </div>

      <div>
        <FieldLabel>Ícone da loja</FieldLabel>
        <Controller
          name="brandIcon"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {STORE_ICON_NAMES.map((name) => {
                const Icon = STORE_ICONS[name];
                const selected = field.value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isPending}
                    onClick={() => field.onChange(name)}
                    aria-label={name}
                    aria-pressed={selected}
                    className={`flex items-center justify-center h-11 rounded-xl border-2 transition-colors disabled:cursor-not-allowed ${
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          )}
        />
        <FieldError>{errors.brandIcon?.message}</FieldError>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Aparece no cabeçalho e na vitrine da sua loja.
        </p>
      </div>
    </div>
  );
}
