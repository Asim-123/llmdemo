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
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-mono text-white">Conversation Traces</h2>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all shadow-md ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/50 scale-105'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
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
