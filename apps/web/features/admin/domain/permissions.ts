// ============================================================
// AGRITRADE ADMIN — ROLE & PERMISSION SYSTEM
// Centralized permission evaluation for all platform roles
// ============================================================

import type { UserPlatformRole } from '@/types';

export type PlatformPermission =
  // Farmer
  | 'browse_products'
  | 'place_orders'
  | 'create_reviews'
  | 'join_campaigns'
  | 'create_disputes'
  | 'view_own_orders'
  // Seller
  | 'manage_products'
  | 'manage_inventory'
  | 'manage_seller_orders'
  | 'request_payouts'
  | 'view_seller_analytics'
  // Cooperative Manager
  | 'manage_campaigns'
  | 'monitor_participation'
  | 'manage_campaign_lifecycle'
  // Admin
  | 'verify_sellers'
  | 'moderate_products'
  | 'manage_disputes'
  | 'view_platform_analytics'
  | 'manage_governance'
  | 'view_audit_log'
  | 'manage_risk_signals'
  | 'view_admin_dashboard';

const ROLE_PERMISSIONS: Record<UserPlatformRole, PlatformPermission[]> = {
  farmer: [
    'browse_products',
    'place_orders',
    'create_reviews',
    'join_campaigns',
    'create_disputes',
    'view_own_orders',
  ],
  seller: [
    'browse_products',
    'manage_products',
    'manage_inventory',
    'manage_seller_orders',
    'request_payouts',
    'view_seller_analytics',
    'view_own_orders',
  ],
  cooperative_manager: [
    'browse_products',
    'manage_campaigns',
    'monitor_participation',
    'manage_campaign_lifecycle',
    'join_campaigns',
    'view_own_orders',
  ],
  admin: [
    'browse_products',
    'place_orders',
    'create_reviews',
    'verify_sellers',
    'moderate_products',
    'manage_disputes',
    'view_platform_analytics',
    'manage_governance',
    'view_audit_log',
    'manage_risk_signals',
    'view_admin_dashboard',
    'view_own_orders',
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: UserPlatformRole, permission: PlatformPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(role: UserPlatformRole, permissions: PlatformPermission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  return permissions.some((p) => rolePerms.includes(p));
}

/**
 * Check if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(role: UserPlatformRole, permissions: PlatformPermission[]): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  return permissions.every((p) => rolePerms.includes(p));
}

/**
 * Get all permissions for a role.
 */
export function getPermissions(role: UserPlatformRole): PlatformPermission[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

/**
 * Check if a role is an administrative role.
 */
export function isAdminRole(role: UserPlatformRole): boolean {
  return role === 'admin';
}

/**
 * Get all roles that have a specific permission.
 */
export function rolesWithPermission(permission: PlatformPermission): UserPlatformRole[] {
  return (Object.entries(ROLE_PERMISSIONS) as [UserPlatformRole, PlatformPermission[]][])
    .filter(([, perms]) => perms.includes(permission))
    .map(([role]) => role);
}
