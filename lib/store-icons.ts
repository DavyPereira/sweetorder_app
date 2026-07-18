import {
  Cookie,
  Cake,
  Donut,
  IceCream2,
  Coffee,
  Croissant,
  Candy,
  Pizza,
  Sandwich,
  Gift,
  ShoppingBag,
  Store,
  Sparkles,
  Flower2,
  SprayCan,
  Gem,
  Package,
  Heart,
  type LucideIcon,
} from "lucide-react";

export const STORE_ICONS = {
  Cookie,
  Cake,
  Donut,
  IceCream2,
  Coffee,
  Croissant,
  Candy,
  Pizza,
  Sandwich,
  Gift,
  ShoppingBag,
  Store,
  Sparkles,
  Flower2,
  SprayCan,
  Gem,
  Package,
  Heart,
} satisfies Record<string, LucideIcon>;

export type StoreIconName = keyof typeof STORE_ICONS;

export const STORE_ICON_NAMES = Object.keys(STORE_ICONS) as StoreIconName[];

export const DEFAULT_STORE_ICON: StoreIconName = "Cookie";

export function getStoreIcon(name: string | null | undefined): LucideIcon {
  return STORE_ICONS[name as StoreIconName] ?? STORE_ICONS[DEFAULT_STORE_ICON];
}
