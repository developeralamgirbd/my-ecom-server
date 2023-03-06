const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.status(200).send('Welcome to MY ECOM');
})
router.get('/health', (req, res)=>{
    res.status(200).json({
        connection: 'OK'
    });
})

module.exports = router;