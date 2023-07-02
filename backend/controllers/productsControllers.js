const auth = require('../auth.js')

const { upload, getFileStream, streamToBuffer } = require('../services/googleDrive.js');
const Products = require('../models/Products.js');
const Users = require('../models/Users.js');

module.exports.addProduct = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin){
        Products.findOne({name: request.body.name})
        .then(result => {
            if(!result) {
                const files = request.files;
                const uploadPromises = files.map((file) => {
                  return  upload(file)
                })
                Promise.all(uploadPromises)
                .then((uploadedFiles) => {
                    const fileLinks = uploadedFiles.map((uploadedFile) => ({
                        fileName: uploadedFile.fileName,
                        googleDriveLink: uploadedFile.googleDriveLink
                    }));

                    let newProduct = new Products({
                        name: request.body.name,
                        description: request.body.description,
                        category: request.body.category,
                        price: request.body.price,
                        isBundle: request.body.isBundle,
                        imgFiles: fileLinks
                    });

                    newProduct.save()
                    .then(() => response.send(true))
                    .catch(error => response.send(false))
                })
                .catch((err) => {
                    console.error('Error uploading files to Google Drive:', err);
                    response.send(false);
                });
            } else {
                return response.send(false)
            }
        }).catch(error => response.send(false))
    }else{
        return response.send(false)
    }
    
}


module.exports.getAllProducts = async (request, response) => {
    try {
        const userData = auth.decode(request.headers.authorization);
        if(userData.isAdmin){
            const products = await Products.find();
            const productsWithImages = await Promise.all(
                products.map(async (product) => {
                    const productWithImages = product.toObject();

                    // Stream  images and update image links
                    const updatedImgFiles = await Promise.all(
                        product.imgFiles.map(async (imgFile) => {
                            const imageStream = await getFileStream(imgFile.fileName);

                            const imageBuffer = await streamToBuffer(imageStream);
                            const imageData = imageBuffer.toString('base64');
                            const imageDataUri =`data:${imgFile.fileName};base64,${imageData}`;

                            return {
                                fileName: imgFile.fileName,
                                imageDataUri,
                            };
                        })
                    );

                    productWithImages.imgFiles = updatedImgFiles;
                    return productWithImages;
                })
            );
            response.send(productsWithImages);
                
        } else {
            response.send(false)
        }
    } catch (error) {
        // console.error('Error retrieving products:', error);
        response.send(error);
    }
};

module.exports.getCategories = (request, response) => {
    Products.find().distinct("category")
        .then(results => response.send(results))
        .catch(error => response.send(false))
}



module.exports.getActiveProducts = async (request, response) => {
    const products = await Products.find({ isActive: true, isBundle: false });
    const productsWithImages = await Promise.all(
        products.map(async (product) => {
            const productWithImages = product.toObject();

            // Stream  images and update image links
            const updatedImgFiles = await Promise.all(
                product.imgFiles.map(async (imgFile) => {

                    const imageStream = await getFileStream(imgFile.fileName);

                    const imageBuffer = await streamToBuffer(imageStream);
                    const imageData = imageBuffer.toString('base64');
                    const imageDataUri =`data:${imgFile.fileName};base64,${imageData}`;

                    return {
                        fileName: imgFile.fileName,
                        imageDataUri,
                    };
                })
            );

            productWithImages.imgFiles = updatedImgFiles;
            return productWithImages;
        })
    );
    response.send(productsWithImages);
};

module.exports.getActiveBundles = async (request, response) => {
    const products = await Products.find({ isActive: true, isBundle: true });
    const productsWithImages = await Promise.all(
        products.map(async (product) => {
            const productWithImages = product.toObject();

            // Stream  images and update image links
            const updatedImgFiles = await Promise.all(
                product.imgFiles.map(async (imgFile) => {

                    const imageStream = await getFileStream(imgFile.fileName);

                    const imageBuffer = await streamToBuffer(imageStream);
                    const imageData = imageBuffer.toString('base64');
                    const imageDataUri =`data:${imgFile.fileName};base64,${imageData}`;

                    return {
                        fileName: imgFile.fileName,
                        imageDataUri,
                    };
                })
            );

            productWithImages.imgFiles = updatedImgFiles;
            return productWithImages;
        })
    );
    response.send(productsWithImages);
};


module.exports.getProduct = async (request, response) => {
    const product = await  Products.findById(request.params.productId);
    const productWithImages = product.toObject();

    // Stream  images and update image links
    const updatedImgFiles = await Promise.all(
        product.imgFiles.map(async (imgFile) => {

            const imageStream = await getFileStream(imgFile.fileName);

            const imageBuffer = await streamToBuffer(imageStream);
            const imageData = imageBuffer.toString('base64');
            const imageDataUri =`data:${imgFile.fileName};base64,${imageData}`;

            return {
                fileName: imgFile.fileName,
                imageDataUri,
            };
        })
    );

    productWithImages.imgFiles = updatedImgFiles;
    
    response.send(productWithImages);
};

module.exports.updateProduct = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin){
        const files = request.files;
        const uploadPromises = files.map((file) => {
            return  upload(file)
        })
        Promise.all(uploadPromises)
        .then((uploadedFiles) => {
            const fileLinks = uploadedFiles.map((uploadedFile) => ({
                fileName: uploadedFile.fileName,
                googleDriveLink: uploadedFile.googleDriveLink
            }));


            Products.findByIdAndUpdate(request.params.productId, {
                name: request.body.name,
                description: request.body.description,
                category: request.body.category,
                price: request.body.price,
                isBundle: request.body.isBundle,
                imgFiles: fileLinks
            }, {new:true})
            .then(result => response.send(true))
            .catch(error => response.send(false))
        })
        .catch((err) => {
            console.error('Error uploading files to Google Drive:', err);
            response.send(false);
        });

    }else{
        return response.send(false)
    }
}

module.exports.archiveProduct = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin){
        Products.findByIdAndUpdate(request.params.productId, {
            isActive: false
        }, {new:true})
        .then(result => response.send(true))
        .catch(error => response.send(false))
    }else{
        return response.send(false)
    }
}

module.exports.activateProduct = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin){
        Products.findByIdAndUpdate(request.params.productId, {
            isActive: true
        }, {new:true})
        .then(result => response.send('Product is now active!'))
        .catch(error => response.send(error))
    }else{
        return response.send("You are not an Admin!")
    }
}


module.exports.addToCart = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    const productId = request.params.productId

    if(!userData.isAdmin){
        Users.findById(userData.id)
        .then(result => {
            const index = result.cartItems.map(item => item.product.toString()).indexOf(productId)
            if(index >= 0){
                result.cartItems[index].quantity += request.body.quantity
                result.save()
                .then(() => response.send(true))
                .catch(error => response.send(false))
            } else {
                let newCartItem = {
                    product: productId,
                    quantity: request.body.quantity,
                }
                result.cartItems.push(newCartItem)

                result.save()
                .then(() => response.send(true))
                .catch(error => response.send(false))
            }
        }).catch(error => response.send(false))
    } else {
        return response.send("Admins are not allowed to checkout items!")
    }
}

