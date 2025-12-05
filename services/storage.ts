import { Content, User } from '../types';
import { INITIAL_CONTENT, MOCK_USER } from '../constants';

const STORAGE_KEYS = {
  CONTENT: 'abiflix_content',
  USER: 'abiflix_user',
};

class StorageService {
  private content: Content[];
  private user: User;

  constructor() {
    // Initialize content
    const storedContent = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (storedContent) {
      this.content = JSON.parse(storedContent);
    } else {
      this.content = INITIAL_CONTENT;
      this.saveContent();
    }

    // Initialize user
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.user = MOCK_USER;
      this.saveUser();
    }
  }

  // --- Content Methods ---
  getAllContent(): Content[] {
    return this.content;
  }

  getContentById(id: string): Content | undefined {
    return this.content.find(c => c.id === id);
  }

  getTrending(): Content[] {
    return this.content.filter(c => c.trending);
  }

  searchContent(query: string): Content[] {
    const q = query.toLowerCase();
    return this.content.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.genres.some(g => g.toLowerCase().includes(q)) ||
      c.cast.some(a => a.toLowerCase().includes(q)) ||
      c.country.toLowerCase().includes(q)
    );
  }

  addContent(newContent: Content): void {
    this.content.unshift(newContent);
    this.saveContent();
  }

  updateContent(updatedContent: Content): void {
    const index = this.content.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
      this.content[index] = updatedContent;
      this.saveContent();
    }
  }

  deleteContent(id: string): void {
    this.content = this.content.filter(c => c.id !== id);
    this.saveContent();
  }

  // --- User Methods ---
  getUser(): User {
    return this.user;
  }

  toggleWatchlist(contentId: string): void {
    if (this.user.watchlist.includes(contentId)) {
      this.user.watchlist = this.user.watchlist.filter(id => id !== contentId);
    } else {
      this.user.watchlist.push(contentId);
    }
    this.saveUser();
  }

  addToHistory(contentId: string): void {
    if (!this.user.history.includes(contentId)) {
      this.user.history.unshift(contentId);
      this.saveUser();
    }
  }

  // Simulate Admin Login
  loginAdmin(identifier: string, password: string): boolean {
    // Hardcoded credentials for demo purposes
    // In a real app, this would be an API call
    // Accepts 'abew' as username and '488055' as password
    if (identifier === 'abew' && password === '488055') {
        this.user.isAdmin = true;
        this.saveUser();
        return true;
    }
    return false;
  }

  // --- Private Helpers ---
  private saveContent(): void {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(this.content));
  }

  private saveUser(): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
  }
}

export const db = new StorageService();