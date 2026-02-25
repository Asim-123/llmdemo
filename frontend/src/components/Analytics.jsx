const categoryColors = {
  'Billing': 'bg-category-billing',
  'Refund': 'bg-category-refund',
  'Account Access': 'bg-category-account',
  'Cancellation': 'bg-category-cancellation',
  'General Inquiry': 'bg-category-general'
}

function Analytics({ data }) {
  const { total, average_response_time_ms, by_category } = data

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {/* Total Traces */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all shadow-lg">
        <div className="text-gray-400 text-xs font-mono uppercase mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Total Traces
        </div>
        <div className="text-4xl font-bold font-mono text-white">{total}</div>
      </div>

      {/* Average Response Time */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all shadow-lg">
        <div className="text-gray-400 text-xs font-mono uppercase mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Avg Response
        </div>
        <div className="text-4xl font-bold font-mono text-green-400">{average_response_time_ms}<span className="text-lg text-gray-500">ms</span></div>
      </div>

      {/* Category Stats */}
      {Object.entries(by_category).map(([category, stats]) => (
        <div key={category} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all shadow-lg group">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${categoryColors[category]} shadow-lg group-hover:scale-110 transition-transform`}></div>
            <div className="text-gray-400 text-xs font-mono uppercase truncate">{category}</div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">{stats.count}</div>
          <div className="text-xs text-gray-500 font-mono mt-1">{stats.percentage}%</div>
        </div>
      ))}
    </div>
  )
}

export default Analytics
