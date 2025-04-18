"use client";

import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";
import dynamic from "next/dynamic";

import  FinanceAnimation  from "@/app/ui/animation/financeanim";
export default function Page() {

  const fetchAllData = async () => {
    const response = await fetch("/api/clients");

    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        alert("Failed to fetch data!");
    }
};
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-white">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">

        <h1 className="text-4xl font-bold text-gray-900">
              Take Control of Your Finances with AI-Powered Insights
            </h1>
            <p className="mt-8 font-medium text-gray-500">
              Track expenses, manage invoices, and optimize cash flow—all in one
              place.
            </p>

          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span >Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>

          <button type="button" onClick={fetchAllData}>Click</button>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          {/* <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />

          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing desktop version"
          /> */}
          <FinanceAnimation/>

          
        </div>
      </div>
    </main>
  );
}
