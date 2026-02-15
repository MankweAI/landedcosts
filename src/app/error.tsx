"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <button type="button" onClick={reset} className="mt-3 rounded bg-blue-600 px-3 py-2 text-white">
        Try again
      </button>
    </div>
  );
}

