import express from 'express';
import authController from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

// Regular auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google auth routes
router.post('/google-signup', authController.googleSignup);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', authController.googleCallback);

// OTP routes
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

export default router;
