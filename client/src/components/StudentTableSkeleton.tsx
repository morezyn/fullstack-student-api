const block =
  'h-4 animate-shimmer rounded bg-[length:200%_100%] bg-linear-to-r from-slate-200/80 via-slate-100 to-slate-200/80 dark:from-slate-700/60 dark:via-slate-800 dark:to-slate-700/60'

function StudentTableSkeleton() {
  return (
    <section aria-label="Loading students" aria-busy="true">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Students
        </h2>
        <span className={`${block} w-20 rounded-full`} />
      </div>

      <div className="mt-6 overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/70 dark:border-white/10">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                ID
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Email
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Date of Birth
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Major
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Enrollment Year
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className={`${block} w-10`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`${block} h-8 w-8 rounded-full`} />
                    <div className={`${block} w-36`} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`${block} w-52`} />
                </td>
                <td className="px-4 py-3">
                  <div className={`${block} w-24`} />
                </td>
                <td className="px-4 py-3">
                  <div className={`${block} w-28 rounded-full`} />
                </td>
                <td className="px-4 py-3">
                  <div className={`${block} w-16`} />
                </td>
                <td className="px-4 py-3">
                  <div className={`${block} w-24`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default StudentTableSkeleton
