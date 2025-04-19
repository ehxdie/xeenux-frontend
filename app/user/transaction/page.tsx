import React from 'react';
import { TransactionTable } from '@/components/transaction/TransactionTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TransactionPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <TransactionTable />
            </CardContent>
        </Card>
    );
}