/**
 * Reusable table with optional loading state, empty state, and responsive wrapper.
 * columns: [ { key, label, render?: (value, row) => node } ]
 * data: array of row objects
 */
export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data found.',
  keyField = 'id',
  className = '',
}) {
  if (loading) {
    return (
      <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white ${className}`}>
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                Loading…
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white ${className}`}>
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white ${className}`}>
      <table className="w-full text-sm text-left text-slate-700">
        <thead className="bg-slate-50 text-slate-600 uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-slate-50/80 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
