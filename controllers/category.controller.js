const Category = require('./../modules/category.model');
const catchAsync = require('./../utils/catchAsync');
const slugify = require('slugify');
const cloudinary = require('./../utils/cloud');

// get all category
exports.allCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.find().populate([
        { path: 'createdBy', select: 'email name' },
        { path: 'brands', select: 'name' },
        { path: 'subcategory', select: 'name' },
    ]);
    if (!categories.length) return next(new Error('Categories not found!', { cause: 404 }));
    res.status(200).json({ success: true, results: categories.length, data: categories });
});

// create category
exports.createCategory = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new Error('category image is required !', { cause: 400 }));
    const category = await Category.findOne({ name: req.body.name });
    if (category) return next(new Error('category name already exist !', { cause: 409 }));
    // Cloudinary upload file
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.SITE_NAME}/category`,
        // width: 500,
        // height: 500,
        // crop: "fill",
    });
    const newCategory = await Category.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
    });
    res.status(201).json({ success: true, newCategory });
});

// update category
exports.updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new Error('category not found!', { cause: 404 }));
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            public_id: category.image.id,
        });
        category.image = { id: public_id, url: secure_url };
    }
    if (req.body.name) {
        category.name = req.body.name;
        category.slug = slugify(req.body.name);
    }
    await category.save();
    res.status(200).json({ success: true, category });
});

// delete category
exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new Error('category not found!', { cause: 404 }));
    await category.deleteOne();
    await cloudinary.uploader.destroy(category.image.id);
    res.status(200).json({ success: true, message: 'category deleted' });
});
