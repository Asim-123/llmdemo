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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-mono text-white">SupportLens</h1>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-mono text-sm transition-colors"
          >
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
