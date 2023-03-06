const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');

const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const {readdirSync} = require('fs');
const rateLimit = require('express-rate-limit');


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cors());
app.use(xss());
app.use(morgan('dev'))


const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100
});
app.use(limiter);

		
		
// Router
readdirSync('./src/routes').map(r => app.use('/api/v1', require(`./src/routes/${r}`)));

app.use((err, req, res, nex)=>{
	res.status(err.status ? err.status : 500).json({
		error: err.message ? err.message : 'Something went worng'
	})
})

const port = process.env.PORT || 8000;
// DB Connection
mongoose
	.connect(process.env.DATABASE)
	.then(()=> {
		console.log('DB Connected')
		// Server Listen
		app.listen(port, ()=>{
			console.log(`Server run success on port ${port}`);
		})
	})
	.catch((err) => console.log(err));
