import { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '@/middleware/errorHandler';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { ApiResponse, AuthenticatedRequest } from '@/types';
import { logger } from '@/utils/logger';
import redisClient from '@/config/redis';

// Register user
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, displayName, phoneNumber, dateOfBirth } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError('User already exists with this email or username', 400);
  }

  // Create user
  const user = new User({
    username,
    email,
    password,
    displayName,
    phoneNumber,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
  });
  
  await user.save();

  // Generate tokens
  const tokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in Redis
  await redisClient.setEx(`refresh_token:${user._id}`, 7 * 24 * 60 * 60, refreshToken);

  logger.info(`User registered: ${user.username} (${user.email})`);

  const response: ApiResponse = {
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        snapcode: user.snapcode,
        snapScore: user.snapScore
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  };

  res.status(201).json(response);
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier || !password) {
    throw new AppError('Please provide email/username and password', 400);
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const tokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in Redis
  await redisClient.setEx(`refresh_token:${user._id}`, 7 * 24 * 60 * 60, refreshToken);

  logger.info(`User logged in: ${user.username} (${user.email})`);

  const response: ApiResponse = {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        snapcode: user.snapcode,
        snapScore: user.snapScore
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  };

  res.status(200).json(response);
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in Redis
    const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Update refresh token in Redis
    await redisClient.setEx(`refresh_token:${user._id}`, 7 * 24 * 60 * 60, newRefreshToken);

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});

// Logout user
export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  // Remove refresh token from Redis
  await redisClient.del(`refresh_token:${req.user.userId}`);

  logger.info(`User logged out: ${req.user.username}`);

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };

  res.status(200).json(response);
});

// Get current user
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const user = await User.findById(req.user.userId)
    .populate('friends', 'username displayName profilePicture')
    .populate('bestFriends', 'username displayName profilePicture');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        bitmoji: user.bitmoji,
        snapcode: user.snapcode,
        bio: user.bio,
        snapScore: user.snapScore,
        friends: user.friends,
        bestFriends: user.bestFriends,
        settings: user.settings,
        createdAt: user.createdAt
      }
    }
  };

  res.status(200).json(response);
});

// Change password
export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters long', 400);
  }

  const user = await User.findById(req.user.userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Invalidate all refresh tokens
  await redisClient.del(`refresh_token:${user._id}`);

  logger.info(`Password changed for user: ${user.username}`);

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully'
  };

  res.status(200).json(response);
});