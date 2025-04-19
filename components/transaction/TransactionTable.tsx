"use client";

import { useState, useEffect } from "react";
import { useGetMyTransactions } from "@/hooks/use-transaction";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";

export function TransactionTable() {
  const [type, setType] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const { data, isLoading, fetchTransactions } = useGetMyTransactions({ type, status });

  useEffect(() => {
    fetchTransactions();
  }, [type, status]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={type} onValueChange={(value) => setType(value || undefined)}>
          <SelectTrigger>
            <span>Type</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="swap">Swap</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value || undefined)}>
          <SelectTrigger>
            <span>Status</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
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
            {data?.transactions?.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>{transaction.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
