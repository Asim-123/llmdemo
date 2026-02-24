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
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-xs font-mono uppercase mb-1">Total Traces</div>
        <div className="text-3xl font-bold font-mono">{total}</div>
      </div>

      {/* Average Response Time */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-xs font-mono uppercase mb-1">Avg Response</div>
        <div className="text-3xl font-bold font-mono">{average_response_time_ms}<span className="text-lg text-gray-500">ms</span></div>
      </div>

      {/* Category Stats */}
      {Object.entries(by_category).map(([category, stats]) => (
        <div key={category} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${categoryColors[category]}`}></div>
            <div className="text-gray-400 text-xs font-mono uppercase truncate">{category}</div>
          </div>
          <div className="text-2xl font-bold font-mono">{stats.count}</div>
          <div className="text-xs text-gray-500 font-mono">{stats.percentage}%</div>
        </div>
      ))}
    </div>
  )
}

export default Analytics
