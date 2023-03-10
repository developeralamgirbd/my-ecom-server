const mongoose = require("mongoose");
const fs = require('fs');
const Product = require("../../models/product/Product");
const { error } = require("../../utils/error");
const ObjectId = mongoose.Types.ObjectId;

exports.productCreateService = async (productBody, )=>{
	const product = new Product(productBody);
	// if (image) {
	// 	product.image.data = fs.readFileSync(image.path);
	// 	product.image.contentType = image.type;
	// }
	await product.save();
	return product;
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
							category: 1,
							image: 1
						}
					},


					{$skip: (page - 1) * perPage},
					{$limit: perPage},
					{$sort: {createdAt: -1}}
				]
			}},

	])

	return {total: data[0]?.totalProduct[0]?.count || 0, rows: data[0]['rows']}
}

exports.showProductByCategoryService = async (query, page, perPage)=>{

	return Product.aggregate([
		{
			$match: query
		},

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
							category: 1,
							image: 1
						}
					},


					{$skip: (page - 1) * perPage},
					{$limit: perPage},
					{$sort: {createdAt: -1}}
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
				from: 'brands',
				localField: 'brandID',
				foreignField: '_id',
				as: 'brand'
			}},

		{$project: {
				name: 1,
				description: 1,
				price: 1,
				quantity: 1,
				sold: 1,
				createdAt: 1,
				updatedAt: 1,
				category: 1,
				brand: 1,
				image: 1,
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
			return [...accumulator, current.count + 1]
		}, [])
		
		// product find with cart products ids
	  const products = await Product.find({_id: {$in: ids}})

	//   if finded producs length not equal cart length
	  if(!products || products.length !== cart.length) throw error('Something went wrong');

		/*const quantityFiltered = products.filter((item, i) => {
			return item.quantity < qtys[i];
		});

	console.log(quantityFiltered)
	//   if product quantity not equal or less than cart count
	 if(!quantityFiltered || quantityFiltered.length !== products.length) throw error('Something went wrong');*/


	 return cart;	
}

