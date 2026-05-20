const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    composition: {
        type: [String],
        default: []
    },
    indications: {
        type: [String],
        default: []
    },
    dosage: {
        type: [String],
        default: []
    },
    storage: {
        type: [String],
        default: []
    },
    keyBenefits: {
        type: [String],
        default: []
    },
    howToUse: {
        type: [String],
        default: []
    },
    whoCanUse: {
        type: [String],
        default: []
    },
    slug: {
        type: String,
        unique: true
    },

    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create product slug from the name
productSchema.pre('save', async function() {
    const hasSpace = this.slug && (this.slug.includes(' ') || this.slug.includes('%20'));
    if (this.isModified('name') || !this.slug || hasSpace) {
        let baseSlug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special chars except space and hyphen
            .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphen
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            
        // Check for uniqueness
        let slugExists = await mongoose.models.Product.findOne({ slug: baseSlug, _id: { $ne: this._id } });
        if (slugExists) {
            baseSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        
        this.slug = baseSlug;
    }
});

module.exports = mongoose.model('Product', productSchema);
