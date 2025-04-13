import { AdminRoute } from "@/components/protected-routes/admin";
import { ProtectedRoute } from "@/components/protected-routes/user";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}
