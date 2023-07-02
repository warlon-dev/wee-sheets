const fs = require('fs');
const { google } = require('googleapis');
const File = require('../models/File.js');
const dotenv = require('dotenv');

dotenv.config(); 

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.CLIENT_CREDENTIALS,
  apiKey: process.env.CLIENT_API_KEY,
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

module.exports.upload = (file) => {
    return new Promise((resolve, reject) => {
  

      auth.getClient()
        .then((authClient) => {
          const fileMetadata = {
            name: file.originalname,
            parents: ['1CvbYr-9rygUgdq6jstK3kS5qp_30ZO18'], // ID of the folder to upload the file into
          };

          
          const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
          };
  
          drive.files.create(
            {
              auth: authClient,
              resource: fileMetadata,
              media: media,
              fields: 'id,webViewLink',
            },
            (err, uploadedFile) => {
              if (err) {
                console.error('Error uploading to Google Drive:', err);
                reject(error);
              } else {
                const newFile = new File({
                  fileName: uploadedFile.data.id,
                  googleDriveLink: uploadedFile.data.webViewLink,
                });
    
                  newFile.save()
                  .then((savedFile) => {
                    resolve(savedFile);
                  }).catch(err => {
                    console.error('Error saving file link to MongoDB:', err);
                    reject(err);
                  });
              }
            }
          );
        })
        .catch((err) => {
          console.error('Error authenticating:', err);
          reject(error);
        });
    });
  };

  module.exports.getFileStream = (fileId) => {
    return new Promise((resolve, reject) => {
      auth.getClient()
        .then((authClient) => {
          const options = {
            auth: authClient,
            fileId: fileId,
            alt: 'media',
          };
  
          const stream = drive.files.get(options, { responseType: 'stream' }, (err, res) => {
            if (err) {
              console.error('Error retrieving file from Google Drive:', err);
              reject(err);
            } else {
              resolve(res.data);
            }
          });
        })
        .catch((err) => {
          console.error('Error authenticating:', err);
          reject(err);
        });
    });
  };

  module.exports.streamToBuffer = (stream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (error) => reject(error));
    });
  };
  