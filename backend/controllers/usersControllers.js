const bcrypt = require('bcrypt');

const { getFileStream, streamToBuffer } = require('../services/googleDrive.js');
const Users = require('../models/Users.js');
const auth = require('../auth.js')

module.exports.registerUser = (request, response) => {
    Users.findOne({ email: request.body.email})
        .then(result => {
            if(!result){
                let newUser = new Users({
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    email: request.body.email,
                    isSubscriber: request.body.isSubscriber,
                    password: bcrypt.hashSync(request.body.password, 10)
                });

                newUser.save()
                    .then(() => response.send(true))
                    .catch(error => response.send(false))

            } else {
                response.send(false)
            }
        }).catch(error => response.send(false))
}

module.exports.loginUser = (request, response) => {
    Users.findOne({ email:request.body.email})
        .then(result => {
            if(!result){
                response.send(false)
            } else {
                const isPasswordCorrect = bcrypt.compareSync(request.body.password, result.password);
                if(isPasswordCorrect){
                    return response.send({
                        auth: auth.createAccessToken(result)
                    })
                } else {
                    return response.send(false)
                }
            }
        })
        .catch(() => response.send(false))
}

// module.exports.getUserDetails = ( request, response ) => {
//     const userData = auth.decode(request.headers.authorization);
//     Users.findById(userData.id)
//     .then(result => {
//         result.password ="***Password Encrypted***"
//         response.send(result)
//     }).catch(() => response.send(false))
// }
module.exports.getUserDetails = async (request, response) => {
    const userData = auth.decode(request.headers.authorization);

    const user = await  Users.findById(userData.id);
    const userWithImages = user.toObject();
    if(user.profilePhoto.fileName) {
        if(user.profilePhoto.fileName === user.email) {
            userWithImages.profileUrl = user.profilePhoto.googleDriveLink;
        } else {
            const imageStream = await getFileStream(user.profilePhoto.fileName);

            const imageBuffer = await streamToBuffer(imageStream);
            const imageData = imageBuffer.toString('base64');
            const imageDataUri =`data:${imgFile.fileName};base64,${imageData}`;
            userWithImages.profileUrl = imageDataUri;
        }
    }
    console.log(userWithImages)
    
    response.send(userWithImages);

    // // Stream  images and update image links
    // const updatedImgFile = await Promise.all(
    //     product.imgFiles.map(async (imgFile) => {

    // response.send(productWithImages);
    // return {
    //     fileName: imgFile.fileName,
    //     imageDataUri,
    // };

    //     })
    // );

};
module.exports.getProfile = ( request, response ) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin) {
        Users.findById(request.body.id)
        .then(result => {
            if(!result){
                return response.send("User ID not found!");
            } else {
                result.password ="***Password Encrypted***"
                response.send(result)
            }
        }).catch(error => response.send(error))
    } else {
        Users.findById(userData.id)
        .then(result => {
            result.password ="***Password Encrypted***"
            response.send(result)
        }).catch(error => response.send(error))
    }
}

module.exports.makeAdmin = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin) {
        Users.findByIdAndUpdate(request.body.id,{ isAdmin: true })
        .then(result => {
            if(!result){
                return response.send("User ID not found!");
            } else {
                response.send(`User with email:${result.email} has been granted admin access`)
            }
        }).catch(error => response.send(error))
    } else {
        return response.send("You are not an Admin!");
    }
}

module.exports.removeAdmin = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(userData.isAdmin) {
        Users.findByIdAndUpdate(request.body.id,{ isAdmin: false })
        .then(result => {
            if(!result){
                return response.send("User ID not found!");
            } else {
                response.send(`User with email:${result.email} has been revoked admin access`)
            }
        }).catch(error => response.send(error))
    } else {
        return response.send("You are not an Admin!");
    }
}

// CART FUNCTIONS 

// module.exports.viewCartItems = (request, response) => {
//     const userData = auth.decode(request.headers.authorization);
//     if(!userData.isAdmin){
//         Users.findById(userData.id, 
//             {   
//                 'cartItems': 1,
//             }
//         ).populate('cartItems.product')
//         .then(result => response.send(result))
//         .catch(error => response.send(false))

//     } else {
//         return response.send(false);
//     }
// }


module.exports.viewCartItems = async (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){
        const user = await  Users.findById(userData.id, {'cartItems': 1}).populate('cartItems.product');
        const products = user.cartItems;

        const productsWithImages = await Promise.all(
            products.map(async (product) => {
                const productWithImages = product.toObject();
    
                // Stream  images and update image links
                const updatedImgFiles = await Promise.all(
                    product.product.imgFiles.map(async (imgFile) => {
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
        return response.send(false);
    }
    
};


module.exports.changeCartItemQty = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){
        Users.findById(userData.id)
        .then(result => {
            const index = result.cartItems.map(item => item.product.toString()).indexOf(request.body.productId)
            result.cartItems[index].quantity = request.body.quantity
            result.save()
            .then(() => response.send(true))
            .catch(error => response.send(false))
        }).catch(error => response.send(false))
    } else {
        return response.send(false)
    }
}

module.exports.removeCartItem = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){
        Users.findById(userData.id)
        .then(result => {
            result.cartItems = result.cartItems.filter(item => item.product.toString() !== request.body.productId)
            result.save()
            .then(() => response.send(true))
            .catch(error => response.send(false))
        }).catch(error => response.send(false))
    } else {
        return response.send(false)
    }
}


module.exports.cartSubtotals = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){
        Users.findById(userData.id, 
            {   
                'cartItems.product': 1,
                'cartItems.subtotal': 1
            }
        ).populate('cartItems.product', 'name')
        .then(result => response.send(result))
        .catch(error => response.send(error))

    } else {
        return response.send("Admins have no access on this route");
    }
}


module.exports.cartTotal = (request, response) => {
    const userData = auth.decode(request.headers.authorization);
    if(!userData.isAdmin){
        Users.findById(userData.id)
        .then(result => {
            const total = result.cartItems.reduce((sum,item) => {
                return item.subtotal + sum
            },0)

            return response.send(`Cart Total:${total}`)
        })
        .catch(error => response.send(error))

    } else {
        return response.send("Admins have no access on this route");
    }
}