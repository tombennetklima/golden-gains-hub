
// This is a mock service that simulates authentication functionality
// In a real application, this would be replaced with actual API calls

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
}

// Simulate localStorage for user data
const users: Record<string, User> = {};
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
      isVerified: false
    };
    
    users[userId] = user;
    
    // In a real app, this would send a verification email
    console.log(`Verification email sent to ${email}`);

    return;
  },
  
  // Login user
  async login(email: string, password: string): Promise<User> {
    await delay(1000); // Simulate network delay
    
    const user = Object.values(users).find(user => user.email === email);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    // In a real app, you would verify the password hash here
    
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
  
  // Verify email with token
  async verifyEmail(userId: string, token: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    const user = users[userId];
    
    if (!user) {
      throw new Error("User not found");
    }
    
    user.isVerified = true;
    
    return;
  },
  
  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    const user = Object.values(users).find(user => user.email === email);
    
    if (!user) {
      // Don't reveal if email exists or not for security reasons
      return;
    }
    
    // In a real app, this would send a password reset email
    const resetToken = Math.random().toString(36).substring(2, 15);
    console.log(`Password reset email sent to ${email} with token: ${resetToken}`);
    
    return;
  },
  
  // Reset password with token
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    await delay(1000); // Simulate network delay
    
    const user = Object.values(users).find(user => user.email === email);
    
    if (!user) {
      throw new Error("Invalid reset token");
    }
    
    // In a real app, you would verify the token here
    // Then update the password hash in the database
    
    console.log(`Password updated for user: ${user.email}`);
    
    return;
  }
};
