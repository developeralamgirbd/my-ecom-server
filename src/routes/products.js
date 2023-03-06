const express = require('express');
const router = express.Router();

const {create, authShowAllPost, updatePost, showPostByCategory, showPostByStatus, authSearchPosts, deletePost, searchPosts,
    showSinglePost, authShowPostByCategory,
    showAllPost,
    postProduct,
    getProducts,
    getProductById,
    createBraintreeToken,
    checkout
} = require('../controllers/productController');
const {AuthVerifyMiddleware, isSuperAdmin} = require("../middleware/AuthVerifyMiddleware");


router.get('/posts/auth', AuthVerifyMiddleware, authShowAllPost);
router.post('/products', AuthVerifyMiddleware, isSuperAdmin, postProduct);
router.get('/posts/auth/s/:keyword', AuthVerifyMiddleware, authSearchPosts);
router.get('/posts/search/:keyword/:page', searchPosts);
router.get('/posts/auth/c/:name', AuthVerifyMiddleware, authShowPostByCategory);
router.get('/posts/category/:name/:page', showPostByCategory);

router.get('/products/:page/:perpage/list', getProducts);
router.get('/products/:id', getProductById);

router.patch('/posts/:id', AuthVerifyMiddleware, updatePost);
router.delete('/posts/:id', AuthVerifyMiddleware, deletePost)

module.exports = router;