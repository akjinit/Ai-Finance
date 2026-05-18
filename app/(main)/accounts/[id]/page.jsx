import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import TransactionsTable from './_components/transactions-table';
import AccountChart from './_components/account-chart';

export default async function AccountsPage({ params }) {
    const { id } = await params;
    const account = await getAccountWithTransactions(id);
    if (!account) {
        notFound();
    }

    return (
        <div className='mx-auto w-full max-w-7xl space-y-5 sm:space-y-6'>
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div className="min-w-0">
                    <h1 className='truncate text-3xl font-bold capitalize sm:text-5xl gradient-title'>{account.name}</h1>
                    <p className='text-lg text-muted-foreground first-letter:uppercase'>{account.type.toLowerCase()} Account</p>
                </div>

                <div>
                    <div className="text-left sm:text-right">

                        <p className='text-xl sm:text-2xl font-bold'>${account.balance.toFixed(2)}</p>

                        <p className='text-sm text-muted-foreground'>{account.transactions.length} Transactions</p>
                    </div>

                </div>





            </div>
            {/* chartsection */}
            <Suspense fallback={<BarLoader color="#2563eb" className='mt-4' width={"100%"} />}>
                <AccountChart transactions={account.transactions} className="w-full"></AccountChart>
            </Suspense>


            {/* TransactionTable */}

            <Suspense fallback={<BarLoader color="#2563eb" className='mt-4' width={"100%"} />}>
                <TransactionsTable transactions={account.transactions} className="w-full"></TransactionsTable>
            </Suspense>
        </div>
    )
}


