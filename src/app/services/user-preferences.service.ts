import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserPreferences {
  lastSearchTerm: string;
  searchHistory: string[];
  favoriteGenres: string[];
  preferredLanguage: string;
  theme: 'light' | 'dark';
}

export interface SearchHistoryItem {
  term: string;
  timestamp: number;
  resultCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly PREFERENCES_KEY = 'user_preferences';
  private readonly SEARCH_HISTORY_KEY = 'search_history';
  private readonly MAX_SEARCH_HISTORY = 20;

  private preferencesSubject = new BehaviorSubject<UserPreferences>(this.getDefaultPreferences());
  public preferences$ = this.preferencesSubject.asObservable();

  constructor() {
    this.loadPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      lastSearchTerm: '',
      searchHistory: [],
      favoriteGenres: [],
      preferredLanguage: 'en',
      theme: 'light'
    };
  }

  private loadPreferences(): void {
    const stored = localStorage.getItem(this.PREFERENCES_KEY);
    if (stored) {
      try {
        const preferences = JSON.parse(stored);
        this.preferencesSubject.next({ ...this.getDefaultPreferences(), ...preferences });
      } catch (error) {
        console.error('Error loading preferences:', error);
        this.preferencesSubject.next(this.getDefaultPreferences());
      }
    }
  }

  private savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    this.preferencesSubject.next(preferences);
  }

  getPreferences(): UserPreferences {
    return this.preferencesSubject.value;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const currentPreferences = this.getPreferences();
    const newPreferences = { ...currentPreferences, ...updates };
    this.savePreferences(newPreferences);
  }

  setLastSearchTerm(term: string): void {
    this.updatePreferences({ lastSearchTerm: term });
  }

  getLastSearchTerm(): string {
    return this.getPreferences().lastSearchTerm;
  }

  addToSearchHistory(term: string, resultCount: number = 0): void {
    const history = this.getSearchHistory();
    const newItem: SearchHistoryItem = {
      term,
      timestamp: Date.now(),
      resultCount
    };

    // Remove existing entry with same term
    const filteredHistory = history.filter(item => item.term !== term);
    
    // Add new item at the beginning
    const updatedHistory = [newItem, ...filteredHistory].slice(0, this.MAX_SEARCH_HISTORY);
    
    localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    // Update preferences with search history terms
    const searchTerms = updatedHistory.map(item => item.term);
    this.updatePreferences({ searchHistory: searchTerms });
  }

  getSearchHistory(): SearchHistoryItem[] {
    const stored = localStorage.getItem(this.SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading search history:', error);
        return [];
      }
    }
    return [];
  }

  clearSearchHistory(): void {
    localStorage.removeItem(this.SEARCH_HISTORY_KEY);
    this.updatePreferences({ searchHistory: [] });
  }

  removeFromSearchHistory(term: string): void {
    const history = this.getSearchHistory();
    const filteredHistory = history.filter(item => item.term !== term);
    localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
    
    const searchTerms = filteredHistory.map(item => item.term);
    this.updatePreferences({ searchHistory: searchTerms });
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.updatePreferences({ theme });
  }

  getTheme(): 'light' | 'dark' {
    return this.getPreferences().theme;
  }

  setPreferredLanguage(language: string): void {
    this.updatePreferences({ preferredLanguage: language });
  }

  getPreferredLanguage(): string {
    return this.getPreferences().preferredLanguage;
  }

  addFavoriteGenre(genre: string): void {
    const currentGenres = this.getPreferences().favoriteGenres;
    if (!currentGenres.includes(genre)) {
      this.updatePreferences({ favoriteGenres: [...currentGenres, genre] });
    }
  }

  removeFavoriteGenre(genre: string): void {
    const currentGenres = this.getPreferences().favoriteGenres;
    this.updatePreferences({ favoriteGenres: currentGenres.filter(g => g !== genre) });
  }

  getFavoriteGenres(): string[] {
    return this.getPreferences().favoriteGenres;
  }

  // Method to export all user data
  exportUserData(): any {
    return {
      preferences: this.getPreferences(),
      searchHistory: this.getSearchHistory(),
      collections: localStorage.getItem('movie_collections'),
      cacheStats: this.getCacheStats()
    };
  }

  // Method to import user data
  importUserData(data: any): void {
    if (data.preferences) {
      this.savePreferences(data.preferences);
    }
    if (data.searchHistory) {
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(data.searchHistory));
    }
    if (data.collections) {
      localStorage.setItem('movie_collections', data.collections);
    }
  }

  // Method to clear all user data
  clearAllUserData(): void {
    localStorage.removeItem(this.PREFERENCES_KEY);
    localStorage.removeItem(this.SEARCH_HISTORY_KEY);
    localStorage.removeItem('movie_collections');
    
    // Clear movie cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('movie_cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    this.preferencesSubject.next(this.getDefaultPreferences());
  }

  private getCacheStats(): { totalItems: number; totalSize: number } {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('movie_cache_'));
    let totalSize = 0;
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });

    return {
      totalItems: keys.length,
      totalSize: totalSize
    };
  }
} 