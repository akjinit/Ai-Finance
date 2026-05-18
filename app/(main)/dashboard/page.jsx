import { getUserAccounts } from '@/actions/dashboard'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React, { Suspense } from 'react'
import AccountCard from './_components/account.card'
import { getCurrentBudget } from '@/actions/budget'
import BudgetProgress from './_components/budget-progress'
import { DashboardOverview } from './_components/transaction-overview'
import { getUserTransactions } from '@/actions/transaction'

const DashboardPage = async () => {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts.filter(account => account.isDefault);

  let budgetData = null;
  if (defaultAccount[0]) {
    budgetData = await getCurrentBudget(defaultAccount[0]._id);
  }

  const transactions = await getUserTransactions();

  return (
    <div className='space-y-5 sm:space-y-6'>
      {/* Budget Progress */}
      {budgetData && <BudgetProgress budget={budgetData.budget} totalExpenses={budgetData.totalExpenses} />}
      
      {/* Overview */}
      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions.data || []}
        />
      </Suspense>

      {/* AccountsGrid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer >
          <Card className="flex h-full min-h-36 w-full cursor-pointer flex-col items-center justify-center border-dashed border-slate-300 bg-white/70 transition hover:border-blue-400 hover:bg-blue-50/70 hover:shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <Plus className='mb-2 h-8 w-8 text-blue-700'></Plus>
              <p className='text-sm font-medium text-slate-700'>Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 && (accounts?.map(account => {
          return <AccountCard key={account._id} account={account}></AccountCard>
        }))}
      </div>

    </div >
  )
}

export default DashboardPage
