const auth = require('../auth.js')
const Messages = require('../models/Messages.js');

module.exports.saveMessage = (req, res) => {
    let newMessage = new Messages({
        name: req.body.name,
        email: req.body.email,
        category: req.body.category,
        message: req.body.message
    });
    console.log(req.body)
    newMessage.save()
    .then(result => res.send(true))
    .catch(error => res.send(false))
}


module.exports.loadMessages = (req, res) => {
    const userData = auth.decode(request.headers.authorization);

    if(userData.isAdmin) {
        Messages.find()
        .then(results => res.send(results))
        .catch(error => res.send(false))
    } else {
       return res.send(false)
    }
}