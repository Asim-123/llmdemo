import { useState } from 'react'

const categoryColors = {
  'Billing': 'bg-category-billing text-white',
  'Refund': 'bg-category-refund text-white',
  'Account Access': 'bg-category-account text-white',
  'Cancellation': 'bg-category-cancellation text-white',
  'General Inquiry': 'bg-category-general text-white'
}

const categories = ['All', 'Billing', 'Refund', 'Account Access', 'Cancellation', 'General Inquiry']

function TraceTable({ traces, selectedCategory, onCategoryChange, loading }) {
  const [expandedRow, setExpandedRow] = useState(null)

  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-mono text-white">Traces</h2>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin mx-auto mb-3"></div>
          Loading traces...
        </div>
      ) : traces.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No traces found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="pb-3 font-mono text-xs text-gray-400 uppercase">Timestamp</th>
                <th className="pb-3 font-mono text-xs text-gray-400 uppercase">User Message</th>
                <th className="pb-3 font-mono text-xs text-gray-400 uppercase">Bot Response</th>
                <th className="pb-3 font-mono text-xs text-gray-400 uppercase">Category</th>
                <th className="pb-3 font-mono text-xs text-gray-400 uppercase text-right">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {traces.map((trace) => (
                <>
                  <tr
                    key={trace.id}
                    onClick={() => setExpandedRow(expandedRow === trace.id ? null : trace.id)}
                    className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono text-sm text-gray-400">
                      {formatTimestamp(trace.timestamp)}
                    </td>
                    <td className="py-3 text-sm max-w-xs">
                      {truncate(trace.user_message, 60)}
                    </td>
                    <td className="py-3 text-sm max-w-xs text-gray-400">
                      {truncate(trace.bot_response, 60)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${categoryColors[trace.category]}`}>
                        {trace.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-sm text-right text-gray-400">
                      {trace.response_time_ms}ms
                    </td>
                  </tr>
                  {expandedRow === trace.id && (
                    <tr className="bg-gray-800/30">
                      <td colSpan="5" className="py-4 px-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-mono text-gray-400 mb-1">USER MESSAGE:</div>
                            <div className="text-sm text-gray-200">{trace.user_message}</div>
                          </div>
                          <div>
                            <div className="text-xs font-mono text-gray-400 mb-1">BOT RESPONSE:</div>
                            <div className="text-sm text-gray-200">{trace.bot_response}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TraceTable
