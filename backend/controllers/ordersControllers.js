const bcrypt = require("bcrypt");

const auth = require("../auth.js");
const Orders = require("../models/Orders.js");
const { getFileStream, streamToBuffer } = require("../services/googleDrive.js");

module.exports.checkOut = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){
        let total = request.body.products.reduce((sum, item) => {
            return sum + item.subtotal
        }, 0)
        let newOrder = new Orders({
            userId: userData.id,
            products: request.body.products,
            totalAmount: total
        })
        newOrder.save()
        .then(result => response.send(true))
        .catch(error => response.send(false))
    } else {
        return response.send(false)
    }
}

module.exports.getOrders = async (request, response) => {
    const purchasedTemplates = []
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){

        const orders = await  Orders.find({ userId: userData.id }).populate('products.productID',['name','description','imgFiles']);
       
        const ordersWithImages = await Promise.all(
            orders.map(async(order) => {
                const orderWithImages = order.toObject()
                const updatedProduct = await Promise.all(
                    order.products.map(async(product) => {
                        const productWithImages = product.toObject();
                        const updatedImageFiles = await Promise.all(
                            product.productID.imgFiles.map(async (imgFile) => {
                                const imageStream = await getFileStream(imgFile.fileName);
                                const imageBuffer = await streamToBuffer(imageStream);
                                const imageData = imageBuffer.toString('base64');
                                const imageDataUri = `data:${imgFile.fileName};base64,${imageData}`;

                                return {
                                    fileName: imgFile.fileName,
                                    imageDataUri,
                                };
                            })
                        );
                        productWithImages.imgFile = updatedImageFiles;
                        const purchasedTemplate = {
                            _id: productWithImages.productID._id,
                            name: productWithImages.productID.name,
                            description: productWithImages.productID.description,
                            imgUrl: productWithImages.imgFile[0]?.imageDataUri,
                        }

                        if(purchasedTemplates.filter(template => template.name === purchasedTemplate.name).length === 0){
                            purchasedTemplates.push(purchasedTemplate)
                        }
                    })
                );
                    
            })
        )
        response.send(purchasedTemplates);
    } else {
        return response.send(false)
    }

   
};


module.exports.getAllOrders = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin){
        Orders.find().populate('userId',['email']).populate('products.productID',['name'])
        .then(results => response.send(results))
        .catch(error => response.send(false))
    }else{
        return response.send(false)
    }

}