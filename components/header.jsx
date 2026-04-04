import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
    const user = await checkUser();
    return (
        <div className="fixed top-0">
            <nav className="flex items-center justify-between w-screen mx-auto px-20 py-3 ">
                <Link href='/'>
                    <Image
                        src={"/wealth-logo.png"}
                        alt="wealth-logo"
                        height={20}
                        width={200}
                    />
                </Link>

                <div className='flex items-center gap-3 mr-4'>
                    <Show when="signed-in">
                        <Link href="/dashboard" className='text-gray-600 hover:text-blue-600 items-center gap-2'>
                            <Button variant='outline'>
                                <LayoutDashboard size={18} />
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>

                        <Link href="/transaction/create" className='text-gray-600  items-center gap-2'>
                            <Button >
                                <PenBox size={18} />
                                <span className='hidden md:inline'>Add Transaction</span>
                            </Button>
                        </Link>

                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }} />
                    </Show>

                    <Show when="signed-out">
                        <SignInButton forceRedirectUrl={"/dashboard"}>
                            <Button variant="outline">Login</Button>
                        </SignInButton >

                        <SignUpButton>

                        </SignUpButton>
                    </Show>
                </div>

            </nav>
        </div>
    )
}

export default Header
