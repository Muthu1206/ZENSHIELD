/**
 * API Service Layer for Frontend
 * Handles all communication with backend
 * Location: src/services/api.ts
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  userExists?: boolean;
  attemptsRemaining?: number;
}

interface UserData {
  id: string;
  phoneNumber: string;
  name: string | null;
  email?: string;
}

class APIClient {
  private baseURL: string = API_BASE_URL;
  private accessToken: string | null = null;

  /**
   * Set access token from storage
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Get default headers with auth token
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Handle API responses
   */
  private async handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/send-otp`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ phoneNumber }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
        errorCode: 'SEND_OTP_FAILED',
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify-otp`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await this.handleResponse(response);

      // Store tokens if successful
      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
        sessionStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          sessionStorage.setItem('refreshToken', data.refreshToken);
        }
      }

      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
        errorCode: 'VERIFY_OTP_FAILED',
      };
    }
  }

  /**
   * Complete user registration
   */
  async completeRegistration(name: string, email?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/complete-registration`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name, email }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Complete registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete registration',
        errorCode: 'REGISTRATION_FAILED',
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken }),
      });

      const data = await this.handleResponse(response);

      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
        sessionStorage.setItem('accessToken', data.accessToken);
      }

      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh token',
        errorCode: 'REFRESH_FAILED',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);

      // Clear tokens
      this.setAccessToken(null);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');

      return data;
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to logout',
        errorCode: 'LOGOUT_FAILED',
      };
    }
  }

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<{ success: boolean; user?: UserData; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/users/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile',
      };
    }
  }
}

export const apiClient = new APIClient();

// Initialize with stored token on page load
const storedToken = sessionStorage.getItem('accessToken');
if (storedToken) {
  apiClient.setAccessToken(storedToken);
}