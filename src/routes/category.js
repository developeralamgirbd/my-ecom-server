const router = require('express').Router();

const {deleteCategory, postCategory, deleteSubChildCategory,
    postSubCategory, postSubCategoryChild, getCategories, getCategoryByID, patchCategory
} = require('../controllers/categoryController');
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");


router.post('/categories', AuthVerifyMiddleware, postCategory);
router.get('/categories', getCategories);
router.get('/categories/:categoryID', AuthVerifyMiddleware, getCategoryByID);
router.patch('/categories/:categoryID', AuthVerifyMiddleware, patchCategory);
router.delete('/categories/:categoryID', AuthVerifyMiddleware, deleteCategory);

// Sub Category Route
router.post('/sub-categories', AuthVerifyMiddleware, postSubCategory);
router.post('/sub-categories-children', AuthVerifyMiddleware, postSubCategoryChild);
router.patch('/sub-categories-children', AuthVerifyMiddleware, deleteSubChildCategory);

module.exports = router;