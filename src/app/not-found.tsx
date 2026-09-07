import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-xl">
        <h1 className="text-5xl font-black text-indigo-500 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested page could not be located in SupportFlow.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
