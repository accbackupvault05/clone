import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IUserSettings, IStreak } from '@/types';

// User Document interface with methods
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  generateSnapcode(): string;
  addFriend(friendId: string): void;
  removeFriend(friendId: string): void;
  blockUser(userId: string): void;
  unblockUser(userId: string): void;
  incrementSnapScore(points?: number): void;
  updateStreak(friendId: string): void;
}

// Streak Schema
const streakSchema = new Schema<IStreak>({
  friendId: {
    type: String,
    required: true,
    ref: 'User'
  },
  count: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

// User Settings Schema
const userSettingsSchema = new Schema<IUserSettings>({
  privacy: {
    whoCanSendMeSnaps: {
      type: String,
      enum: ['everyone', 'friends', 'custom'],
      default: 'friends'
    },
    whoCanViewMyStory: {
      type: String,
      enum: ['everyone', 'friends', 'custom'],
      default: 'friends'
    },
    whoCanSeeMyLocation: {
      type: String,
      enum: ['everyone', 'friends', 'nobody'],
      default: 'friends'
    }
  },
  notifications: {
    snapNotifications: {
      type: Boolean,
      default: true
    },
    messageNotifications: {
      type: Boolean,
      default: true
    },
    storyNotifications: {
      type: Boolean,
      default: true
    },
    friendRequestNotifications: {
      type: Boolean,
      default: true
    }
  }
});

// User Schema
const userSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profilePicture: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null,
    match: /^\+?[\d\s-()]+$/
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  bitmoji: {
    type: String,
    default: null
  },
  snapcode: {
    type: String,
    unique: true,
    default: function() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  snapScore: {
    type: Number,
    default: 0,
    min: 0
  },
  streaks: [streakSchema],
  bestFriends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  settings: {
    type: userSettingsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ snapcode: 1 });
userSchema.index({ createdAt: -1 });



// Method to generate snapcode
userSchema.methods.generateSnapcode = function(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Pre-save middleware to generate snapcode if not provided
userSchema.pre('save', function(next) {
  if (!this.snapcode) {
    this.snapcode = this.generateSnapcode();
  }
  next();
});

// Method to add friend
userSchema.methods.addFriend = function(friendId: string) {
  if (!this.friends.includes(friendId)) {
    this.friends.push(friendId);
  }
};

// Method to remove friend
userSchema.methods.removeFriend = function(friendId: string) {
  this.friends = this.friends.filter((id: any) => id.toString() !== friendId);
  this.bestFriends = this.bestFriends.filter((id: any) => id.toString() !== friendId);
  this.streaks = this.streaks.filter((streak: any) => streak.friendId !== friendId);
};

// Method to block user
userSchema.methods.blockUser = function(userId: string) {
  if (!this.blockedUsers.includes(userId)) {
    this.blockedUsers.push(userId);
  }
  // Remove from friends if blocked
  this.removeFriend(userId);
};

// Method to unblock user
userSchema.methods.unblockUser = function(userId: string) {
  this.blockedUsers = this.blockedUsers.filter((id: any) => id.toString() !== userId);
};

// Method to update snap score
userSchema.methods.incrementSnapScore = function(points: number = 1) {
  this.snapScore += points;
};

// Method to update streak
userSchema.methods.updateStreak = function(friendId: string) {
  const streak = this.streaks.find((s: any) => s.friendId === friendId);
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  if (streak) {
    // Check if streak should continue
    if (streak.lastUpdate >= oneDayAgo) {
      streak.count += 1;
      streak.lastUpdate = now;
    } else {
      // Reset streak if more than 24 hours
      streak.count = 1;
      streak.lastUpdate = now;
    }
  } else {
    // Create new streak
    this.streaks.push({
      friendId,
      count: 1,
      lastUpdate: now
    });
  }
};

export default mongoose.model<IUserDocument>('User', userSchema);