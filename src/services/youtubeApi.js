import axios from 'axios'

// Dailymotion API (no API key required for basic access)
const DAILYMOTION_BASE_URL = 'https://api.dailymotion.com'

// Dailymotion API service
export const youtubeApi = {
  // Search for videos (maps to Dailymotion search)
  searchVideos: async (query, maxResults = 12) => {
    try {
      const response = await axios.get(`${DAILYMOTION_BASE_URL}/videos`, {
        params: {
          search: query,
          limit: maxResults,
          fields: 'id,title,description,thumbnail_url,duration,views_total,created_time',
          sort: 'relevance'
        }
      })

      // Transform Dailymotion data to match YouTube format for compatibility
      return response.data.list.map(video => ({
        id: video.id,
        snippet: {
          title: video.title,
          description: video.description,
          thumbnails: {
            medium: { url: video.thumbnail_url }
          },
          publishedAt: video.created_time
        },
        statistics: {
          viewCount: video.views_total
        }
      }))
    } catch (error) {
      console.error('Error fetching Dailymotion videos:', error)
      throw error
    }
  },

  // Get popular videos (trending videos)
  getPopularVideos: async (maxResults = 12) => {
    try {
      const response = await axios.get(`${DAILYMOTION_BASE_URL}/videos`, {
        params: {
          flags: 'featured', // Get featured/popular videos
          limit: maxResults,
          fields: 'id,title,description,thumbnail_url,duration,views_total,created_time',
          sort: 'trending'
        }
      })

      // Transform to YouTube-like format
      return response.data.list.map(video => ({
        id: video.id,
        snippet: {
          title: video.title,
          description: video.description,
          thumbnails: {
            medium: { url: video.thumbnail_url }
          },
          publishedAt: video.created_time
        },
        statistics: {
          viewCount: video.views_total
        }
      }))
    } catch (error) {
      console.error('Error fetching popular videos:', error)
      throw error
    }
  },

  // Search for cartoons/kids content
  getCartoonVideos: async (maxResults = 20) => {
    try {
      const response = await axios.get(`${DAILYMOTION_BASE_URL}/videos`, {
        params: {
          search: 'cartoon OR animation OR kids OR children OR disney OR pixar',
          limit: maxResults,
          fields: 'id,title,description,thumbnail_url,duration,views_total,created_time',
          sort: 'relevance'
        }
      })

      // Transform to YouTube-like format
      return response.data.list.map(video => ({
        id: { videoId: video.id }, // Dailymotion uses different ID structure
        snippet: {
          title: video.title,
          description: video.description,
          thumbnails: {
            medium: { url: video.thumbnail_url }
          },
          channelTitle: 'Dailymotion',
          publishedAt: video.created_time
        }
      }))
    } catch (error) {
      console.error('Error fetching cartoon videos:', error)
      throw error
    }
  },

  // Get video details
  getVideoDetails: async (videoId) => {
    try {
      const response = await axios.get(`${DAILYMOTION_BASE_URL}/video/${videoId}`, {
        params: {
          fields: 'id,title,description,thumbnail_url,duration,views_total,created_time'
        }
      })

      return {
        id: response.data.id,
        snippet: {
          title: response.data.title,
          description: response.data.description,
          thumbnails: {
            medium: { url: response.data.thumbnail_url }
          }
        },
        statistics: {
          viewCount: response.data.views_total
        }
      }
    } catch (error) {
      console.error('Error fetching video details:', error)
      throw error
    }
  },

  // Format duration (Dailymotion gives duration in seconds)
  formatDuration: (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const seconds = durationInSeconds % 60

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
