import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="mx-auto -mt-4 w-full max-w-7xl">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="rounded-2xl border border-slate-200 bg-white py-8 shadow-sm sm:py-10">
        <div className="px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-1 text-2xl font-bold text-blue-700 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-14 sm:py-20">
        <div>
          <h2 className="mb-10 text-center text-2xl font-bold sm:mb-14 sm:text-3xl">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-500">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
