import apiClient from '../apiClient';

// Auth Types
export interface User {
  id: number;
  username: string;
  nickname: string;
  loginType?: number;
  isNewUser?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Service Interface Definition
export interface AuthService {
  login(username: string, password: string): Promise<AuthResponse>;
  register(username: string, password: string, nickname?: string): Promise<AuthResponse>;
  logout(token?: string): Promise<boolean>;
  validateToken(token: string): Promise<boolean>;
  getCurrentUser(): User | null;

  getUserInfo(): Promise<User | null>;
  getSocialAuthorizeUrl(socialType: number, userType: number, redirectUri: string): Promise<string | null>;
  socialLogin(socialType: number, userType: number, code: string, state: string): Promise<AuthResponse>;
  bindSocialAccount(userId: number, socialType: number, userType: number, code: string, state: string): Promise<boolean>;
}

export const authService: AuthService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    const response = await apiClient.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.data && response.data.data) {
      const userInfo = response.data.data;
      
      // Store auth data
      localStorage.setItem('acot-token', userInfo.token);
      localStorage.setItem('acot-user', JSON.stringify({
        id: userInfo.userId,
        username: userInfo.username,
        nickname: userInfo.nickname,
        loginType: userInfo.loginType
      }));
      
      return {
        token: userInfo.token,
        user: {
          id: userInfo.userId,
          username: userInfo.username,
          nickname: userInfo.nickname,
          loginType: userInfo.loginType
        }
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  },
  
  register: async (username: string, password: string, nickname?: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    if (nickname) {
      params.append('nickname', nickname);
    }
    
    const response = await apiClient.post('/auth/register', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.data && response.data.data) {
      const userInfo = response.data.data;
      
      localStorage.setItem('acot-token', userInfo.token);
      localStorage.setItem('acot-user', JSON.stringify({
        id: userInfo.userId,
        username: userInfo.username,
        nickname: userInfo.nickname,
        loginType: userInfo.loginType
      }));
      
      return {
        token: userInfo.token,
        user: {
          id: userInfo.userId,
          username: userInfo.username,
          nickname: userInfo.nickname,
          loginType: userInfo.loginType
        }
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  },
  
  logout: async (token?: string): Promise<boolean> => {
    // Use token from parameter or get from localStorage
    const tokenToUse = token || localStorage.getItem('acot-token');
    
    if (!tokenToUse) {
      // If no token, just clear storage
      localStorage.removeItem('acot-token');
      localStorage.removeItem('acot-user');
      return true;
    }
    
    const params = new URLSearchParams();
    params.append('token', tokenToUse);
    
    try {
      const response = await apiClient.post('/auth/logout', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Clear local storage if token matches the current one
      const currentToken = localStorage.getItem('acot-token');
      if (currentToken === tokenToUse) {
        localStorage.removeItem('acot-token');
        localStorage.removeItem('acot-user');
      }
      
      return response.data && response.data.data === true;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('acot-token');
      localStorage.removeItem('acot-user');
      throw error;
    }
  },
  
  validateToken: async (token: string): Promise<boolean> => {
    const params = new URLSearchParams();
    params.append('token', token);
    
    const response = await apiClient.get(`/auth/validate?${params.toString()}`);
    return response.data && response.data.data === true;
  },
  
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('acot-user');
    const token = localStorage.getItem('acot-token');
    
    if (!userJson || !token) {
      return null;
    }
    
    try {
      const user: User = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('acot-token');
      localStorage.removeItem('acot-user');
      return null;
    }
  },

  getUserInfo: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get(`/auth/user-information`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  },
  
  getSocialAuthorizeUrl: async (socialType: number, userType: number, redirectUri: string): Promise<string | null> => {
    const params = new URLSearchParams();
    params.append('type', socialType.toString());
    params.append('user_type', userType.toString());
    params.append('redirect_uri', redirectUri);
    
    try {
      const response = await apiClient.get(`/auth/social/authorize?${params.toString()}`);
      if (response.data && response.data.data) {
        return response.data.data.authorizeUrl;
      }
      return null;
    } catch (error) {
      console.error('Error getting social authorize URL:', error);
      return null;
    }
  },
  
  socialLogin: async (socialType: number, userType: number, code: string, state: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('type', socialType.toString());
    params.append('user_type', userType.toString());
    params.append('code', code);
    params.append('state', state);
    
    const response = await apiClient.get(`/auth/social/callback?${params.toString()}`);
    
    if (response.data && response.data.data) {
      const userInfo = response.data.data;
      
      localStorage.setItem('acot-token', userInfo.token);
      localStorage.setItem('acot-user', JSON.stringify({
        id: userInfo.userId,
        username: userInfo.username,
        nickname: userInfo.nickname,
        loginType: userInfo.loginType,
        isNewUser: userInfo.isNewUser
      }));
      
      return {
        token: userInfo.token,
        user: {
          id: userInfo.userId,
          username: userInfo.username,
          nickname: userInfo.nickname,
          loginType: userInfo.loginType,
          isNewUser: userInfo.isNewUser
        }
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  },
  
  bindSocialAccount: async (userId: number, socialType: number, userType: number, code: string, state: string): Promise<boolean> => {
    const params = new URLSearchParams();
    params.append('userId', userId.toString());
    params.append('type', socialType.toString());
    params.append('user_type', userType.toString());
    params.append('code', code);
    params.append('state', state);
    
    try {
      const response = await apiClient.post('/auth/social/bind', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data && response.data.data === true;
    } catch (error) {
      console.error('Error binding social account:', error);
      return false;
    }
  }
};
