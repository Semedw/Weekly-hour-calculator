export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserData {
  user: User;
  weekData: any[];
  lastUpdated: string;
}

const USERS_KEY = 'weekly_tracker_users';
const CURRENT_USER_KEY = 'weekly_tracker_current_user';

export const saveUser = (username: string, email: string): User => {
  const users = getAllUsers();
  const existingUser = users.find(u => u.username === username);
  
  if (existingUser) {
    return existingUser;
  }

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    email,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const getAllUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const findUserByUsername = (username: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.username === username) || null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const saveWeekData = (userId: string, weekData: any[]): void => {
  const userData: UserData = {
    user: getCurrentUser()!,
    weekData,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(`week_data_${userId}`, JSON.stringify(userData));
};

export const loadWeekData = (userId: string): any[] | null => {
  const dataJson = localStorage.getItem(`week_data_${userId}`);
  if (!dataJson) return null;
  
  const userData: UserData = JSON.parse(dataJson);
  return userData.weekData;
};
