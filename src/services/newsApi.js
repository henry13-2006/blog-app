import axios from 'axios'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

// CORS proxy for development/production
const CORS_PROXY = 'https://api.allorigins.win/get?url='
const USE_CORS_PROXY = true // Re-enable CORS proxy with proper implementation

// Helper function to make API calls with CORS proxy if needed
const makeApiCall = async (url, params) => {
  if (USE_CORS_PROXY) {
    // Construct the full target URL first
    const queryString = new URLSearchParams(params).toString()
    const targetUrl = `${url}?${queryString}`
    console.log('Target NewsAPI URL:', targetUrl)

    // Use CORS proxy - only encode the target URL once
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
    console.log('CORS proxy URL:', proxyUrl)

    const response = await axios.get(proxyUrl)
    console.log('CORS proxy response status:', response.status)

    // Check if response has contents field
    if (response.data && response.data.contents) {
      // The CORS proxy wraps the response in a 'contents' field
      const actualData = JSON.parse(response.data.contents)
      console.log('Parsed NewsAPI status:', actualData.status)
      return actualData
    } else {
      // Fallback - sometimes the proxy returns data directly
      console.log('No contents field, using response data directly')
      return response.data
    }
  } else {
    // Direct API call
    const response = await axios.get(url, { params })
    return response.data
  }
}

// Category configurations with specific search queries
const categoryConfigs = {
  fashion: { query: 'fashion OR style OR clothing OR designer OR runway OR couture', sortBy: 'publishedAt' },
  luxury: { query: 'luxury brands OR designer fashion OR high fashion OR couture OR luxury lifestyle OR luxury cars OR luxury watches OR premium fashion', sortBy: 'publishedAt' },
  lifestyle: { query: 'lifestyle OR wellness OR home OR family OR daily life OR productivity OR self-care', sortBy: 'publishedAt' },
  beauty: { query: 'beauty OR skincare OR makeup OR cosmetics OR wellness OR spa OR grooming', sortBy: 'publishedAt' },
  travel: { query: 'travel OR vacation OR tourism OR destination OR adventure OR holiday OR trip', sortBy: 'publishedAt' },
  events: { query: 'events OR entertainment OR concert OR festival OR show OR party OR celebration', sortBy: 'publishedAt' },
  sports: { query: 'sports OR football OR basketball OR soccer OR tennis OR athletics OR championship', sortBy: 'publishedAt' }
}

export const newsApi = {
  // Get top headlines by category with keyword filtering
  async getTopHeadlines(category = 'general', pageSize = 20) {
    try {
      console.log('NewsAPI: getTopHeadlines called with category:', category)
      console.log('NewsAPI: API_KEY available:', !!API_KEY)

      const config = categoryConfigs[category.toLowerCase()]

      if (config) {
        console.log('NewsAPI: Using everything endpoint with query:', config.query)
        // Use /everything endpoint with keywords for better category filtering
        const params = {
          apiKey: API_KEY,
          q: config.query,
          pageSize: pageSize.toString(),
          sortBy: 'publishedAt',
          language: 'en'
        }
        const data = await makeApiCall(`${BASE_URL}/everything`, params)
        console.log('NewsAPI: Response status:', data.status)
        console.log('NewsAPI: Articles returned:', data.articles?.length || 0)
        return data.articles || []
      } else {
        console.log('NewsAPI: Using top-headlines endpoint')
        // Fallback to top-headlines for general/latest
        const params = {
          apiKey: API_KEY,
          category: category,
          pageSize: pageSize.toString(),
          country: 'us'
        }
        const data = await makeApiCall(`${BASE_URL}/top-headlines`, params)
        console.log('NewsAPI: Response status:', data.status)
        console.log('NewsAPI: Articles returned:', data.articles?.length || 0)
        return data.articles || []
      }
    } catch (error) {
      console.error('NewsAPI Error in getTopHeadlines:', error)
      console.error('NewsAPI Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      return []
    }
  },

  // Search articles by query
  async searchArticles(query, pageSize = 20) {
    try {
      const params = {
        apiKey: API_KEY,
        q: query,
        pageSize: pageSize.toString(),
        sortBy: 'publishedAt',
        language: 'en'
      }
      const data = await makeApiCall(`${BASE_URL}/everything`, params)
      return data.articles || []
    } catch (error) {
      console.error('Error searching articles:', error)
      return []
    }
  },

  // Get latest articles (all categories)
  async getLatestArticles(pageSize = 20) {
    try {
      console.log('NewsAPI: getLatestArticles called with pageSize:', pageSize)
      console.log('NewsAPI: API_KEY available:', !!API_KEY)
      console.log('NewsAPI: API_KEY value:', API_KEY ? '***' + API_KEY.slice(-4) : 'NOT SET')

      const params = {
        apiKey: API_KEY,
        country: 'us',
        pageSize: pageSize.toString()
      }

      const data = await makeApiCall(`${BASE_URL}/top-headlines`, params)

      console.log('NewsAPI: getLatestArticles response status:', data.status)
      console.log('NewsAPI: getLatestArticles articles returned:', data.articles?.length || 0)

      if (data.articles?.length > 0) {
        console.log('NewsAPI: First article title:', data.articles[0].title)
      }

      return data.articles || []
    } catch (error) {
      console.error('NewsAPI Error in getLatestArticles:', error)
      console.error('NewsAPI Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      return []
    }
  }
}

export default newsApi
