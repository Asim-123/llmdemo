import { useState } from 'react'

function ChatPanel({ onSubmit }) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    setLoading(true)
    setError('')
    setResponse('')

    try {
      const botResponse = await onSubmit(message)
      setResponse(botResponse)
      setMessage('')
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold font-mono mb-4 text-white">Chatbot</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 font-sans"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-mono font-semibold transition-colors"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {response && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-xs font-mono text-gray-400 mb-2">Bot Response:</div>
            <div className="text-gray-200">{response}</div>
          </div>
        )}
      </form>
    </div>
  )
}

export default ChatPanel
