const router = require('express').Router();
const {AuthVerifyMiddleware} = require("../middleware/AuthVerifyMiddleware");
const {postBrand, getBrand, getBrandByID, patchBrand, deleteBrand} = require("../controllers/brandController");


router.post('/brands', AuthVerifyMiddleware, postBrand);
router.get('/brands', getBrand);
router.get('/brands/:brandID', AuthVerifyMiddleware, getBrandByID);
router.patch('/brands/:brandID', AuthVerifyMiddleware, patchBrand);
router.delete('/brands/:brandID', AuthVerifyMiddleware, deleteBrand);


module.exports = router;