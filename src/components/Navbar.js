"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NotificationBell from '@/components/NotificationBell';


const Navbar = () => {
  const { theme, brandColor } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar opacity-90 bg-base-100 shadow-md px-4 py-2 sticky top-0 z-100 flex justify-between">
      {/* Logo */}
      <div>
        <Link href="/" className={`text-2xl font-extrabold ${brandColor}`}>
          Trippify
        </Link>
      </div>
      {/* Links for large screens */}
      <div className="flex hidden lg:flex gap-4">
        <Link href="#features" className="btn btn-md">
          Features
        </Link>
        <Link href="#howitworks" className="btn btn-md">
          How It Works
        </Link>
        <Link href="/" className="btn btn-md">
          Get Started
        </Link>
      </div>

      {/* Right section for large screens */}
      <div className="flex items-center gap-2 hidden lg:flex">
        <NotificationBell />
        <ThemeSelector />
        <SignedOut>
          <Link href="/sign-in">
            <button className="btn btn-primary btn-sm">Login</button>
          </Link>
        </SignedOut>
        <SignedIn>
        <Link href="/dashboard" className="font-semibold text-black">
                  <button className="btn ">Dashboard</button>
                  </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Mobile menu */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="#features" className="btn btn-md">
                Features
              </Link>
            </li>
            <li>
              <Link href="#howitworks" className="btn btn-md">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/" className="btn btn-md">
                Get Started
              </Link>
            </li>
            <li>
              <div className="flex justify-center">
                <ThemeSelector />
              </div>
            </li>
            <li>
              <SignedOut>
                <Link href="/sign-in">
                  <button className="btn btn-primary w-full">Login</button>
                </Link>
              </SignedOut>
              <SignedIn>

                <div className="flex justify-center">
                  <Link href="/dashboard" className="font-semibold text-black">
                  <button className="btn btn-primary w-full">Dashboard</button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
