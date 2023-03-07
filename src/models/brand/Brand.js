const {Schema, model} = require('mongoose');
const slugify = require("slugify");

const brandSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
        lowercase: true,
        unique: [true, 'Brand already exit']
    },
    slug: {
        type: String
    },
    authorID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    logo: {
        type: String
    }

}, {versionKey: false, timestamps: true});

brandSchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
})

const Brand = model('Brand', brandSchema);

module.exports = Brand;
