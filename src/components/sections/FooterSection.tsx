"use client";

import Link from "next/link";

interface FooterSectionProps {
    footer: any;
    isClient: boolean;
    t: (key: string, fallback: string) => string;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function FooterSection({ footer, isClient, t, resolveStr }: FooterSectionProps) {
    return (
        <footer id="contact" className="bg-[radial-gradient(circle_at_top,_#0b122d_0%,_#03060f_65%)] text-white py-16 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <img src="/jap_logo.png" alt="Justice Advocates & Partners, Inc." className="h-16 mb-4" />
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {resolveStr(footer.description, "footer.description", "Integrity in Practice. Excellence across Industries.")}
                        </p>
                    </div>

                    {/* Office */}
                    <div>
                        <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
                            {isClient ? t("footer.headOffice", "Head Office") : "Head Office"}
                        </h4>
                        <address className="not-italic text-gray-300 text-sm space-y-2">
                            <p>{footer.addressLine1 || "Unit 9 Amir Building"}</p>
                            <p>{footer.addressLine2 || "18th Street & Tubman Blvd., Sinkor, Monrovia, Liberia"}</p>
                        </address>

                        <h4 className="text-lg md:text-xl font-semibold text-white mt-8 mb-4">
                            {isClient ? t("footer.phone", "Phone Directory") : "Phone Directory"}
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                            {(footer.phoneLines || "Call locally: +231 777 511 760").split("\n").map((phone: string, i: number) => (
                                <li key={i} className="break-all">{phone}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
                            {isClient ? t("footer.connectWithUs", "Reach Out") : "Reach Out"}
                        </h4>
                        <p className="text-gray-300 text-sm mb-4">
                            {isClient ? t("footer.email", "Email") : "Email"}:{" "}
                            <a href={`mailto:${footer.email || "justice.advocates.partners@gmail.com"}`} className="text-blue-300 hover:text-blue-200">
                                {footer.email || "justice.advocates.partners@gmail.com"}
                            </a>
                        </p>

                        <h4 className="text-lg md:text-xl font-semibold text-white mb-3 mt-8">
                            {isClient ? t("footer.quickLinks", "Quick Links") : "Quick Links"}
                        </h4>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            {["hero", "about", "services", "team", "rates", "faq", "insights"].map((anchor) => (
                                <li key={anchor}>
                                    <a href={`#${anchor}`} className="hover:text-blue-300 capitalize">
                                        {isClient ? t(`footer.${anchor}`, anchor.charAt(0).toUpperCase() + anchor.slice(1)) : anchor.charAt(0).toUpperCase() + anchor.slice(1)}
                                    </a>
                                </li>
                            ))}
                            <li className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                                <Link href="/privacy" className="hover:text-blue-300 opacity-75 hover:opacity-100">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-blue-300 opacity-75 hover:opacity-100">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-xs md:text-sm text-gray-400">
                    {footer.copyright || "© 2026 Justice Advocates & Partners, Inc. All rights reserved. Licensed in Liberia."}
                </div>
            </div>
        </footer>
    );
}
