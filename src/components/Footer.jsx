// components/Footer.jsx

import Link from "next/link";
import { FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <h2 className="text-3xl font-bold">
              <span className="text-blue-500">hire</span>
              <span className="text-orange-500">loop</span>
            </h2>

            <p className="mt-5 text-sm leading-7 max-w-xs">
              The AI-native career platform. Built for people who take
              their work seriously.
            </p>

            <div className="flex gap-3 mt-8">
              <Link
                href="#"
                className="w-10 h-10 rounded bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition"
              >
                <FaFacebookF />
              </Link>

              <Link
                href="#"
                className="w-10 h-10 rounded bg-indigo-600 text-white flex items-center justify-center hover:opacity-90 transition"
              >
                <FaPinterestP />
              </Link>

              <Link
                href="#"
                className="w-10 h-10 rounded bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-5">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Job discovery
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Worker AI
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Salary data
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-5">Navigations</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Career library
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-5">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Brand Guideline
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>Copyright © 2026 — hireloop</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">
              Terms & Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}