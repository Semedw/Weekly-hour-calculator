import { DayData } from '../utils/timeCalculations';

export interface User {
  id: number;
  username: string;
  email: string;
}

interface WeekData {
  id: number;
  week_start_date: string;
  week_data: DayData[];
  created_at: string;
  updated_at: string;
}

class LocalStorageService {
  private userId: number | null = null;

  setUserId(id: number) {
    this.userId = id;
  }

  getUserId(): number | null {
    return this.userId;
  }

  async register(username: string, email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    const newUser: User & { password: string } = {
      id: Date.now(),
      username,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    this.setUserId(newUser.id);
    return { id: newUser.id, username: newUser.username, email: newUser.email };
  }

  async login(username: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    this.setUserId(user.id);
    return { id: user.id, username: user.username, email: user.email };
  }

  async logout(): Promise<void> {
    this.userId = null;
  }

  async getCurrentWeek(): Promise<WeekData> {
    if (!this.userId) {
      throw new Error('User not logged in');
    }

    const key = `week_data_${this.userId}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      return JSON.parse(stored);
    }

    // Return empty week
    const emptyWeek: WeekData = {
      id: 1,
      week_start_date: new Date().toISOString().split('T')[0],
      week_data: this.getEmptyWeekData(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return emptyWeek;
  }

  async saveCurrentWeek(weekData: DayData[]): Promise<WeekData> {
    if (!this.userId) {
      throw new Error('User not logged in');
    }

    const key = `week_data_${this.userId}`;
    const savedWeek: WeekData = {
      id: 1,
      week_start_date: new Date().toISOString().split('T')[0],
      week_data: weekData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(savedWeek));
    return savedWeek;
  }

  async getWeekHistory(): Promise<WeekData[]> {
    if (!this.userId) {
      throw new Error('User not logged in');
    }

    const currentWeek = await this.getCurrentWeek();
    return [currentWeek];
  }

  private getStoredUsers(): Array<User & { password: string }> {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  }

  private getEmptyWeekData(): DayData[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
      day,
      sessions: [{ checkIn: '', checkOut: '' }]
    }));
  }
}

export const localStorageService = new LocalStorageService();
