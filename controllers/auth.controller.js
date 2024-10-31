const User = require('../modules/user.model');
const Token = require('../modules/token.model');
const Cart = require('./../modules/cart.model');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const Templates = require('./../utils/htmlTemplates');

// create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// signup
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({ ...req.body });
    // create token
    const token = createToken(newUser._id);
    const url = `https://neomart.vercel.app/api/v1/auth/activateAccount/${token}`;
    // send email
    await sendEmail({
        to: req.body.email,
        subject: 'Activate Account',
        html: Templates.signUpTemp(url, req.body.name),
    });
    return res.status(201).json({ status: 'success', massage: 'check your email!' });
});

// Activate Account
exports.activateAccount = catchAsync(async (req, res, next) => {
    const userData = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
    const user = await User.findByIdAndUpdate(userData.id, { isActive: true });
    if (!user) return next(new Error('User not found', { cause: 404 }));
    // create a cart for user
    await Cart.create({ user: user._id });
    return res
        .status(200)
        .json({
            status: 'success',
            massage: 'Account activated successfully',
        })
        .redirect(`${process.env.SITE_DOMAIN}/login`);
});

// login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new Error('Please provide email and password!', { cause: 400 }));
    const user = await User.findOne({ email });
    if (!user || !bcryptjs.compareSync(password, user.password)) {
        return next(new Error('uncorrect email or password', { cause: 400 }));
    }
    // delete previous tokens for user
    await Token.deleteMany({ user: user._id });
    const token = createToken(user._id);
    await Token.create({ token, user: user._id, agent: req.headers['user-agent'] });
    res.status(200).json({ status: 'success', token, data: user });
});
// logout
exports.logout = catchAsync(async (req, res, next) => {
    if (!req.body.token) return next(new Error('Token is required for logout', { cause: 400 }));
    const tokenDB = await Token.findOne({ token: req.body.token });
    if (!tokenDB) return next(new Error('Invalid token', { cause: 400 }));
    // delete token from database
    await tokenDB.deleteOne();
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});
// forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error('invalid email!', { cause: 404 }));
    const rondomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(rondomCode).digest('hex');
    user.passwordResetToken = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
    await sendEmail({
        to: email,
        subject: 'Reset Password',
        html: Templates.resetPassTemp(rondomCode, user.name),
    });
    res.status(200).json({ status: 'Success', message: 'Reset code sent to email' });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedResetCode, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return next(new Error('invalid code, Please try again !', { cause: 400 }));
    user.password = req.body.password;
    // clear reset tokens
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    await Token.deleteMany({ user: user._id });
    res.status(200).json({ status: 'success', message: 'Login now!' });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return next(new Error('Your current user is wrong.', { cause: 401 }));
    if (!bcryptjs.compareSync(req.body.currentPassword, user.password)) return next(new Error('Your current password is wrong.', { cause: 401 }));
    user.password = req.body.password;
    await user.save();
    const token = createToken(user._id);
    // create token in database
    await Token.create({ token, user: user._id, agent: req.headers['user-agent'] });
    res.status(200).json({ status: 'success', data: token });
});
