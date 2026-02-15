import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-600">This route does not map to a valid seeded money page.</p>
      <Link href="/" className="mt-3 inline-block text-blue-700 underline">
        Go home
      </Link>
    </div>
  );
}

