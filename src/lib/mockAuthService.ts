
// This is a mock service that simulates authentication functionality
// In a real application, this would be replaced with actual API calls

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

// Simulate localStorage for user data
const users: Record<string, User> = {
  "admin-id": {
    id: "admin-id",
    username: "admin",
    email: "admin@betclever.de",
    isAdmin: true
  }
};

// Set admin password (in a real app, this would be hashed)
const userPasswords: Record<string, string> = {
  "admin-id": "Ver4Wittert!Ver4Wittert!"
};

let currentUser: User | null = null;

// Simulate server delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  // Register a new user
  async register(username: string, email: string, password: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    // Check if email already exists
    if (Object.values(users).some(user => user.email === email)) {
      throw new Error("Email already exists");
    }
    
    const userId = Math.random().toString(36).substring(2, 15);
    const user: User = {
      id: userId,
      username,
      email,
      isAdmin: false
    };
    
    users[userId] = user;
    userPasswords[userId] = password;
    
    return;
  },
  
  // Login user
  async login(email: string, password: string): Promise<User> {
    await delay(1000); // Simulate network delay
    
    const user = Object.values(users).find(user => user.email === email);
    const userId = user?.id;
    
    if (!user || !userId || userPasswords[userId] !== password) {
      throw new Error("Invalid email or password");
    }
    
    currentUser = user;
    // In a real app, you would set a JWT token in localStorage or cookies
    localStorage.setItem("currentUserId", user.id);
    
    return user;
  },
  
  // Logout user
  async logout(): Promise<void> {
    await delay(500); // Simulate network delay
    
    currentUser = null;
    localStorage.removeItem("currentUserId");
    
    return;
  },
  
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const userId = localStorage.getItem("currentUserId");
    
    if (!userId) {
      return null;
    }
    
    return users[userId] || null;
  },
  
  // Reset password functionality
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    // In a real app, you would validate the token
    // For the mock service, we'll just find the user by email and update their password
    const user = Object.values(users).find(user => user.email === email);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update the password
    userPasswords[user.id] = newPassword;
    
    return;
  },
  
  // Admin Functions
  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    await delay(800); // Simulate network delay
    
    // In a real app, you would check if the current user is an admin
    const currentUserId = localStorage.getItem("currentUserId");
    const currentUser = currentUserId ? users[currentUserId] : null;
    
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    return Object.values(users);
  },
  
  // Search users (admin only)
  async searchUsers(query: string): Promise<User[]> {
    await delay(800); // Simulate network delay
    
    // In a real app, you would check if the current user is an admin
    const currentUserId = localStorage.getItem("currentUserId");
    const currentUser = currentUserId ? users[currentUserId] : null;
    
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    const lowercaseQuery = query.toLowerCase();
    return Object.values(users).filter(user => 
      user.email.toLowerCase().includes(lowercaseQuery) || 
      user.username.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  // Update user (admin only)
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    await delay(1000); // Simulate network delay
    
    // In a real app, you would check if the current user is an admin
    const currentUserId = localStorage.getItem("currentUserId");
    const currentUser = currentUserId ? users[currentUserId] : null;
    
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    const user = users[userId];
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Don't allow changing admin status of admin account
    if (userId === "admin-id" && data.isAdmin === false) {
      throw new Error("Cannot remove admin status from main admin account");
    }
    
    // Update user data
    users[userId] = {
      ...user,
      ...data,
      id: userId // Ensure ID doesn't change
    };
    
    return users[userId];
  },
  
  // Update user password (admin only)
  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    // In a real app, you would check if the current user is an admin
    const currentUserId = localStorage.getItem("currentUserId");
    const currentUser = currentUserId ? users[currentUserId] : null;
    
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    const user = users[userId];
    
    if (!user) {
      throw new Error("User not found");
    }
    
    userPasswords[userId] = newPassword;
    
    return;
  },
  
  // Delete user (admin only)
  async deleteUser(userId: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    // In a real app, you would check if the current user is an admin
    const currentUserId = localStorage.getItem("currentUserId");
    const currentUser = currentUserId ? users[currentUserId] : null;
    
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Don't allow deleting admin account
    if (userId === "admin-id") {
      throw new Error("Cannot delete main admin account");
    }
    
    const user = users[userId];
    
    if (!user) {
      throw new Error("User not found");
    }
    
    delete users[userId];
    delete userPasswords[userId];
    
    return;
  }
};
