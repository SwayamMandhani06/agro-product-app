// ============================================================
// AGRITRADE CATEGORY ICON COMPONENT
// Uses Lucide React — consistent SVG icon system, no emojis
// Maps category names to semantic professional icons
// ============================================================

import {
  Sprout,
  FlaskConical,
  ShieldCheck,
  Wrench,
  Droplets,
  Beef,
  Package,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

const CATEGORY_ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  seeds:           Sprout,
  fertilizers:     FlaskConical,
  'crop protection': ShieldCheck,
  'farm tools':    Wrench,
  irrigation:      Droplets,
  'animal care':   Beef,
};

interface CategoryIconProps extends LucideProps {
  categoryName: string;
}

export default function CategoryIcon({ categoryName, size = 20, strokeWidth = 1.75, ...rest }: CategoryIconProps) {
  const key = categoryName.toLowerCase();
  const Icon = CATEGORY_ICON_MAP[key] ?? Package;
  return <Icon size={size} strokeWidth={strokeWidth} {...rest} />;
}
