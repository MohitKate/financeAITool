"use client"

import Image from "next/image";
import Link from "next/link";
import AcmeLogo from "../ui/acme-logo";
import { usePathname } from 'next/navigation';
import clsx from "clsx";
export default function Navbar() {
  const pathname=usePathname();
  return (
    <>
      <nav
        className="flex items-center justify-between p-6 lg:px-8 bg-blue-500"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <AcmeLogo />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/dashboard" className={clsx('text-sm font-semibold text-white',
            {
              'text-white opacity-75':pathname=='/dashboard'
            }
          )}>
          Dashboard
          </Link>
          <Link href="/dashboard/invoices" className={clsx('text-sm font-semibold text-white',
            {
              'text-white opacity-75':pathname=='/dashboard/invoices'
            }
          )}>
            Invoices
          </Link>
          <Link href='/dashboard/clients' className={clsx('text-sm font-semibold text-white',
            {
              'text-white opacity-75':pathname=='/dashboard/clients'
            }
          )}>
            Clients
          </Link>
          <Link href="#" className={clsx('text-sm font-semibold text-white',
            {
              'text-white opacity-75':pathname=='dashboard/budgets'
            }
          )}>
          Budgets
          </Link><Link href="#" className={clsx('text-sm font-semibold text-white',
            {
              'text-white opacity-75':pathname=='dashboard/trasactions'
            }
          )}>
            Transactions
          </Link>
          <Link href="#" className={clsx('text-sm font-semibold text-white',
            {
              'text-white opacity-75':pathname=='dashboard/profile'
            }
          )}>
          Profile/Settings
          </Link>
        </div>
       <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {pathname === '/' ?<Link href="#" className="text-sm font-semibold text-white">
            Log in &rarr;
          </Link>:<Image
            src="/profile.png"
            width={32}
            height={32}
            className="rounded-full"
            alt="Profile Picture"/>}
        </div>
      </nav>
    </>
  );
}
