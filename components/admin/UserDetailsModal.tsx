"use client";

import { useGetUserTransactions } from "@/hooks/use-admin";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function UserDetailsModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { transactions, isLoading, fetchUserTransactions } = useGetUserTransactions();

  useEffect(() => {
    if (userId) {
      fetchUserTransactions(userId);
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Modal isOpen={!!userId} onClose={onClose}>
      <h2 className="text-lg font-semibold">User Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Modal>
  );
}
