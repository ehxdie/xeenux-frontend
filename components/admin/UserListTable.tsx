"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { useSearchUsers } from "@/hooks/use-admin";

export function UserListTable({ onSelectUser }: { onSelectUser: (userId: string) => void }) {
  const { users, count, isLoading, searchUser } = useSearchUsers();
  const [page, setPage] = useState(1);

  useEffect(() => {
    searchUser("", ""); // Fetch initial users
  }, [page]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.userId}</TableCell>
              <TableCell>
                <Button onClick={() => onSelectUser(user._id)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        total={count}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
