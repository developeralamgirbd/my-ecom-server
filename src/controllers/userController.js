const validator = require("validator");
const {createToken, comparePassword, hashPassword} = require('../helper/auth');
const OtpModel = require('../models/user/Otp');
const UserModel = require('../models/user/User');
const mongoose = require('mongoose');

const {
	registerService,
	userDetailsService,
	userFindByEmailService,
	userProfileUpdateService,
	passwordUpdateService }  = require('../services/userService/userService');
const sendEmail = require("../helper/sendEmail");

exports.register = async (req, res)=>{
	try{
		const email = req.body.email;

		const isUserExit = await userFindByEmailService(email);

		if (isUserExit[0]){
			return res.status(400).json({
				status: 'fail',
				error: 'Email already taken'
			})
		}

		const OtpCode = Math.floor(100000 + Math.random() * 900000);

		const isExitEmail = await OtpModel.findOne({email})

		if (isExitEmail){
			await OtpModel.updateOne({email}, {$set: {otp: OtpCode, status: 0}});
		}else {
			await OtpModel.create({email, otp: OtpCode})
		}
		// Email Send
		const SendEmail = await sendEmail(email,"Your Verification Code is= "+ OtpCode,"Blog site email verification")

		if (SendEmail[0].statusCode === 202){
			const user = await registerService(req.body);
			await user.save({ validateBeforeSave: false });

			user.password = undefined;
			res.status(200).json({
				status: 'success',
				message: 'OTP send successfully, please check your email',
			})
		}else {
			res.status(500).json({
				status: 'fail',
				error: 'Server error occurred'
			})
		}


		
	}catch(error){
		console.log(error)
		res.status(500).json({
			status: 'fail',
			error: 'Server error occurred'
		})
	}
};

exports.verifyOTP=async (req,res)=>{
	let email = req.params.email;
	let OTPCode = req.params.otp;

	let status=0;
	let statusUpdate=1;

	// Create a new session
/*	const session = await mongoose.startSession();
	await session.startTransaction();*/

	try {

		// Without transaction

		let OTPCount = await OtpModel.aggregate([
			{$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}
		])

		if (OTPCount.length > 0) {

			let OTPUpdate = await OtpModel.updateOne({email, otp: OTPCode, status: status}, {
				email: email,
				otp: OTPCode,
				status: statusUpdate
			})


			await UserModel.updateOne({email}, {verified: true} );

		} else {
			res.status(400).json({
				status: "fail",
				error: "Invalid OTP Code"
			})
		}
		res.status(200).json({
			message: "OTP verify successfully",
		})

		// With Transaction
		/*const options = { session };
        const otp = await OtpModel.findOne({email, otp: OTPCode, status: status }, null, options);

		if (!otp){
			return res.status(400).json({
				error: "Invalid OTP",
			})
		}

        otp.status = statusUpdate;

        await otp.save(options);

        const user = await UserModel.findOne({email}, {verified: 1, _id: 1}, options);
        user.verified = true;
        await user.save(options);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "OTP verify successfully",
        })*/

	}
	catch (err) {
	/*	await session.abortTransaction();
		session.endSession();
		console.error('Transaction aborted:', err);*/

		res.status(500).json({
			status: "fail",
			error: 'Server error occurred'
		})
	}
}

exports.sendOTP = async (req, res) => {

	try {
		const email = req.params.email;

		const user = await userFindByEmailService(email);

		if (!user[0]){
			return res.status(400).json({
				status: "fail",
				error: 'User not found'
			})
		}

		const OtpCode = Math.floor(100000 + Math.random() * 900000);

		const isExitEmail = await OtpModel.findOne({email})

		if (isExitEmail){
			await OtpModel.updateOne({email}, {$set: {otp: OtpCode, status: 0}});
		}else {
			await OtpModel.create({email, otp: OtpCode})
		}
		// Email Send
		const SendEmail = await sendEmail(email,"Your Verification Code is= "+ OtpCode,"Blog site email verification")
		if (SendEmail[0].statusCode !== 202){
			return res.status(500).json({
				status: "fail",
				error: 'Server error occurred'
			})
		}

		res.status(200).json({
			status: "success",
			message: 'OTP send successfully, please check your email',
			otp: OtpCode
		})

	}catch (e) {

		res.status(500).json({
			status: "fail",
			error: 'Server error occurred'
		})
	}
}

exports.login = async (req, res) => {
	try {
		const {email, password}  = req.body;

		console.log(email)
		console.log(password)

		const user = await userFindByEmailService(email);



		if (!user[0]){
			return res.status(400).json({
				status: 'fail',
				error: 'Email or password do not match'
			})
		}

		const isPasswordValid = comparePassword(password, user[0].password);

		if(!isPasswordValid){
			return res.status(400).json({
				status: 'fail',
				error: 'Email or password do not match'
			})
		}

		if (!user[0].verified){
			return res.status(400).json({
				status: 'fail',
				error: 'Your account is not verify. please verify your account'
			})
		}

		if(user[0].status !== 'active'){
			return res.status(400).json({
				status: 'fail',
				error: 'Your account is not active. please contact Administrator'
			})
		}



		const token = createToken(user[0]);
		user[0].password = undefined;

		res.cookie('token', token, {
			httpOnly: true,
			// secure: true // only works https
		})

		res.status(200).json({
			status: 'success',
			message: "successfully logged in",
			data: {
				user: user[0],
				token
			}
		})
	}catch (error) {
		console.log(error);
		res.status(500).json({
			status: "fail",
			error: error.message,
		});
	}
};

exports.profile = async (req, res)=>{
	try {
		const User = await userDetailsService(req.auth?.email);

		if (!User[0]){
			return res.status(401).json({
				status: 'fail',
				error: 'User not found'
			});
		}

		res.status(200).json({
			status: 'success',
			data: User[0]
		})

	}catch (error) {
		console.log(error)
		res.status(401).json({
			status: 'fail',
			error: error.message
		})
	}
};

exports.profileUpdate = async (req, res)=>{
	try {

		const {firstName, lastName} = req.body;

		const User = await userProfileUpdateService(req.auth?._id, firstName, lastName);

		if (!User){
			return res.status(400).json({
				status: 'fail',
				error: 'Profile not updated'
			})
		}

		res.status(200).json({
			message: 'Profile successfully updated',
			data: User
		})
	}catch (error) {
		console.log(error)
		res.status(400).json({
			status: 'fail',
			error: error.message
		});
	}
}

exports.passwordUpdate = async (req, res)=>{
	try {
		const {oldPassword, password, confirmPassword} = req.body;

		if(oldPassword === ''){
			return res.status(400).json({
				status: 'fail',
				error: "Old password is required"
			});
		}

		const user = await userFindByEmailService(req.auth?.email);

		const userHashPassword =  user[0] ? user[0].password : '';

		const isPasswordValid = comparePassword(oldPassword, userHashPassword);

		if (!isPasswordValid){
			return res.status(400).json({
				status: 'fail',
				error: "Old password doesn't match"
			});
		}

		const isValidate = validator.isStrongPassword(password, {
			minLength: 8,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			minLowercase: 1
		})
		if (!isValidate){
			return res.status(400).json({
				status: 'fail',
				error: "Password is not strong, please provide a strong password"
			});
		}
		if (password !== confirmPassword){
			return res.status(400).json({
				status: 'fail',
				error: "Password doesn't match"
			});
		}

		const hash = hashPassword(password);

		await passwordUpdateService(req.auth?.email, hash);

		res.status(200).json({
			status: 'success',
			message: 'Password changed successfully'
		});

	}catch (error) {
		console.log(error)
		res.status(500).json({
			status: 'fail',
			error: 'Server error occurred'
		});
	}
}


exports.resetPassword= async (req,res)=>{

	let email = req.params.email;
	let OTPCode = req.params.otp;
	let {password, confirmPassword} =  req.body;
	let statusUpdate = 1;

	try {
		const otp = await OtpModel.aggregate([
			{$match: {email: email, otp: OTPCode, status: statusUpdate}}
		])

		if (otp[0]?.status !== 1){
			return res.status(400).json({
				status: 'fail',
				error: 'Invalid request'
			})
		}

		const user = await userFindByEmailService(email);

		if(!user[0]){
			return res.status(400).json({
				status: 'fail',
				error: 'Invalid request'
			});
		}

		if(password === ''){
			return res.status(400).json({
				status: 'fail',
				error: "password is required"
			});
		}
		if(confirmPassword === ''){
			return res.status(400).json({
				status: 'fail',
				error: "confirmPassword is required"
			});
		}

		const validate = validator.isStrongPassword(password, {
			minLength: 8,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			minLowercase: 1
		})

		if (!validate){
			return res.status(400).json({
				status: 'fail',
				error: "Password is not strong, please provide a strong password"
			});
		}

		if (password !== confirmPassword){
			return res.status(400).json({
				status: 'fail',
				error: "Password doesn't match"
			});
		}

		const hash = hashPassword(password);

		 const update = await passwordUpdateService(email, hash);

		await OtpModel.updateOne({email: email, otp: OTPCode, status: 1}, {
			otp: '',
		})

		res.status(200).json({
			status: "success",
			message: 'Password Reset successfully',
			data: update
		})
	}
	catch (err) {
		console.log(err)
		res.status(500).json({
			status: 'fail',
			error: 'Server error occurred'
		});
	}
}




