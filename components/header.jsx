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
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                <Link href='/' className="shrink-0">
                    <Image
                        src={"/wealth-logo.png"}
                        alt="wealth-logo"
                        height={20}
                        width={170}
                        className="h-auto w-32 sm:w-40"
                    />
                </Link>

                <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
                    <Show when="signed-in">
                        <Link href="/dashboard" className='text-slate-600 hover:text-slate-950'>
                            <Button variant='outline' size="sm" className="gap-2">
                                <LayoutDashboard size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Button>
                        </Link>

                        <Link href="/transaction/create" className='text-slate-600'>
                            <Button size="sm" className="gap-2">
                                <PenBox size={18} />
                                <span className='hidden sm:inline'>Add</span>
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
                            <Button variant="outline" size="sm">Login</Button>
                        </SignInButton >

                        <SignUpButton>
                            <Button size="sm">Sign up</Button>
                        </SignUpButton>
                    </Show>
                </div>

            </nav>
        </header>
    )
}

export default Header
