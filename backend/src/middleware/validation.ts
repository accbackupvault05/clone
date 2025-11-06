import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '@/middleware/errorHandler';

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 20 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
  displayName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Display name is required',
      'string.max': 'Display name must not exceed 50 characters',
      'any.required': 'Display name is required'
    }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  dateOfBirth: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Date of birth cannot be in the future'
    })
});

const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      'any.required': 'Email or username is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
});

const updateProfileSchema = Joi.object({
  displayName: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Display name cannot be empty',
      'string.max': 'Display name must not exceed 50 characters'
    }),
  bio: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Bio must not exceed 200 characters'
    }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  dateOfBirth: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Date of birth cannot be in the future'
    })
});

const sendMessageSchema = Joi.object({
  recipientId: Joi.string()
    .required()
    .messages({
      'any.required': 'Recipient ID is required'
    }),
  type: Joi.string()
    .valid('text', 'image', 'video', 'audio', 'location')
    .required()
    .messages({
      'any.only': 'Message type must be one of: text, image, video, audio, location',
      'any.required': 'Message type is required'
    }),
  text: Joi.string()
    .when('type', {
      is: 'text',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'Text is required for text messages'
    }),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).when('type', {
    is: 'location',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const sendSnapSchema = Joi.object({
  recipientIds: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one recipient is required',
      'any.required': 'Recipients are required'
    }),
  type: Joi.string()
    .valid('image', 'video')
    .required()
    .messages({
      'any.only': 'Snap type must be either image or video',
      'any.required': 'Snap type is required'
    }),
  caption: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Caption must not exceed 100 characters'
    }),
  viewDuration: Joi.number()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.min': 'View duration must be at least 1 second',
      'number.max': 'View duration must not exceed 10 seconds',
      'any.required': 'View duration is required'
    })
});

const createStorySchema = Joi.object({
  type: Joi.string()
    .valid('image', 'video')
    .required()
    .messages({
      'any.only': 'Story type must be either image or video',
      'any.required': 'Story type is required'
    }),
  caption: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Caption must not exceed 100 characters'
    }),
  visibility: Joi.string()
    .valid('public', 'friends', 'custom')
    .default('friends')
    .messages({
      'any.only': 'Visibility must be one of: public, friends, custom'
    }),
  customViewers: Joi.array()
    .items(Joi.string())
    .when('visibility', {
      is: 'custom',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'Custom viewers are required when visibility is set to custom'
    })
});

// Validation middleware factory
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw new AppError(errorMessage, 400);
    }
    
    next();
  };
};

// Export validation middleware
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateSendMessage = validate(sendMessageSchema);
export const validateSendSnap = validate(sendSnapSchema);
export const validateCreateStory = validate(createStorySchema);

// Query validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = paginationSchema.validate(req.query);
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    throw new AppError(errorMessage, 400);
  }
  
  req.query = value;
  next();
};