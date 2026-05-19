"use client"


import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {
    const imageRef = useRef()

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled")
            } else {
                imageElement.classList.remove("scrolled")
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => { window.removeEventListener('scroll', handleScroll) };

    }, [])


    return (
        <section className="pb-12 pt-4 sm:pb-16">
            <div className='mx-auto max-w-4xl text-center'>
                <h1 className='pb-5 text-4xl leading-tight sm:text-6xl lg:text-7xl gradient-title'>Manage Your Finances with Intelligence</h1>
                <p className='mx-auto mb-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
                    An AI-powered financial management platform that helps you track,
                    analyze, and optimize your spending with real-time insights.
                </p>

                <div className='flex flex-col justify-center gap-3 sm:flex-row'>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button size="lg" className={'w-full px-8 sm:w-auto rounded-xl shadow-lg'}>Get Started</Button>
                    </Link>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button size='lg' variant='outline' className={'w-full px-8 sm:w-auto rounded-xl'}>Watch Demo</Button>
                    </Link>
                </div>

            </div>

            <div className='hero-image-wrapper mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-md sm:mt-10 sm:p-4'>
                <div ref={imageRef} className='hero-image'>
                    <Image priority alt="Dashboard preview" className='mx-auto rounded-2xl shadow-2xl' src="/wealth-banner.png" width={1280} height={400} />
                </div>
            </div>
        </section>
    )
}

export default HeroSection
