import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import TransactionsTable from './_components/transactions-table';

export default async function AccountsPage({ params }) {
    const { id } = await params;
    const account = await getAccountWithTransactions(id);
    if (!account) {
        notFound();
    }

    return (
        <div className='space-y-4 '>
            <div className="flex flex-wrap gap-4 items-end justify-between">
                <div>
                    <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>{account.name}</h1>
                    <p className='text-lg text-muted-foreground first-letter:uppercase'>{account.type.toLowerCase()} Account</p>
                </div>

                <div>
                    <div className="text-right pb-4">

                        <p className='text-xl sm:text-2xl font-bold'>${account.balance.toFixed(2)}</p>

                        <p className='text-sm text-muted-foreground'>{account.transactions.length} Transactions</p>
                    </div>

                </div>


                {/* chartsection */}

                {/* TransactionTable */}

            </div>

            <Suspense fallback={<BarLoader color="#36d7b7" className='mt-4' width={"100%"} />}>
                <TransactionsTable transactions={account.transactions}></TransactionsTable>
            </Suspense>
        </div>
    )
}


