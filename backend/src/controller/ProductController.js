const productModel = require("../models/productModel")
const { uploadFile } = require("../aws/aws")
const validation = require("../validation/validation");


const createProduct = async function (req, res) {
    try {
        let data = req.body


        if (validation.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "plz enter some keys and values in the data" })
        }

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, isDeleted } = data

        //title validation
        if (title) {
            if (!validation.isValidSpace(title)) return res.status(400).send({ status: false, message: "title is in incorrect format" })
            let isUniqueTitle = await productModel.findOne({ title: title });
            if (isUniqueTitle) {
                return res.status(400).send({ status: false, message: "This title is being used already" })
            }
        } else return res.status(400).send({ status: false, message: "title must be present" })


        //description validation
        if (description) {
            if (!isValidSpace(description)) return res.status(400).send({ status: false, message: "description is in incorrect format" })
        } else return res.status(400).send({ status: false, message: "description must be present" })

        //price validation
        if (!price || price == 0) return res.status(400).send({ status: false, message: "price cannot be empty" })
        if (!Number(price)) return res.status(400).send({ status: false, message: "price should be in valid number/decimal format" })
        data.price = Number(price).toFixed(2)

        //currencyID validation
        if (currencyId && currencyId.trim().length !== 0) {
            if (currencyId !== "INR") return res.status(400).send({ status: false, message: "only indian currencyId is allowed and the type should be string" })
        } else return res.status(400).send({ status: false, message: "currencyId cannot be empty" })

        //currency format validation
        if (currencyFormat && currencyFormat.trim().length !== 0) {
            if (currencyFormat !== "₹") return res.status(400).send({ status: false, message: "only indian currencyFormat is allowed and the type should be string" })
        } else return res.status(400).send({ status: false, message: "currencyFormat cannot be empty" })

        //isFreeShipping validation
        if (isFreeShipping) {
            if (isFreeShipping == "true" || isFreeShipping == "false" || typeof isFreeShipping === "boolean") { }
            else return res.status(400).send({ status: false, message: "type should be Boolean or true/false" })
        }

        // productImage validation
        if (req.files) {
            let image = req.files[0]
            if (image) {
               // console.log(image)
                if (!(image.mimetype.startsWith("image"))) return res.status(400).send({ status: false, message: "only image files are allowed" })
                let url = await uploadFile(image)
                data.productImage = url
            } else return res.status(400).send({ status: false, message: "must include product image file" })
        } else return res.status(400).send({ status: false, message: "must include product image file" })

        //style validation
        if (style) {
            if (!isValidSpace(style) || !style.match(validation.nameRegex))
                return res.status(400).send({ status: false, message: "style is in incorrect format" })
        }

        //installments validation
        if (installments) {
            installments = parseInt(installments)
            if (!installments || typeof installments != "number")
                return res.status(400).send({ status: false, message: "installments should be of type number" })
        }

        //availableSizes validation
        if (availableSizes) {
            availableSizes = availableSizes.split(",").map(ele => ele.trim())
            if (Array.isArray(availableSizes)) {
                let enumArr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
                let uniqueSizes = [...new Set(availableSizes)]
                for (let ele of uniqueSizes) {
                    if (enumArr.indexOf(ele) == -1) {
                        return res.status(400).send({ status: false, message: `'${ele}' is not a valid size, only these sizes are allowed [S, XS, M, X, L, XXL, XL]` })
                    }
                }
                data.availableSizes = uniqueSizes
            } else return res.status(400).send({ status: false, message: "availableSizes should be of type Array" })
        } else return res.status(400).send({ status: false, message: "please provide atleast one size" })

        if (isDeleted) {
            if (!(isDeleted == "true" || isDeleted == "false" || typeof isDeleted === "boolean"))
                return res.status(400).send({ status: false, message: "isDeleted should be Boolean or true/false" })
            if (isDeleted == true || isDeleted == "true") data.deletedAt = new Date
        }

        const createdProduct = await productModel.create(data)

        return res.status(201).send({ status: true, message: 'Success', data: createdProduct })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getProductByFilter = async function (req, res) {
    try {

        const filters = req.query

        let { title, price, availableSizes, style, priceLessThan, priceGreaterThan } = filters

        filters["isDeleted"] = false



        if (!validation.isValidBody(filters)) {

            //validating title
            if (title || title === "") {
                title = validation.isTrimed(title)
                if (!validation.isValidSpace(title)) return res.status(400).send({ status: false, message: "provide the title" })
                if (validation.isValidString(title)) return res.status(400).send({ status: false, message: "provide valid title" })
                filters["title"] = title
            }

            //validating price
            if (price || price === "") {
                price = validation.isTrimed(price)
                if (!validation.isValidSpace(price)) return res.status(400).send({ status: false, message: "provide the price" })
                if (!validation.isValidNum(price)) return res.status(400).send({ status: false, message: "price must be in number" })
                if (price <= 0) return res.status(400).send({ status: false, message: "there are no free products" })
                filters["price"] = price
            }

            //validating availableSizes
            if (availableSizes || availableSizes === "") {
                availableSizes = validation.isTrimed(availableSizes)
                if (!validation.isValidSpace(availableSizes)) return res.status(400).send({ status: false, message: "provide the size" })
                availableSizes = validation.convertFormat(availableSizes)
                let size = availableSizes.split(",")
                if (!size.every(s => validation.isValidSize(s))) return res.status(400).send({ status: false, message: "this size is not available" })

                filters["availableSizes"] = { $in: size }
            }

            //validating style
            if (style || style === "") {
                style = validation.isTrimed(style)
                if (!validation.isValidSpace(style)) return res.status(400).send({ status: false, message: "provide the style" })
                if (!validation.isValidString(style)) return res.status(400).send({ status: false, message: "provide valid style" })
                filters["style"] = style
            }


            //validating priceGreaterThan
            if (priceGreaterThan || priceGreaterThan === "") {
                priceGreaterThan = validation.isTrimed(priceGreaterThan)
                if (!validation.isValidSpace(priceGreaterThan)) return res.status(400).send({ status: false, message: "provide the price" })

                if (!validation.isValidNum(priceGreaterThan)) return res.status(400).send({ status: false, message: "price must be in number" })
                filters["price"] = { $gte: priceGreaterThan }
            }

            //validating availableSizes
            if (priceLessThan || priceLessThan === "") {
                priceLessThan = validation.isTrimed(priceLessThan)
                if (!validation.isValidSpace(priceLessThan)) return res.status(400).send({ status: false, message: "provide the price" })

                if (!validation.isValidNum(priceLessThan)) return res.status(400).send({ status: false, message: "price must be in number" })
                filters["price"] = { $lte: priceLessThan }
            }


            if (priceGreaterThan && priceLessThan) {
                filters["price"] = { $gte: priceGreaterThan, $lte: priceLessThan }
            }


            const productData = await productModel.find(filters)
            if (productData.length == 0) return res.status(404).send({ status: false, msg: "no product found" })
            return res.status(200).send({ status: true, data: productData })



        } else {
            const productData = await productModel.find()
            return res.status(200).send({ status: true, data: productData })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createProduct, getProductByFilter }

