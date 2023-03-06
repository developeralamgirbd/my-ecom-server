const router = require('express').Router();

const {create, showCategory,getSingleCategory, updateCategory, deleteCategory, postCategory} = require('../controllers/categoryController');
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");
const {postSubCategory, postSubCategoryChild} = require("../controllers/subCategoryController");


router.post('/categories', AuthVerifyMiddleware, postCategory);
router.get('/categories', showCategory);
router.get('/categories/:categoryID', AuthVerifyMiddleware, getSingleCategory);
router.patch('/categories/:categoryID', AuthVerifyMiddleware, updateCategory);
router.delete('/categories/:categoryID', AuthVerifyMiddleware, deleteCategory);

router.post('/sub-categories', AuthVerifyMiddleware, postSubCategory);
router.post('/sub-categories-children', AuthVerifyMiddleware, postSubCategoryChild);

module.exports = router;