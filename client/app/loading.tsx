export default function Loading() {
  return (
    <main className="page-shell px-5 py-12 sm:px-8" aria-label="Loading page">
      <div className="mx-auto w-full max-w-7xl animate-pulse" aria-hidden="true">
        <div className="h-3 w-32 rounded-full bg-white/10" />
        <div className="mt-5 h-10 max-w-xl rounded-xl bg-white/[.08]" />
        <div className="mt-3 h-4 max-w-md rounded-full bg-white/[.06]" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-48 rounded-3xl border border-white/[.08] bg-white/[.025]" />
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">Loading content…</span>
    </main>
  );
}
