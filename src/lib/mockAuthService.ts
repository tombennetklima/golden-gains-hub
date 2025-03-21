// This is a mock service that simulates authentication functionality
// In a real application, this would be replaced with actual API calls

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  profile?: UserProfile;
  documentsStatus?: DocumentsStatus;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  isLocked?: boolean;
}

export interface DocumentUpload {
  id: string;
  userId: string;
  type: "id" | "card" | "bank";
  files: string[];
  isLocked?: boolean;
  isApproved?: boolean;
}

export interface DocumentsStatus {
  uploadStatus: "not_complete" | "pending_review" | "approved" | "rejected";
  communityStatus: "not_started" | "kontaktaufnahme" | "vorbereitung" | "registrierung" | 
                  "verifizierung" | "wetten" | "auszahlung" | "abgeschlossen";
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

// Store user documents
const userDocuments: Record<string, DocumentUpload[]> = {};

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
      isAdmin: false,
      documentsStatus: {
        uploadStatus: "not_complete",
        communityStatus: "not_started"
      }
    };
    
    users[userId] = user;
    userPasswords[userId] = password;
    userDocuments[userId] = [];
    
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
  
  // Update user profile
  async updateUserProfile(userId: string, profile: UserProfile): Promise<User> {
    await delay(1000);
    
    if (!users[userId]) {
      throw new Error("User not found");
    }
    
    users[userId] = {
      ...users[userId],
      profile: {
        ...users[userId].profile,
        ...profile
      }
    };
    
    return users[userId];
  },
  
  // Upload document
  async uploadDocument(userId: string, type: "id" | "card" | "bank", files: string[]): Promise<DocumentUpload> {
    await delay(1500);
    
    if (!users[userId]) {
      throw new Error("User not found");
    }
    
    // Check if a document of this type already exists
    const existingDocIndex = userDocuments[userId]?.findIndex(doc => doc.type === type);
    const docId = Math.random().toString(36).substring(2, 15);
    
    const newDoc: DocumentUpload = {
      id: docId,
      userId,
      type,
      files,
      isLocked: false,
      isApproved: false
    };
    
    if (!userDocuments[userId]) {
      userDocuments[userId] = [];
    }
    
    if (existingDocIndex !== -1 && existingDocIndex !== undefined) {
      // Replace existing document
      userDocuments[userId][existingDocIndex] = newDoc;
    } else {
      // Add new document
      userDocuments[userId].push(newDoc);
    }
    
    // Update upload status
    this.updateDocumentStatus(userId);
    
    return newDoc;
  },
  
  // Get user documents
  async getUserDocuments(userId: string): Promise<DocumentUpload[]> {
    await delay(500);
    
    if (!users[userId]) {
      throw new Error("User not found");
    }
    
    return userDocuments[userId] || [];
  },
  
  // Submit all documents for review
  async submitDocumentsForReview(userId: string): Promise<void> {
    await delay(1000);
    
    if (!users[userId]) {
      throw new Error("User not found");
    }
    
    // Lock all documents
    if (userDocuments[userId]) {
      userDocuments[userId] = userDocuments[userId].map(doc => ({
        ...doc,
        isLocked: true
      }));
    }
    
    // Lock profile
    if (users[userId].profile) {
      users[userId].profile = {
        ...users[userId].profile,
        isLocked: true
      };
    }
    
    // Update status to pending review
    users[userId] = {
      ...users[userId],
      documentsStatus: {
        ...users[userId].documentsStatus,
        uploadStatus: "pending_review"
      }
    };
    
    return;
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
  
  // Helper method to update document status
  updateDocumentStatus(userId: string): void {
    if (!users[userId] || !userDocuments[userId]) return;
    
    const docs = userDocuments[userId];
    const hasIdDocs = docs.some(doc => doc.type === "id");
    const hasCardDocs = docs.some(doc => doc.type === "card");
    const hasBankDocs = docs.some(doc => doc.type === "bank");
    
    // If all three types of documents exist, update the status
    if (hasIdDocs && hasCardDocs && hasBankDocs) {
      users[userId] = {
        ...users[userId],
        documentsStatus: {
          ...users[userId].documentsStatus,
          uploadStatus: users[userId].documentsStatus?.uploadStatus === "not_complete" 
            ? "not_complete" 
            : users[userId].documentsStatus?.uploadStatus
        }
      };
    }
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
  
  // Update user documents status (admin only)
  async updateUserDocumentStatus(userId: string, status: "pending_review" | "approved" | "rejected"): Promise<User> {
    await delay(1000);
    
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
    
    users[userId] = {
      ...user,
      documentsStatus: {
        ...user.documentsStatus,
        uploadStatus: status
      }
    };
    
    return users[userId];
  },
  
  // Update user community status (admin only)
  async updateUserCommunityStatus(userId: string, status: "not_started" | "kontaktaufnahme" | "vorbereitung" | 
                                 "registrierung" | "verifizierung" | "wetten" | "auszahlung" | "abgeschlossen"): Promise<User> {
    await delay(1000);
    
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
    
    users[userId] = {
      ...user,
      documentsStatus: {
        ...user.documentsStatus,
        communityStatus: status
      }
    };
    
    return users[userId];
  },
  
  // Unlock field or document for editing (admin only)
  async unlockFieldForEditing(userId: string, field: string): Promise<void> {
    await delay(1000);
    
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
    
    // Handle profile fields
    if (["firstName", "lastName", "phone", "street", "houseNumber", "postalCode", "city"].includes(field)) {
      if (user.profile) {
        user.profile.isLocked = false;
      }
    }
    
    // Handle document types
    if (["id", "card", "bank"].includes(field)) {
      const docIndex = userDocuments[userId]?.findIndex(doc => doc.type === field);
      
      if (docIndex !== undefined && docIndex !== -1 && userDocuments[userId]) {
        userDocuments[userId][docIndex].isLocked = false;
      }
    }
    
    // Reset status to not complete
    user.documentsStatus = {
      ...user.documentsStatus,
      uploadStatus: "not_complete"
    };
    
    return;
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
    delete userDocuments[userId];
    
    return;
  }
};
