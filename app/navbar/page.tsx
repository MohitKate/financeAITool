import Image from "next/image";
import Link from "next/link";
import AcmeLogo from "../ui/acme-logo";

export default function Navbar() {
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
          <Link href="/dashboard" className="text-sm font-semibold text-white">
          Dashboard
          </Link>
          <Link href="#" className="text-sm font-semibold text-white">
            Invoices
          </Link>
          <Link href="#" className="text-sm font-semibold text-white">
            Customers
          </Link>
          <Link href="#" className="text-sm font-semibold text-white">
          Budgets
          </Link><Link href="#" className="text-sm font-semibold text-white">
            Transactions
          </Link>
          <Link href="#" className="text-sm font-semibold text-white">
          Profile/Settings
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="#" className="text-sm font-semibold text-white">
            Log in &rarr;
          </Link>
        </div>
      </nav>
    </>
  );
}
