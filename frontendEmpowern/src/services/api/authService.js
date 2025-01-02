import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
  async signup(userData) {
    try {
      // Log the data being sent for debugging
      console.log('Sending signup data:', userData);

      const response = await axios.post(`${API_URL}/signup`, {
        name: userData.fullName,         // Match backend expected field
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        userType: userData.userType      // Make sure this is either 'worker' or 'contractor'
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data);
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  async googleSignup(data) {
    try {
      const response = await axios.post(`${API_URL}/google-signup`, data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Google signup error:', error.response?.data);
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  async sendOtp(phone) {
    try {
      const response = await axios.post(`${API_URL}/send-otp`, { phone });
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error.response?.data);
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },

  async verifyOtp(phone, otp) {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error.response?.data);
      throw error.response?.data || { message: 'Failed to verify OTP' };
    }
  },

  async googleLogin(token) {
    try {
      const response = await axios.post(`${API_URL}/google-login`, { token });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Google login error:', error.response?.data);
      throw error.response?.data || { message: 'Google login failed' };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
