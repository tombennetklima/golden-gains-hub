import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

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

export const supabaseService = {
  // User Authentication
  async register(username: string, email: string, password: string): Promise<void> {
    // Register the user with Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw new Error(authError.message);
    
    // Get the user ID from the newly created auth user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error("Failed to get user data");
    
    const userId = userData.user.id;
    
    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username,
        email,
        is_admin: false,
        is_locked: false,
      });
    
    if (profileError) throw new Error(profileError.message);
    
    // Create status record
    const { error: statusError } = await supabase
      .from('user_status')
      .insert({
        user_id: userId,
        upload_status: 'not_complete',
        community_status: 'not_started',
      });
    
    if (statusError) throw new Error(statusError.message);
  },
  
  async login(email: string, password: string): Promise<User> {
    // Sign in with Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) throw new Error(authError.message);
    
    // Get the user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error("Failed to get user data");
    
    const userId = userData.user.id;
    
    // Get the profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw new Error(profileError.message);
    
    // Get user status
    const { data: status, error: statusError } = await supabase
      .from('user_status')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (statusError && statusError.code !== 'PGRST116') {
      throw new Error(statusError.message);
    }
    
    return {
      id: userId,
      username: profile.username,
      email: profile.email,
      isAdmin: profile.is_admin,
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        street: profile.street,
        houseNumber: profile.house_number,
        postalCode: profile.postal_code,
        city: profile.city,
        isLocked: profile.is_locked,
      },
      documentsStatus: status ? {
        uploadStatus: status.upload_status,
        communityStatus: status.community_status,
      } : {
        uploadStatus: "not_complete",
        communityStatus: "not_started"
      }
    };
  },
  
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    localStorage.removeItem("currentUserId");
  },
  
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return null;
    }
    
    const userId = data.user.id;
    
    // Get the profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }
    
    // Get user status
    const { data: status, error: statusError } = await supabase
      .from('user_status')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (statusError && statusError.code !== 'PGRST116') {
      console.error("Error fetching status:", statusError);
    }
    
    return {
      id: userId,
      username: profile.username,
      email: profile.email,
      isAdmin: profile.is_admin,
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        street: profile.street,
        houseNumber: profile.house_number,
        postalCode: profile.postal_code,
        city: profile.city,
        isLocked: profile.is_locked,
      },
      documentsStatus: status ? {
        uploadStatus: status.upload_status,
        communityStatus: status.community_status,
      } : {
        uploadStatus: "not_complete",
        communityStatus: "not_started"
      }
    };
  },
  
  // Profile Management
  async updateUserProfile(userId: string, profile: UserProfile): Promise<User> {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        street: profile.street,
        house_number: profile.houseNumber,
        postal_code: profile.postalCode,
        city: profile.city,
      })
      .eq('id', userId);
    
    if (error) throw new Error(error.message);
    
    // Get updated user data
    return await this.getUser(userId);
  },
  
  // Document Management
  async uploadDocument(userId: string, type: "id" | "card" | "bank", files: string[]): Promise<DocumentUpload> {
    // First, check if document of this type already exists
    const { data: existingDocs, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type);
    
    if (fetchError) throw new Error(fetchError.message);
    
    // Upload files to Supabase storage
    const uploadPromises = files.map(async (fileString) => {
      // For base64 data URLs, extract the data part
      const base64Data = fileString.split(',')[1];
      if (!base64Data) {
        // If it's already a path/url, return it
        return fileString;
      }
      
      // Create a unique filename
      const fileName = `${userId}/${type}/${uuidv4()}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, Buffer.from(base64Data, 'base64'), {
          contentType: this.getContentType(fileString),
          upsert: true
        });
      
      if (error) throw new Error(`Error uploading file: ${error.message}`);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    });
    
    // Wait for all uploads to complete
    const filePaths = await Promise.all(uploadPromises);
    
    let docId: string;
    
    if (existingDocs && existingDocs.length > 0) {
      // Update existing document
      docId = existingDocs[0].id;
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          file_paths: filePaths,
        })
        .eq('id', docId);
      
      if (updateError) throw new Error(updateError.message);
    } else {
      // Create new document
      docId = uuidv4();
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          id: docId,
          user_id: userId,
          type,
          file_paths: filePaths,
          is_locked: false,
          is_approved: false,
        });
      
      if (insertError) throw new Error(insertError.message);
    }
    
    // Update user status
    await this.updateDocumentStatus(userId);
    
    return {
      id: docId,
      userId,
      type,
      files: filePaths,
      isLocked: false,
      isApproved: false
    };
  },
  
  // Helper for determining content type
  getContentType(base64String: string): string {
    if (base64String.startsWith('data:image/png')) return 'image/png';
    if (base64String.startsWith('data:image/jpeg')) return 'image/jpeg';
    if (base64String.startsWith('data:image/jpg')) return 'image/jpg';
    if (base64String.startsWith('data:application/pdf')) return 'application/pdf';
    return 'application/octet-stream';
  },
  
  async getUserDocuments(userId: string): Promise<DocumentUpload[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    return (data || []).map(doc => ({
      id: doc.id,
      userId: doc.user_id,
      type: doc.type,
      files: doc.file_paths,
      isLocked: doc.is_locked,
      isApproved: doc.is_approved
    }));
  },
  
  async submitDocumentsForReview(userId: string): Promise<void> {
    // Lock all documents
    const { error: docError } = await supabase
      .from('documents')
      .update({ is_locked: true })
      .eq('user_id', userId);
    
    if (docError) throw new Error(docError.message);
    
    // Lock profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_locked: true })
      .eq('id', userId);
    
    if (profileError) throw new Error(profileError.message);
    
    // Update status to pending review
    const { error: statusError } = await supabase
      .from('user_status')
      .update({ upload_status: 'pending_review' })
      .eq('user_id', userId);
    
    if (statusError) throw new Error(statusError.message);
  },
  
  // Helper method to update document status
  async updateDocumentStatus(userId: string): Promise<void> {
    // Get all user documents
    const { data: docs, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    const hasIdDocs = docs?.some(doc => doc.type === "id") || false;
    const hasCardDocs = docs?.some(doc => doc.type === "card") || false;
    const hasBankDocs = docs?.some(doc => doc.type === "bank") || false;
    
    // Only update if necessary
    if (hasIdDocs && hasCardDocs && hasBankDocs) {
      // Check current status first
      const { data: status } = await supabase
        .from('user_status')
        .select('upload_status')
        .eq('user_id', userId)
        .single();
      
      if (status && status.upload_status === "not_complete") {
        // Keep as not_complete if that's the current status
        return;
      }
      
      // Otherwise we don't need to update
    }
  },
  
  // Additional helper method to get a single user
  async getUser(userId: string): Promise<User> {
    // Get the profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw new Error(profileError.message);
    
    // Get user status
    const { data: status, error: statusError } = await supabase
      .from('user_status')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (statusError && statusError.code !== 'PGRST116') {
      throw new Error(statusError.message);
    }
    
    return {
      id: userId,
      username: profile.username,
      email: profile.email,
      isAdmin: profile.is_admin,
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        street: profile.street,
        houseNumber: profile.house_number,
        postalCode: profile.postal_code,
        city: profile.city,
        isLocked: profile.is_locked,
      },
      documentsStatus: status ? {
        uploadStatus: status.upload_status,
        communityStatus: status.community_status,
      } : {
        uploadStatus: "not_complete",
        communityStatus: "not_started"
      }
    };
  },
  
  // Admin Functions
  async getAllUsers(): Promise<User[]> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw new Error(profilesError.message);
    
    // Get all statuses
    const { data: statuses, error: statusesError } = await supabase
      .from('user_status')
      .select('*');
    
    if (statusesError && statusesError.code !== 'PGRST116') {
      throw new Error(statusesError.message);
    }
    
    // Map profiles to User objects
    return profiles.map(profile => {
      const userStatus = statuses?.find(status => status.user_id === profile.id);
      
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        isAdmin: profile.is_admin,
        profile: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          street: profile.street,
          houseNumber: profile.house_number,
          postalCode: profile.postal_code,
          city: profile.city,
          isLocked: profile.is_locked,
        },
        documentsStatus: userStatus ? {
          uploadStatus: userStatus.upload_status,
          communityStatus: userStatus.community_status,
        } : {
          uploadStatus: "not_complete",
          communityStatus: "not_started"
        }
      };
    });
  },
  
  async searchUsers(query: string): Promise<User[]> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Search profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`);
    
    if (profilesError) throw new Error(profilesError.message);
    
    // Get user IDs from search results
    const userIds = profiles.map(profile => profile.id);
    
    // Get statuses for these users
    const { data: statuses, error: statusesError } = await supabase
      .from('user_status')
      .select('*')
      .in('user_id', userIds);
    
    if (statusesError && statusesError.code !== 'PGRST116') {
      throw new Error(statusesError.message);
    }
    
    // Map profiles to User objects
    return profiles.map(profile => {
      const userStatus = statuses?.find(status => status.user_id === profile.id);
      
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        isAdmin: profile.is_admin,
        profile: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          street: profile.street,
          houseNumber: profile.house_number,
          postalCode: profile.postal_code,
          city: profile.city,
          isLocked: profile.is_locked,
        },
        documentsStatus: userStatus ? {
          uploadStatus: userStatus.upload_status,
          communityStatus: userStatus.community_status,
        } : {
          uploadStatus: "not_complete",
          communityStatus: "not_started"
        }
      };
    });
  },
  
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Don't allow changing admin status of main admin
    if (userId === "admin-id" && data.isAdmin === false) {
      throw new Error("Cannot remove admin status from main admin account");
    }
    
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        username: data.username,
        email: data.email,
        is_admin: data.isAdmin,
      })
      .eq('id', userId);
    
    if (error) throw new Error(error.message);
    
    // Get updated user data
    return await this.getUser(userId);
  },
  
  async updateUserDocumentStatus(userId: string, status: "pending_review" | "approved" | "rejected"): Promise<User> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Update status
    const { error } = await supabase
      .from('user_status')
      .update({ upload_status: status })
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    // Get updated user data
    return await this.getUser(userId);
  },
  
  async updateUserCommunityStatus(userId: string, status: "not_started" | "kontaktaufnahme" | "vorbereitung" | 
                               "registrierung" | "verifizierung" | "wetten" | "auszahlung" | "abgeschlossen"): Promise<User> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Update status
    const { error } = await supabase
      .from('user_status')
      .update({ community_status: status })
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    // Get updated user data
    return await this.getUser(userId);
  },
  
  async unlockFieldForEditing(userId: string, field: string): Promise<void> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Handle profile fields
    if (["firstName", "lastName", "phone", "street", "houseNumber", "postalCode", "city"].includes(field)) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_locked: false })
        .eq('id', userId);
      
      if (error) throw new Error(error.message);
    }
    
    // Handle document types
    if (["id", "card", "bank"].includes(field)) {
      const { error } = await supabase
        .from('documents')
        .update({ is_locked: false })
        .eq('user_id', userId)
        .eq('type', field);
      
      if (error) throw new Error(error.message);
    }
    
    // Reset status to not complete
    const { error } = await supabase
      .from('user_status')
      .update({ upload_status: 'not_complete' })
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
  },
  
  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // In Supabase, we can't directly change a user's password from the server
    // We would typically send a password reset email
    // For now, we'll throw an error explaining the limitation
    throw new Error("Password reset via admin is not supported with Supabase. Please use the password reset flow.");
  },
  
  async deleteUser(userId: string): Promise<void> {
    // Check if current user is admin
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    // Don't allow deleting the main admin
    if (userId === "admin-id") {
      throw new Error("Cannot delete main admin account");
    }
    
    // Delete documents
    const { error: docsError } = await supabase
      .from('documents')
      .delete()
      .eq('user_id', userId);
    
    if (docsError) throw new Error(docsError.message);
    
    // Delete status
    const { error: statusError } = await supabase
      .from('user_status')
      .delete()
      .eq('user_id', userId);
    
    if (statusError) throw new Error(statusError.message);
    
    // Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) throw new Error(profileError.message);
    
    // Delete auth user - this requires administrative privileges in Supabase
    // Typically would be done through Supabase dashboard or server-side function
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) throw new Error(authError.message);
  },
  
  // Reset password functionality
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    // In a real app with Supabase, we would use their built-in password reset flow
    // For simplicity, we'll implement a basic version here
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth?reset=true',
    });
    
    if (error) throw new Error(error.message);
  },
};
