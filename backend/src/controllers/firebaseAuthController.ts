import { Request, Response } from 'express';
import { auth, firestore } from '../config/firebase';
import { AuthenticatedRequest } from '../middleware/firebaseAuth';

// Get user profile from Firestore
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userDoc = await firestore.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
      return;
    }

    const userData = userDoc.data();
    res.json({
      success: true,
      data: userData
    });
  } catch (error: any) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { displayName, bio, phoneNumber, dateOfBirth } = req.body;
    
    const updateData: any = {
      updatedAt: new Date()
    };

    if (displayName) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    await firestore.collection('users').doc(req.user.uid).update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Delete user from Firebase Auth
    await auth.deleteUser(req.user.uid);

    // Delete user document from Firestore
    await firestore.collection('users').doc(req.user.uid).delete();

    // Also delete from usernames collection if it exists
    const userDoc = await firestore.collection('users').doc(req.user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData?.username) {
        await firestore.collection('usernames').doc(userData.username).delete();
      }
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

// Get all users (for admin or friend search)
export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.uid) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { search, limit = 20 } = req.query;
    let query = firestore.collection('users').limit(Number(limit));

    if (search) {
      // Simple search by username or display name
      // Note: Firestore doesn't support full-text search natively
      // For production, consider using Algolia or Elasticsearch
      query = query.where('username', '>=', search)
                   .where('username', '<=', search + '\uf8ff');
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: users
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// Check if username is available
export const checkUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    
    if (!username) {
      res.status(400).json({
        success: false,
        message: 'Username is required'
      });
      return;
    }

    const usernameDoc = await firestore.collection('usernames').doc(username.toLowerCase()).get();
    
    res.json({
      success: true,
      data: {
        available: !usernameDoc.exists
      }
    });
  } catch (error: any) {
    console.error('Check username error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check username availability'
    });
  }
};