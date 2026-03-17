import { UserRole } from "@prisma/client";

export type PermissionKey =
  | "financial:refund"
  | "financial:revenue_view"
  | "financial:price_override"
  | "ops:cancel_booking"
  | "ops:manage_inventory"
  | "ops:update_equipment"
  | "staff:view_audit"
  | "staff:edit_profiles"
  | "staff:manage_roles";

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  category: "Financial Management" | "Operations & Logistics" | "Staff & HR";
}

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  { key: "financial:refund", label: "Process Refunds", category: "Financial Management" },
  { key: "financial:revenue_view", label: "View Revenue Reports", category: "Financial Management" },
  { key: "financial:price_override", label: "Override Pricing", category: "Financial Management" },
  { key: "ops:cancel_booking", label: "Cancel Bookings", category: "Operations & Logistics" },
  { key: "ops:manage_inventory", label: "Manage Inventory", category: "Operations & Logistics" },
  { key: "ops:update_equipment", label: "Update Equipment", category: "Operations & Logistics" },
  { key: "staff:view_audit", label: "View Audit Logs", category: "Staff & HR" },
  { key: "staff:edit_profiles", label: "Edit Staff Profiles", category: "Staff & HR" },
  { key: "staff:manage_roles", label: "Manage Roles & Permissions", category: "Staff & HR" },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  ADMIN: SYSTEM_PERMISSIONS.map((p) => p.key),
  OWNER: SYSTEM_PERMISSIONS.map((p) => p.key),
  MANAGER: [
    "financial:refund",
    "financial:revenue_view",
    "ops:cancel_booking",
    "ops:manage_inventory",
    "ops:update_equipment",
  ],
  RECEPTIONIST: ["ops:cancel_booking", "ops:update_equipment"],
  EMPLOYEE: ["ops:update_equipment"],
};

export type PermissionMatrix = Partial<Record<UserRole, PermissionKey[]>>;

/**
 * Checks if a user has a specific permission.
 * Logic:
 * 1. ADMIN and OWNER always have all permissions.
 * 2. If business overrides exist, use those.
 * 3. Fallback to system defaults.
 */
export function hasPermission(
  userRole: UserRole,
  permission: PermissionKey,
  businessPermissions?: PermissionMatrix | null
): boolean {
  if (userRole === "ADMIN" || userRole === "OWNER") return true;

  const permissions =
    (businessPermissions?.[userRole] as PermissionKey[]) ||
    DEFAULT_ROLE_PERMISSIONS[userRole] ||
    [];

  return permissions.includes(permission);
}
