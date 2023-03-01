const cartModel = require("../models/cartModel")




const updateCart = async function (req, res) {
    try {
        const userId = req.params.userId

        //validations
        //userid validation
        if (!userId) return res.status(400).send({ status: false, message: "userId is mandatory" })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "Incorrect userId" })
        if (!userId.match(objectid)) return res.status(400).send({ status: false, message: "Incorrect userId" })

        const data = req.body
        if (!isValidbody(data)) {
            return res.status(400).send({ status: false, message: "plz enter some keys and values in the data" })
        }
        let { cartId, productId, removeProduct } = data

        //cartId validations
        if (!cartId) return res.status(400).send({ status: false, message: "cartId is mandatory" })
        if (!isValid(cartId)) return res.status(400).send({ status: false, message: "Incorrect cartId" })
        if (!cartId.match(objectid)) return res.status(400).send({ status: false, message: "Incorrect cartId" })

        //productId validations
        if (!productId) return res.status(400).send({ status: false, message: "productId is mandatory" })
        if (!isValid(productId)) return res.status(400).send({ status: false, message: "Incorrect productId" })
        if (!productId.match(objectid)) return res.status(400).send({ status: false, message: "Incorrect productId" })

        //removeProduct validations
        if (removeProduct == 0 || removeProduct == 1);
        else return res.status(400).send({ status: false, message: "please set removeProduct to 1 to decrease poduct quantity by 1, or set to 0 to remove product completely from the cart" })

       
        //cart validations-
        //Make sure that cart exist-
        const foundCart = await cartModel.findById(cartId).populate([{ path: "items.productId" }])//since productid is inside an ARRAY of OBJECT

        if (!foundCart) return res.status(404).send({ status: false, message: "No products found in the cart" })

        //authorization
        let loggedInUser = req.token.userId
        if (loggedInUser !== userId) return res.status(403).send({ status: false, message: "not authorized" })
        if (loggedInUser !== foundCart.userId.toString()) return res.status(403).send({ status: false, message: "not authorized to update this cart" })

        //Make sure the user exist-
        const foundUser = await userModel.findById(userId)
        if (!foundUser) return res.status(404).send({ status: false, message: "user not found for the given userId" })

        //Check if the productId exists and is not deleted before updating the cart
        let foundProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!foundProduct) return res.status(404).send({ status: false, message: "Product not found for the given productId" })

        //removeProduct and update
        let itemsArr = foundCart.items
        let initialItems = itemsArr.length
        let totalPrice = foundCart.totalPrice
        let totalItems = foundCart.totalItems

        if (itemsArr.length === 0) return res.status(400).send({ status: false, message: "cart is empty nothing to delete" })

        if (removeProduct === 0) {
            for (let i = 0; i < itemsArr.length; i++) {
                if (productId == itemsArr[i].productId._id) {
                    totalPrice -= itemsArr[i].productId.price * itemsArr[i].quantity
                    totalItems--
                    itemsArr.splice(i, 1)
                }
            }
            if (initialItems === itemsArr.length) return res.status(404).send({ status: false, message: "product does not exist in the cart" })
        }

        if (removeProduct === 1) {
            initialItems = totalItems
            let flag = false
            for (let i = 0; i < itemsArr.length; i++) {
                if (productId == itemsArr[i].productId._id) {
                    flag = true
                    totalPrice -= itemsArr[i].productId.price
                    itemsArr[i].quantity--
                    if (itemsArr[i].quantity == 0) {
                        totalItems--
                        itemsArr.splice(i, 1)
                    }
                }
            }
            if (!flag) return res.status(404).send({ status: false, message: "product does not exist in the cart" })
        }

        totalPrice = totalPrice.toFixed(2)
        const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, ({ items: itemsArr, totalPrice: totalPrice, totalItems: totalItems }), { new: true }).select({ __v: 0 })

        if (!updatedCart) return res.status(404).send({ status: false, message: "cart not found" })

        return res.status(200).send({ status: true, message: "Success", data: updatedCart })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


module.exports.updateCart = updateCart