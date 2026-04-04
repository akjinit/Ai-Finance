'use client'
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import DashboardPage from './page'

const DashboardLayout = () => {
    return (
        <div className='px-5 mt-30'>
            <h1 className='text-6xl font-bold gradient-title mb-5'>DashboardLayout</h1>
            {/* // DashBoardPage */}
            <Suspense fallback={<BarLoader color='#00ff43'></BarLoader>}>
                <DashboardPage/>
            </Suspense>
        </div>

    )
}

export default DashboardLayout