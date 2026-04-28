export type UserRole = "STUDENT" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  birthDate: string | null;
  avatarUrl: string | null;
}
