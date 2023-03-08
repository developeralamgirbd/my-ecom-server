const router = require('express').Router();

const {deleteCategory, postCategory, deleteSubChildCategory,
    postSubCategory, postSubCategoryChild, getCategories, getCategoryByID, patchCategory, patchSubCategory
} = require('../controllers/categoryController');
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");


router.post('/categories', AuthVerifyMiddleware, postCategory);
router.get('/categories', getCategories);
router.get('/categories/:id/:childName', AuthVerifyMiddleware, getCategoryByID);
router.patch('/categories/:id', AuthVerifyMiddleware, patchCategory);
router.delete('/categories/:id', AuthVerifyMiddleware, deleteCategory);

// Sub Category Route
router.post('/sub-categories', AuthVerifyMiddleware, postSubCategory);
router.put('/sub-categories-children', AuthVerifyMiddleware, postSubCategoryChild);
router.patch('/sub-categories/:id', AuthVerifyMiddleware, patchSubCategory);
router.delete('/sub-categories-children', AuthVerifyMiddleware, deleteSubChildCategory);

module.exports = router;