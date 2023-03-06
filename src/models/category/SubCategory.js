const {Schema, model} = require('mongoose');
const slugify = require("slugify");

const subCategorySchema = new Schema({

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
    parentID: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    children: [{
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        lowercase: true,
        unique: [true, 'Category already exit']
    }],
    authorID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {versionKey: false, timestamps: true});

subCategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
})

const SubCategory = model('SubCategory', subCategorySchema);

module.exports = SubCategory;
