const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName : String,
    googleDriveLink: String
})

const File = mongoose.model("File", fileSchema);

module.exports = File;