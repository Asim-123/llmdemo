import { useState, useEffect } from 'react'
import Analytics from './components/Analytics'
import ChatPanel from './components/ChatPanel'
import TraceTable from './components/TraceTable'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [analytics, setAnalytics] = useState(null)
  const [traces, setTraces] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [analyticsRes, tracesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics`),
        fetch(`${API_BASE_URL}/traces${selectedCategory !== 'All' ? `?category=${selectedCategory}` : ''}`)
      ])
      
      const analyticsData = await analyticsRes.json()
      const tracesData = await tracesRes.json()
      
      setAnalytics(analyticsData)
      setTraces(tracesData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Poll every 10 seconds
    const interval = setInterval(fetchData, 10000)
    
    return () => clearInterval(interval)
  }, [selectedCategory])

  const handleChatSubmit = async (message) => {
    const startTime = Date.now()
    
    try {
      // Get chatbot response
      const chatRes = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      
      if (!chatRes.ok) {
        throw new Error('Failed to get chatbot response')
      }
      
      const { response } = await chatRes.json()
      const responseTime = Date.now() - startTime
      
      // Save trace
      await fetch(`${API_BASE_URL}/traces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: message,
          bot_response: response,
          response_time_ms: responseTime
        })
      })
      
      // Refresh data
      fetchData()
      
      return response
    } catch (error) {
      console.error('Error in chat:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-mono text-white mb-2">
              SupportLens <span className="text-blue-500">⚡</span>
            </h1>
            <p className="text-gray-400 text-sm font-mono">
              Powered by Groq Llama 3.3 70B • Real-time AI Support Analytics
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-mono text-sm transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Analytics Bar */}
        {!loading && analytics && <Analytics data={analytics} />}

        {/* Chat Panel */}
        <ChatPanel onSubmit={handleChatSubmit} />

        {/* Trace Table */}
        <TraceTable
          traces={traces}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default App
