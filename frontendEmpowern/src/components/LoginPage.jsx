import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { axiosInstance } from '../services/api/axiosInstance';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('phone'); // 'phone' or 'email'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    otp: ''
  });
  const [step, setStep] = useState('initial'); // 'initial', 'otp', 'success'
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      
      const response = await axiosInstance.post('/api/auth/google-signup', {
        token,
        userType: 'worker' // You might want to add a way to select user type for Google login
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        navigate(response.data.data.userType === 'worker' ? '/' : '/');
      }
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/send-otp', { phone: formData.phone });
      if (response.data.success) {
        setStep('otp');
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/verify-otp', {
        phone: formData.phone,
        otp: formData.otp
      });
      localStorage.setItem('token', response.data.token);
      setStep('success');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', response.data.token);
      navigate(response.data.data.userType === 'worker' ? '/' : '/');
    } catch (error) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Login to access your account</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <img src="../assests/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
              Continue with Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Login Tabs */}
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'phone' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('phone')}
            >
              Phone
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('email')}
            >
              Email
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'phone' ? (
            <div className="space-y-4">
              {step === 'initial' && (
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={isLoading || !formData.phone}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              )}

              {step === 'otp' && (
                <div>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleOtpVerification}
                    disabled={isLoading || !formData.otp}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleEmailLogin}
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link to="/signup" className="ml-1 text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;