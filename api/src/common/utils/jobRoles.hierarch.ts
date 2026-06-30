// src/auth/roles.hierarchy.ts
import { UserRole } from "../enums/auxi.enums";

export const ROLES_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER],
  [UserRole.EMPLOYEE]: [UserRole.EMPLOYEE],
  [UserRole.MANAGER]: [UserRole.MANAGER],
};