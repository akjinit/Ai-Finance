import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CreditCard, ReceiptText, ScanLine } from "lucide-react";
import { featuresData, howItWorksData } from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";

const quickActions = [
  {
    title: "Add Account",
    description:
      "Create cash, bank, or card accounts so every transaction has a clear source.",
    href: "/dashboard",
    action: "Open Accounts",
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    title: "AI Receipt Scanner",
    description:
      "Upload a receipt from your phone gallery and let AI fill the amount, date, category, and notes.",
    href: "/transaction/create",
    action: "Scan Receipt",
    icon: <ReceiptText className="h-6 w-6" />,
  },
  {
    title: "Transaction Scanner",
    description:
      "Turn spending details into categorized income or expense records in seconds.",
    href: "/transaction/create",
    action: "Add Transaction",
    icon: <ScanLine className="h-6 w-6" />,
  },
];

const LandingPage = () => {
  return (
    <div className="mx-auto -mt-4 w-full max-w-7xl">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Actions Section */}
      <section className="py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              Start with the tools you need most
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Add accounts, upload receipts from your phone gallery, and create
              clean transaction records without hunting through menus.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((item) => (
            <Card
              key={item.title}
              className="border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="flex h-full flex-col gap-4 pt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
                <Link href={item.href} className="mt-auto">
                  <Button className="w-full">{item.action}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section removed */}

      {/* Features Section */}
      <section id="features" className="py-14 sm:py-20">
        <div>
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-950 sm:mb-12 sm:text-3xl">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature, index) => (
              <Card className="border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" key={index}>
                <CardContent className="space-y-4 pt-2">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-slate-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="rounded-2xl border border-slate-200 bg-slate-900 py-14 text-white shadow-sm sm:py-20">
        <div className="px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold sm:mb-14 sm:text-3xl">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section removed */}

      {/* CTA Section */}
      <section className="mb-4 rounded-2xl bg-blue-700 py-14 sm:py-16">
        <div className="px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
