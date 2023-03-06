const {Schema, model} = require('mongoose');
const slugify = require("slugify");

const productSchema = new Schema({
    name: {
            type: String,
            required: [true, 'Product Name is required'],
            unique: [true, 'Product is already exit'],
            trim: true,
            lowercase: true,
            minLength: [3, 'Product Name must be at least 3 character'],
            maxLength: [100, 'Product Name is too large']
        },
    slug: {
      type: String
    },

    description: {
            type: String,
            required: [true, 'Description is required']
        },

    price: {
            type: Number,
            required: [true, 'Price is required']
        },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    sold: {
        type: Number,
        default: 0,
    },
    userID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    categoryID: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }

}, {versionKey: false, timestamps: true});

productSchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
})


const Product = model('Product', productSchema);

module.exports = Product;

