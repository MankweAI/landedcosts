import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <Logo variant="dark" className="mb-4" />
                        <p className="mt-2 text-sm text-slate-500 max-w-sm">
                            Decision-grade landed cost intelligence for South African importers.
                            Helping you navigate compliance and costs with confidence.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Trust & Methodology</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/methodology" className="text-sm text-slate-500 hover:text-blue-600">
                                    How We Calculate
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-slate-500 hover:text-blue-600">
                                    About the Author
                                </Link>
                            </li>
                            <li>
                                <Link href="/data-sources" className="text-sm text-slate-500 hover:text-blue-600">
                                    Data Sources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/disclaimer" className="text-sm text-slate-500 hover:text-blue-600">
                                    Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-600">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-slate-500 hover:text-blue-600">
                                    Terms of Use
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-200 pt-8">
                    <p className="text-sm text-slate-400 text-center">
                        &copy; {new Date().getFullYear()} LandedCost Intelligence. All rights reserved. Not affiliated with SARS.
                    </p>
                </div>
            </div>
        </footer>
    );
}
