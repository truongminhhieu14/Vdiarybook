"use client";

export default function SkeletonCard({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="relative bg-white rounded-2xl border border-gray-200 shadow flex flex-col items-center p-6 animate-pulse"
        >
          <div className="w-full h-24 bg-gray-200 rounded-t-xl mb-4" />
          <div className="w-16 h-16 rounded-full bg-gray-300 -mt-12 mb-2 border-4 border-white shadow" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
