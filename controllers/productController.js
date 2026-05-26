const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ order: 1, name: 1 });
        
        // Auto-fix missing or messy slugs (e.g. those with spaces)
        const fixSlugs = products.map(async (p) => {
            const hasSpace = p.slug && (p.slug.includes(' ') || p.slug.includes('%20'));
            if (!p.slug || hasSpace) {
                try {
                    await p.save();
                } catch (err) {
                    console.error('Auto-slug fix failed:', err.message);
                }
            }
        });
        await Promise.all(fixSlugs);

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        let product;
        // Check if ID is a valid MongoDB ObjectId
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.id);
        }
        
        // If no product found by ID or not a valid ID, try finding by slug (normalized)
        if (!product) {
            let decodedId = req.params.id;
            try {
                decodedId = decodeURIComponent(req.params.id);
            } catch (e) {}

            const searchSlug = decodedId
                .toLowerCase()
                .replace(/[\s_]+/g, '-')          // Replace spaces and underscores with hyphens
                .replace(/[^\w-]/g, '')           // Remove everything else except word characters and hyphens
                .replace(/-+/g, '-')              // Collapse multiple hyphens into a single hyphen
                .replace(/^-+|-+$/g, '');         // Trim leading/trailing hyphens

            product = await Product.findOne({ slug: searchSlug });
        }

        // If product found by ID but has no slug or messy slug, fix it
        const hasSpace = product && product.slug && (product.slug.includes(' ') || product.slug.includes('%20'));
        if (product && (!product.slug || hasSpace)) {
            try {
                await product.save();
            } catch (err) {
                console.error('Single product auto-slug fix failed:', err.message);
            }
        }

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });

        await product.save();
        
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
