import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const DashboardLayout = ({ children }) => {
    return (
        <div className='mx-auto w-full max-w-7xl space-y-6'>
            <div className="flex flex-col gap-2">
                <h1 className='text-3xl font-bold gradient-title sm:text-5xl'>Dashboard</h1>
                <p className="text-sm text-slate-500 sm:text-base">Track your balances, budgets, and recent financial activity.</p>
            </div>
            <Suspense fallback={<BarLoader color='#2563eb' width="100%" />}>
                {children}
            </Suspense>
        </div>

    )
}

export default DashboardLayout
