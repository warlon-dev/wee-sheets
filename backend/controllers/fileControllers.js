const { uploadToGoogleDrive } = require('../services/googleDrive.js');



module.exports.upload = (req, res) => {
  const files = req.files;

    const uploadPromises = files.map((file) => uploadToGoogleDrive(file));

    Promise.all(uploadPromises)
    .then(() => {
      return res.status(200).json({ message:'Files uploaded successfully'});
    })
    .catch((err) => {
      return res.status(500).json({ error: 'Failed to upload files to Google Drive'});
    })
};