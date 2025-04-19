"use client";

import { useGetRecentTransactions } from "@/hooks/use-admin";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function RecentTransactions() {
  const { transactions, isLoading } = useGetRecentTransactions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction.user.name}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>${transaction.amount}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
