const mongoose = require("mongoose");
const Product = require("../../models/product/Product");
const { error } = require("../../utils/error");
const ObjectId = mongoose.Types.ObjectId;

exports.productCreateService = async (productBody)=>{
	const category = new Product(productBody);
	await category.save();
	return category;
}

exports.authShowAllProductService = async (authorID)=>{
	return Product.aggregate([
		{$match: { userID: ObjectId(authorID)}},

		{$lookup: {
				from: 'users',
				localField: 'userID',
				foreignField: '_id',
				as: 'user'
			}},
		{$lookup: {
				from: 'categories',
				localField: 'categoryID',
				foreignField: '_id',
				as: 'category'
			}},

		{$facet: {
				totalProduct: [
					{$group: {_id:0, count: {$sum: 1}}},
					{$project: {'_id': 0}}
				],
				posts: [
					{$addFields: {
							user: {$first: "$user"},
						}},

					{$project: {
							_id: 1,
							name: 1,
							description: 1,
							status:1,
							createDate: "$createdAt",
							updateDate: "$updatedAt",
							authorName: {$concat: ["$user.firstName", " ", '$user.lastName'] },
							categoryName: {$first: "$user.name"},
						}
					},
					{$limit: 12},
					{$sort: {createDate: -1}}
				]
			}},

	])
}

exports.listProductsService = async (page, perPage)=>{

	const data = await Product.aggregate([
		{$match: {}},
		{$lookup: {
				from: 'categories',
				localField: 'categoryID',
				foreignField: '_id',
				as: 'category'
			}},

		{$facet: {
				totalProduct: [
					{$group: {_id:0, count: {$sum: 1}}},
					{$project: {'_id': 0}}
				],
				rows: [

					{$project: {
							name: 1,
							description: 1,
							price: 1,
							quantity: 1,
							sold: 1,
							createdAt: 1,
							updatedAt: 1,
							categoryName: {$first: "$category.name"},
						}
					},


					{$skip: (page - 1) * perPage},
					{$limit: perPage},
					{$sort: {createdAt: -1}}
				]
			}},

	])

	return {total: data[0]['totalProduct'][0]['count'], rows: data[0]['rows']}
}

exports.showProductByCategoryService = async (query)=>{

	return Product.aggregate([
		{
			$match: query
		},

		{$lookup: {
				from: 'users',
				localField: 'userID',
				foreignField: '_id',
				as: 'user'
			}},
		{$lookup: {
				from: 'categories',
				localField: 'categoryID',
				foreignField: '_id',
				as: 'category'
			}},

		{$facet: {
				totalProduct: [
					{$group: {_id:0, count: {$sum: 1}}},
					{$project: {'_id': 0}}
				],
				posts: [
					{$addFields: {
							author: {$first: "$author"},
						}},

					{$project: {
							authorName: {$concat: ["$author.firstName", " ", '$author.lastName'] },
							categoryName: {$first: "$category.name"},
						}
					}
				]
			}},
	]);
}

exports.searchProductService = async (searchQuery, page, perPage)=>{

	 return Product.aggregate([
		{$match: searchQuery},

		 {$lookup: {
				 from: 'users',
				 localField: 'userID',
				 foreignField: '_id',
				 as: 'user'
			 }},
		 {$lookup: {
				 from: 'categories',
				 localField: 'categoryID',
				 foreignField: '_id',
				 as: 'user'
			 }},

		 {$facet: {
				 totalProduct: [
					 {$group: {_id:0, count: {$sum: 1}}},
					 {$project: {'_id': 0}}
				 ],
				 posts: [
					 {$addFields: {
							 user: {$first: "$user"},
						 }},

					 {$project: {
							 userName: {$concat: ["$user.firstName", " ", '$user.lastName'] },
							 categoryName: {$first: "$category.name"},
						 }
					 },
					 {$skip: (page - 1) * perPage},
					 {$limit: perPage},
					 {$sort: {createDate: -1}}
				 ]
			 }},
	]);
}

exports.getProductByIdService = async (id)=>{

	const data = await Product.aggregate([
		{$match: { _id: ObjectId(id)}},
		{$lookup: {
				from: 'categories',
				localField: 'categoryID',
				foreignField: '_id',
				as: 'category'
			}},

		{$project: {
				name: 1,
				description: 1,
				price: 1,
				quantity: 1,
				sold: 1,
				createdAt: 1,
				updatedAt: 1,
				categoryName: {$first: "$category.name"},
			}
		},

	])
	return data[0]
}

exports.productUpdateService = async (_id, userID, updateBody)=>{
	return Product.updateOne({userID:  ObjectId(userID), _id: ObjectId(_id)}, updateBody, {runValidators: true});
}

exports.productDeleteService = async (userID, _id)=>{
	return Product.remove({userID:  ObjectId(userID), _id: ObjectId(_id)});
}

exports.productValidityService = async (cart)=>{
	
		const ids = cart.reduce((accumulator, current)=>{
			return [...accumulator, ObjectId(current._id)]
		}, [])

		
		const qtys = cart.reduce((accumulator, current)=>{
			return [...accumulator, current.count]
		}, [])	
		
		// product find with cart products ids
	  const products = await Product.find({_id: {$in: ids}})
	//   if finded producs length not equal cart length
	  if(!products || products.length !== cart.length) throw error('Something went wrong');

	//   products filter with cart products quantity equel or less then
	 const quantityFiltered = products.filter((item,i) => {
		item.quantity <= qtys[i]
	  })
	//   if product quantity not equel or less then cart count
	 if(!quantityFiltered || quantityFiltered.length !== products.length) throw error('Something went wrong');

	 return cart;	
}

