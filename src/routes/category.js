const router = require('express').Router();

const {create, showCategory,getSingleCategory, updateCategory, deleteCategory, postCategory} = require('../controllers/categoryController');
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");


router.post('/categories', AuthVerifyMiddleware, postCategory);
router.get('/categories', showCategory);
router.get('/categories/:categoryID', AuthVerifyMiddleware, getSingleCategory);
router.patch('/categories/:categoryID', AuthVerifyMiddleware, updateCategory);
router.delete('/categories/:categoryID', AuthVerifyMiddleware, deleteCategory);

module.exports = router;