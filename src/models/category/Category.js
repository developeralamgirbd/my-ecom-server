const {Schema, model} = require('mongoose');
const slugify = require("slugify");

const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        lowercase: true,
        unique: [true, 'Category already exit']
    },
    slug: {
        type: String
    },
    authorID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {versionKey: false, timestamps: true});

categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
})

const Category = model('Category', categorySchema);

module.exports = Category;
