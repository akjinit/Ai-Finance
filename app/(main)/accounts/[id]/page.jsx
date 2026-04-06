import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function AccountsPage({ params }) {
    const { id } = await params;
    const account = await getAccountWithTransactions(id);

    if (!account) {
        notFound();
    }

    return (
        <div>
            <h1>{account.name}</h1>
            <h1>{account.type + "Account"}</h1>

            <div>
                <div>
                    <p>Current Balance</p>
                    <p>{account.balance.toFixed(2)}</p>

                    <p>{account.transactions.length} Transactions</p>
                </div>

            </div>


            {/* chartsection */}

            {/* TransactionTable */}
        </div>
    )
}


