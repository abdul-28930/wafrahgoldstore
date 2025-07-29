"use client";

import Link from "next/link";
import Image from "next/image";
import { FC, useState } from "react";

const Header: FC = () => {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Offer Banner */}
      <div className="w-full bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-center py-2 text-white font-semibold text-sm tracking-wide">
        💰 Limited Time Offer: Get 20% Off on All Necklace Collections! 💎
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Desktop & Tablet Header */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/">
            <Image
              src="/Logo-3.png"
              alt="RICH CHIDAMBARAM GOLD COVERING"
              width={70}
              height={70}
              className="h-[90px] w-[90px] rounded-md object-contain"
            />
          </Link>

          <div className="absolute mt-6 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center leading-tight pointer-events-none select-none">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-transparent bg-clip-text tracking-widest whitespace-nowrap">
              RICH CHIDAMBARAM
            </h1>
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-transparent bg-clip-text tracking-wide">
              GOLD COVERING
            </h2>
          </div>

          {/* Right: Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/new-arrivals"
              className="text-gray-700 hover:text-amber-600 text-sm font-medium"
            >
              New Arrivals
            </Link>

            {/* Collections Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-gray-700 hover:text-amber-600 text-sm font-medium"
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                onMouseEnter={() => setCollectionsOpen(true)}
              >
                Collections
                <svg
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {collectionsOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                  onMouseLeave={() => setCollectionsOpen(false)}
                >
                  {["necklaces", "earrings", "rings", "bracelets"].map(
                    (item) => (
                      <Link
                        key={item}
                        href={`/collections/${item}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 capitalize"
                      >
                        {item}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>

     
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/">
            <Image
              src="/Logo-3.png"
              alt="RICH CHIDAMBARAM GOLD COVERING"
              width={50}
              height={50}
              className="h-[50px] w-[50px] rounded-md object-contain"
            />
          </Link>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none select-none">
  <h1 className="text-base font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-transparent bg-clip-text tracking-widest">
    RICH CHIDAMBARAM
  </h1>
  <h2 className="text-xs font-bold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-transparent bg-clip-text tracking-wide">
    GOLD COVERING
  </h2>
</div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-amber-600 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="text-center leading-tight mb-4">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-transparent bg-clip-text tracking-widest">
                RICH CHIDAMBARAM
              </h1>
              <h2 className="text-base font-bold bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFA500] text-transparent bg-clip-text tracking-wide">
                GOLD COVERING
              </h2>
            </div>

            <nav className="flex flex-col items-center space-y-4">
              <Link
                href="/new-arrivals"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-amber-600"
              >
                New Arrivals
              </Link>

              <div>
                <button
                  onClick={() => setCollectionsOpen(!collectionsOpen)}
                  className="text-gray-700 hover:text-amber-600"
                >
                  Collections
                </button>
                {collectionsOpen && (
                  <div className="mt-2 space-y-2 text-center">
                    {["necklaces", "earrings", "rings", "bracelets"].map(
                      (item) => (
                        <Link
                          key={item}
                          href={`/collections/${item}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setCollectionsOpen(false);
                          }}
                          className="block text-gray-700 hover:text-amber-600 capitalize"
                        >
                          {item}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>

            
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
