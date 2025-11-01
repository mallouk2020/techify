// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.1
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Modern responsive Footer component
// *********************

import { navigation } from "@/lib/utils";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaPhone, FaMapLocationDot } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4">
            
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  Techify
                </h3>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                Your trusted destination for quality electronics and innovative technology solutions. We bring the future to your doorstep.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-1.5">
                <a href="tel:+381611233211" className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors group">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    <FaPhone className="text-xs text-blue-400" />
                  </div>
                  <span className="hidden sm:inline">+212 61 123 3211</span>
                  <span className="sm:hidden">+212 61 123 3211</span>
                </a>
                <a href="mailto:support@techify.com" className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors group">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    <FaEnvelope className="text-xs text-blue-400" />
                  </div>
                  <span className="hidden sm:inline">support@techify.com</span>
                  <span className="sm:hidden">support@techify.com</span>
                </a>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <FaMapLocationDot className="text-xs text-blue-400" />
                  </div>
                  <span className="hidden sm:inline">123 Tech Street, Casablanca, Morocco</span>
                  <span className="sm:hidden">Casablanca, Morocco</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              {/* Sale */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white mb-2 pb-1.5 border-b-2 border-blue-500/30">
                  Sale
                </h3>
                <ul className="space-y-1.5">
                  {navigation.sale.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Us */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white mb-2 pb-1.5 border-b-2 border-blue-500/30">
                  About Us
                </h3>
                <ul className="space-y-1.5">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buying */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white mb-2 pb-1.5 border-b-2 border-blue-500/30">
                  Buying
                </h3>
                <ul className="space-y-1.5">
                  {navigation.buy.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white mb-2 pb-1.5 border-b-2 border-blue-500/30">
                  Support
                </h3>
                <ul className="space-y-1.5">
                  {navigation.help.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-700 py-4 sm:py-5">
          <div className="flex flex-col gap-3 w-full">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Stay Updated</h3>
              <p className="text-xs sm:text-sm text-slate-400">Subscribe to our newsletter for latest offers</p>
            </div>
            <div className="flex w-full flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
              © {currentYear} Techify. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition-all group"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-blue-400 flex items-center justify-center transition-all group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://www.instagram.com/techify.maroc?igsh=MTUzcTI1cGhwMTRtbQ=="
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-pink-500 flex items-center justify-center transition-all group"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all group"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://wa.me/0764949633"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-green-500 flex items-center justify-center transition-all group"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-xs sm:text-sm text-slate-400 group-hover:text-white" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;