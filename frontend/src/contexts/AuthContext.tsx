import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  registerUser,
  loginUser,
  logoutUser,
  onAuthStateChange,
  getUserProfile,
  UserProfile,
  getIdToken
} from '../services/firebaseAuthService';

interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean; // Alias for compatibility
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  getToken: () => Promise<string | null>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: UserProfile; firebaseUser: User } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  loading: true, // Alias for compatibility
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        firebaseUser: action.payload.firebaseUser,
        isAuthenticated: true,
        isLoading: false,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        firebaseUser: null,
        isAuthenticated: false,
        isLoading: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        firebaseUser: null,
        isAuthenticated: false,
        isLoading: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            dispatch({ 
              type: 'AUTH_SUCCESS', 
              payload: { user: userProfile, firebaseUser } 
            });
          } else {
            // User exists in Firebase Auth but not in Firestore
            dispatch({ type: 'AUTH_FAILURE', payload: 'User profile not found' });
          }
        } catch (error: any) {
          dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const firebaseUser = await loginUser(email, password);
      const userProfile = await getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: userProfile, firebaseUser } 
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const userProfile = await registerUser(
        userData.email,
        userData.password,
        userData.displayName,
        userData.username
      );
      
      // The auth state change will be handled by the listener
      // But we can also get the current user immediately
      const firebaseUser = await loginUser(userData.email, userData.password);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: userProfile, firebaseUser } 
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getToken = async (): Promise<string | null> => {
    return await getIdToken();
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};