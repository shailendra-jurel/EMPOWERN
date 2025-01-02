import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { twilioClient, twilioConfig } from '../config/twilio.js';

// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0]?.value || '',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Token generation utility
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// Signup handler
const signup = async (req, res) => {
  const { name, email, password, userType, phone } = req.body;

  try {
    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!['worker', 'contractor'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be either worker or contractor',
      });
    }

    const userExists = await User.findOne({
      email,
      userType
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: `User already exists with this email as a ${userType}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
      phone,
      profileStatus: 'incomplete',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        token,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
    });
  }
};

// Login handler
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    });
  }
};

// Google OAuth callback handler
const googleCallback = (req, res) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Authentication failed' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token,
    });
  })(req, res);
};

// Middleware to authenticate user using JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Google signup handler
const googleSignup = async (req, res) => {
  try {
    const { token, userType } = req.body;

    if (!token || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Token and user type are required'
      });
    }

    // Decode the token
    const decodedToken = jwt.decode(token);
    
    // Check if user exists
    //  I have update to sigup differently for worker and contractor
    let user = await User.findOne({ email: decodedToken.email, userType });

    if (user) {
      // If user exists, return their info with a new token
      const authToken = generateToken(user._id);
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          token: authToken
        }
      });
    }

    // Create new user if they don't exist
    user = await User.create({
      name: decodedToken.name,
      email: decodedToken.email,
      userType,
      googleId: decodedToken.sub,
      profilePicture: decodedToken.picture,
      profileStatus: 'incomplete'
    });

    const authToken = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        token: authToken
      }
    });

  } catch (error) {
    console.error('Google signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process Google signup'
    });
  }
};

const sendOtp = async (req, res) => {
  if (!twilioClient) {
    return res.status(503).json({
      success: false,
      message: 'SMS service is currently unavailable'
    });
  }

  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    const verification = await twilioClient.verify.v2
      .services(twilioConfig.verifyServiceSid)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms'
      });

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

const verifyOtp = async (req, res) => {
  if (!twilioClient) {
    return res.status(503).json({
      success: false,
      message: 'SMS service is currently unavailable'
    });
  }

  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    const verification = await twilioClient.verify.v2
      .services(twilioConfig.verifyServiceSid)
      .verificationChecks.create({
        to: formattedPhone,
        code: otp
      });

    if (verification.status === 'approved') {
      const token = jwt.sign({ phone: formattedPhone }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({
        success: true,
        message: 'OTP verified successfully',
        token
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP'
    });
  }
};

// Export the auth controller
export default {
  signup,
  login,
  googleSignup,
  googleCallback,
  sendOtp,
  verifyOtp,
  authenticate,
  passport,
};
