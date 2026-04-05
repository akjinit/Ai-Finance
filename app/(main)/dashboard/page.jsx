import { getUserAccounts } from '@/actions/dashboard'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Account } from '@/models/Account'
import { Plus } from 'lucide-react'
import React from 'react'
import AccountCard from './_components/account.card'

const DashboardPage = async () => {
  const accounts = await getUserAccounts();
  return (
    <div className='px-5'>
      {/* Budget Progress */}

      {/* Overview */}


      {/* AccountsGrid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
          <Card className="hover:shadow">
            <CardContent className="flex flex-col items-center justify-center">
              <Plus className='h-10 w-10 mb-2'></Plus>
              <p className='text-sm font-medium'> Add New Account</p>
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
