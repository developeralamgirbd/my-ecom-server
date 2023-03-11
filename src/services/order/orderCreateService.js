const mongoose = require('mongoose');
const OrderModel = require('../../models/order/Order');
const OrderItemModel = require('../../models/order/OrderItem');
const PaymentModel = require('../../models/order/Payment');
const ShippingAddressModel = require('../../models/order/ShippingAddress');
const ProductModel = require('../../models/product/Product');
const AddressModel = require('../../models/user/Address');
const { error } = require('../../utils/error');

const ObjectId = mongoose.Types.ObjectId;
// Customer Services
exports.orderCreateService =  async (nonce, products, gateway, user, shippingAddressObj)=>{
    	const session = await mongoose.startSession();
        await session.startTransaction();

        try {
            const options = { session };

            let amount = products.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.count * currentValue.price
            },0)

            // console.log(products);

            parseFloat(amount).toFixed(2);
            // Braintree Payment Process
            const newTransaction = await gateway.transaction.sale({
                amount: amount,
                customer: {
                    id: user?._id,
                    firstName: `ID: ${user?._id},`,
                    lastName: `Email: ${user?.email}`,
                    company: null,
                    email: user?.email,
                    website: null,
                    phone: user?.mobile,
                    fax: null
                },
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true
                }
            });

            // console.log(newTransaction);
            

            // 1st DB Process Order create
            let orderID = 1;
            const order = await OrderModel.find().sort({createdAt: -1}).limit(1);
            if (order.length > 0){
                orderID = order[0]?.orderID + 1
            }

            const newOrder = new OrderModel({
                userID: user._id,
                orderID: orderID,
                totalAmount: newTransaction.transaction.amount,
                paymentStatus: newTransaction?.success ? 'paid' : 'unpaid',
            });

            await newOrder.save(options);
            // console.log(newOrder)


            // 2nd DB Process Order Items create

            const orderItems = products.reduce((accumulator, currentValue)=>{
               return [...accumulator, {
                   orderID: newOrder?._id,
                   productID: currentValue?._id,
                   price: currentValue?.price,
                   quantity: currentValue?.count
               }]
            }, []);

            // console.log(orderItems)


            const newOrderItems = await OrderItemModel.insertMany(orderItems, options);

            // 3rd DB Process Shipping Address create
            const userAddress = await AddressModel.findOne({userID: ObjectId(user?._id)});

            const shippingAddress = new ShippingAddressModel({
                orderID: newOrder._id,
                userID: user?._id,
                name: shippingAddressObj?.name || `${user.firstName} ${user.lastName}`,
                address: shippingAddressObj?.address || userAddress?.address,
                city: shippingAddressObj?.city || userAddress?.city,
                state: shippingAddressObj?.state || userAddress?.state,
                country: shippingAddressObj?.country || userAddress?.country,
                zipCode: shippingAddressObj?.zipCode || userAddress?.zipCode,
                mobile: shippingAddressObj?.mobile || user?.mobile,
            });
            await shippingAddress.save(options);


            // 4th DB Process Payment create

            const payment = new PaymentModel({
                orderID: newOrder?._id,
                amount: newTransaction.transaction.amount,
                status: newTransaction?.success ? 'success' : 'failure',
                paymentMethod: newTransaction.transaction.paymentInstrumentType,
                payment: newTransaction
            });

            await payment.save(options)

            await session.commitTransaction();
            session.endSession();
            return newTransaction;
        }catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction aborted:', e);
           throw error('Something went wrong')

        }
}

exports.getOrderDetailsService = async (orderID)=>{
  const data = await OrderItemModel.aggregate([
        {$match: {orderID: ObjectId(orderID)}},
        {$facet: {
            subtotal: [
                {$group: {_id: null, amount: { $sum: { $multiply: [ "$quantity", "$price" ] }}}}
            ],
          rows: [
              {$lookup: {from: 'products', foreignField: '_id', localField: 'productID', as: 'products'}},
              {$unwind: '$products'},
              {$project: {_id: 1, price: 1, quantity: 1, createdAt: 1, 'products._id': 1, 'products.name': 1, 'products.image': 1}}
          ]
          }},

    ])
    // console.log(data[0].subTotal)

    return {subtotal: data[0]?.subtotal[0]?.amount, rows: data[0]?.rows}

}


