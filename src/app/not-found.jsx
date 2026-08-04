import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFF0] px-4 text-center">
      <h1 className="font-serif-luxury text-6xl font-normal text-[#6A2B15] mb-2">404</h1>
      <h2 className="font-serif-luxury text-2xl text-[#8C3B1F] mb-4">Page Not Found</h2>
      <p className="text-sm text-[#5A4438] max-w-md mb-6">
        The saree page or collection you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-md transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
