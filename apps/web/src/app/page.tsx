import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">ArogyaGrid</h1>
      <p className="mb-8 text-gray-600">The Intelligent Health Resource Grid</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        <Link href="/work" className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Pending Work</h2>
          <p className="text-3xl font-bold">12</p>
        </Link>
        <Link href="/work" className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Critical Risks</h2>
          <p className="text-3xl font-bold">3</p>
        </Link>
        <Link href="/work" className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-orange-600 mb-2">Overdue Tasks</h2>
          <p className="text-3xl font-bold">5</p>
        </Link>
        <Link href="/work" className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-green-600 mb-2">Transfer Approvals</h2>
          <p className="text-3xl font-bold">8</p>
        </Link>
      </div>
    </main>
  );
}