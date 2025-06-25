export const APP_CONSTANTS = {
  // API Configuration
  API: {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    API_KEY: '85204a8cc33baf447559fb6d51b18313'
  },

  // Cache Configuration
  CACHE: {
    DURATION: 30 * 60 * 1000, // 30 minutes
    PREFIX: 'movie_cache_'
  },

  // Pagination
  PAGINATION: {
    MAX_PAGES: 3,
    DEFAULT_PAGE_SIZE: 20
  },

  // UI Configuration
  UI: {
    SNACKBAR_DURATION: {
      SUCCESS: 3000,
      ERROR: 5000,
      INFO: 3000,
      WARNING: 4000
    },
    DIALOG_WIDTH: {
      SMALL: '400px',
      MEDIUM: '500px',
      LARGE: '800px'
    }
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    COLLECTIONS: 'movie_collections',
    USER_PREFERENCES: 'user_preferences'
  },

  // Image Sizes
  IMAGE_SIZES: {
    THUMBNAIL: 'w92',
    SMALL: 'w154',
    MEDIUM: 'w185',
    LARGE: 'w342',
    EXTRA_LARGE: 'w500',
    ORIGINAL: 'original'
  },

  // Validation
  VALIDATION: {
    MIN_SEARCH_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500
  }
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  API_ERROR: 'API error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
} as const;

export const SUCCESS_MESSAGES = {
  COLLECTION_CREATED: 'Collection created successfully!',
  COLLECTION_UPDATED: 'Collection updated successfully!',
  COLLECTION_DELETED: 'Collection deleted successfully!',
  MOVIES_ADDED: 'Movies added to collection successfully!',
  MOVIE_REMOVED: 'Movie removed from collection successfully!',
  PREFERENCES_SAVED: 'Preferences saved successfully!'
} as const; 