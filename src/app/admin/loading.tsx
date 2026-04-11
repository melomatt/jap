export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6 p-4 md:p-8 w-full">
      {/* Page title skeleton */}
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-5 flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="h-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center gap-4"
          >
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-4 flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg" />
            <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
