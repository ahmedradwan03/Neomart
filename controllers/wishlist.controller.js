const User = require('../modules/user.model');
const catchAsync = require('../utils/catchAsync');
const Product = require('./../modules/product.model');

// get user wishlist
exports.getUserWishlist = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ success: true, results: user.wishlist.length, data: user.wishlist });
});

// add to wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found!', { cause: 404 }));
    const productIsExit = await User.findOne({
        _id: req.user._id,
        wishlist: productId,
    });
    if (productIsExit) return next(new Error('Product is already in your wishlist.', { cause: 404 }));
    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: productId } }, { new: true }).populate('wishlist');
    res.status(200).json({ success: true, message: 'Product Add to Wishlist', userWishlist: user.wishlist });
});

// remove from wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found!', { cause: 404 }));
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: productId } }, { new: true }).populate('wishlist');
    res.status(200).json({ success: true, message: 'Product Remove form Wishlist', userWishlist: user.wishlist });
});
