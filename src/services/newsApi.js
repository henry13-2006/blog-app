import axios from 'axios'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

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
      const config = categoryConfigs[category.toLowerCase()]

      if (config) {
        // Use /everything endpoint with keywords for better category filtering
        const response = await axios.get(`${BASE_URL}/everything`, {
          params: {
            apiKey: API_KEY,
            q: config.query,
            pageSize,
            sortBy: 'publishedAt',
            language: 'en'
          }
        })
        return response.data.articles
      } else {
        // Fallback to top-headlines for general/latest
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
          params: {
            apiKey: API_KEY,
            category: category,
            pageSize,
            country: 'us'
          }
        })
        return response.data.articles
      }
    } catch (error) {
      console.error('Error fetching top headlines:', error)
      return []
    }
  },

  // Search articles by query
  async searchArticles(query, pageSize = 20) {
    try {
      const response = await axios.get(`${BASE_URL}/everything`, {
        params: {
          apiKey: API_KEY,
          q: query,
          pageSize,
          sortBy: 'publishedAt',
          language: 'en'
        }
      })
      return response.data.articles
    } catch (error) {
      console.error('Error searching articles:', error)
      return []
    }
  },

  // Get latest articles (all categories)
  async getLatestArticles(pageSize = 20) {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          apiKey: API_KEY,
          country: 'us',
          pageSize
        }
      })
      return response.data.articles
    } catch (error) {
      console.error('Error fetching latest articles:', error)
      return []
    }
  }
}

export default newsApi
