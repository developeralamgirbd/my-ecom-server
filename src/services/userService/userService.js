const User = require('../../models/user/User');
const Address = require('../../models/user/Address');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.registerService = async(userData)=>{

	const user = new User(userData);
	await user.save();
	return user;
};

exports.userDetailsService = async (email)=>{
	return await User.aggregate(  [
		{$match: {email } },
		{$project: {password: 0, confirmationToken: 0, confirmationTokenExpire:0, passwordChangedAt: 0, passwordResetToken: 0, passwordResetExpires: 0}}
	] );
};

exports.userFindByEmailService = async (email)=>{
	return User.aggregate(  [
		{$match: {email } }
	] );
};

exports.passwordUpdateService = async (email, hashPassword)=>{
	const user = await User.updateOne(
		{email: email},
		{$set: {
				password: hashPassword,
				passwordChangedAt: new Date()
			}}
	);
	return user;
}

exports.userProfileUpdateService = async (_id, firstName, lastName)=>{
	 return User.updateOne({_id: ObjectId(_id)}, {$set: {
			 firstName,
			 lastName,
		 }}, {runValidators: true});
}

exports.userAddressService = async (userID)=>{
	return Address.aggregate([
		{$match: {userID: ObjectId(userID)}}
	])
}




