import axios from 'axios'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// YouTube API service
export const youtubeApi = {
  // Search for videos
  searchVideos: async (query, maxResults = 12) => {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          key: YOUTUBE_API_KEY,
          q: query,
          part: 'snippet',
          type: 'video',
          maxResults,
          order: 'relevance',
          safeSearch: 'moderate'
        }
      })
      return response.data.items
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
      throw error
    }
  },

  // Get popular videos
  getPopularVideos: async (maxResults = 12) => {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet,statistics',
          chart: 'mostPopular',
          maxResults,
          regionCode: 'US'
        }
      })
      return response.data.items
    } catch (error) {
      console.error('Error fetching popular videos:', error)
      throw error
    }
  },

  // Search for cartoons/kids content
  getCartoonVideos: async (maxResults = 20) => {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
        params: {
          key: YOUTUBE_API_KEY,
          q: 'cartoons OR animation OR kids OR children',
          part: 'snippet',
          type: 'video',
          maxResults,
          order: 'relevance',
          safeSearch: 'strict',
          videoCategoryId: '1' // Film & Animation category
        }
      })
      return response.data.items
    } catch (error) {
      console.error('Error fetching cartoon videos:', error)
      throw error
    }
  },

  // Get video details
  getVideoDetails: async (videoId) => {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoId,
          part: 'snippet,statistics,contentDetails'
        }
      })
      return response.data.items[0]
    } catch (error) {
      console.error('Error fetching video details:', error)
      throw error
    }
  },

  // Format duration from ISO 8601 to readable format
  formatDuration: (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = (match[1] || '').replace('H', '') || 0
    const minutes = (match[2] || '').replace('M', '') || 0
    const seconds = (match[3] || '').replace('S', '') || 0

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  },

  // Format view count
  formatViewCount: (viewCount) => {
    const count = parseInt(viewCount)
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }
}

export default youtubeApi
