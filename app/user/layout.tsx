import { ProtectedRoute } from "@/components/protected-routes/user";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
