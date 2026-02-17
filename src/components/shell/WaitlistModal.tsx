"use client";

import { Star, X } from "lucide-react";
import { useState } from "react";

type WaitlistModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/5">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-white">
                    <Star size={28} fill="currentColor" className="opacity-20" />
                    <Star size={28} className="absolute" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">Pro Features Coming Soon</h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                    We are rolling out <strong>Save</strong>, <strong>Export</strong>, and <strong>Watchlist</strong> tools to a limited group of early users.
                </p>

                <form
                    className="mt-8 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("Thanks! You've been added to the waitlist.");
                        onClose();
                    }}
                >
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm shadow-sm"
                            placeholder="you@company.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Join the Waitlist
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-6 w-full text-center text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                    No thanks, I&apos;ll stick to the free calculator
                </button>
            </div>
        </div>
    );
}
