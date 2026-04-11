"use client";

import { Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname } from "next/navigation";

const Navbar = ({ cmsData }: { cmsData: any }) => {
  const { setTheme } = useTheme();
  const { t } = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const defaultLinks = [
    { href: "#hero", labelKey: "navigation.home", label: "Home" },
    { href: "#about", labelKey: "footer.about", label: "About" },
    { href: "#services", labelKey: "navigation.services", label: "Services" },
    { href: "#team", labelKey: "navigation.advisors", label: "Advisors" },
    { href: "#contact", labelKey: "navigation.contact", label: "Contact" },
  ];

  const navLinks = cmsData?.links || defaultLinks;
  const phoneNumber = cmsData?.phoneNumber || "+(231) 777 511 760";
  const ctaText = cmsData?.ctaText || (isClient ? t("navigation.bookAppointment") : "Free Evaluation");
  const logoAlt = cmsData?.logoAlt || "JAP Inc.";

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        scrolled || mobileMenuOpen
          ? "bg-white/95 dark:bg-[#1D1D1F]/95 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-0" 
          : "bg-transparent border-b border-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <Link href="/" className="flex items-center flex-shrink-0 gap-2">
            <img src="/jap_logo.png" alt={logoAlt} className={`transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'}`} />
            <span className={`hidden sm:block font-bold mt-1 transition-all duration-500 ${scrolled ? 'text-lg text-gray-900 dark:text-white' : 'text-xl text-white'}`}>
              JAP Inc.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link: any) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:opacity-70 ${
                  scrolled ? "text-gray-900 dark:text-white" : "text-white"
                }`}
              >
                {link.label || (isClient ? t(link.labelKey) : "")}
              </Link>
            ))}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <span className={`text-sm font-medium transition-colors duration-500 ${scrolled ? "text-gray-900 dark:text-white" : "text-white"}`}>
              {phoneNumber}
            </span>
            <button
              className={`font-bold transition-all duration-500 text-sm px-6 py-2.5 rounded-full shadow-lg active:scale-95 ${
                scrolled 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20" 
                  : "bg-white text-blue-600 hover:bg-gray-100 shadow-white/10"
              }`}
              onClick={() => {
                const event = new CustomEvent("openEvaluation");
                window.dispatchEvent(event);
              }}
            >
              {ctaText}
            </button>
            {isClient && <LanguageSwitcher isScrolled={scrolled} />}
            <Link
              href="/login"
              className={`transition-all duration-500 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 group ${
                scrolled ? "text-gray-900 dark:text-white" : "text-white/90"
              }`}
              title="Admin Login"
            >
              <Shield className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </div>

          {/* Mobile Menu Button and Right Controls */}
          <div className="lg:hidden flex items-center space-x-2 sm:space-x-4">
            <button
              className={`font-semibold transition-all duration-500 text-xs sm:text-sm px-5 py-2 rounded-full active:scale-95 whitespace-nowrap shadow-md ${
                scrolled 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-blue-600"
              }`}
              onClick={() => {
                const event = new CustomEvent("openEvaluation");
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }}
            >
              {ctaText}
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`transition-colors duration-500 p-1.5 rounded-lg ${
                scrolled 
                  ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800" 
                  : "text-white hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 px-2 space-y-1 animate-in fade-in slide-in-from-top-4 duration-300 min-h-[50vh] flex flex-col">
            {navLinks.map((link: any) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  scrolled || mobileMenuOpen
                    ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50" 
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.label || (isClient ? t(link.labelKey) : "")}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all active:scale-[0.98] mt-2 ${
                scrolled || mobileMenuOpen
                    ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5" 
                    : "text-white hover:bg-white/10"
              }`}
            >
              <Shield className="h-5 w-5 text-blue-500" /> Admin Login
            </Link>

            <div className={`mt-4 pt-4 border-t ${scrolled ? "border-gray-200/50 dark:border-white/5" : "border-white/10"}`}>
               <div className="flex items-center justify-between px-4 pb-4">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${scrolled ? "text-gray-500" : "text-white/60"}`}>Preferences</span>
                  <div className="flex items-center gap-3">
                   {isClient && <LanguageSwitcher isScrolled={scrolled} />}
                  </div>
               </div>
               
               <div className="px-4">
                  <div className={`p-4 rounded-2xl ${scrolled ? "bg-gray-50 dark:bg-white/5" : "bg-white/10"}`}>
                     <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${scrolled ? "text-gray-500" : "text-white/60"}`}>Contact Support</p>
                     <a
                       href={`tel:${phoneNumber.replace(/\D/g, '')}`}
                       className={`text-lg font-bold transition-colors ${scrolled ? "text-blue-600 dark:text-blue-400" : "text-white"}`}
                     >
                       {phoneNumber}
                     </a>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
