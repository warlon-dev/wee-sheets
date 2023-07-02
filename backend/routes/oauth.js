const express = require('express');
const dotenv = require('dotenv');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users.js');
const auth = require('../auth.js')

const router = express.Router();
dotenv.config();


async function getUserData(access_token) {
  return new Promise(async (resolve, reject) =>{
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      const data = await response.json();
      if(data.email_verified){
        const result = await  Users.findOneAndUpdate(
          { email: data.email }, 
          {
            firstName: data.given_name,
            lastName: data.family_name,
            email: data.email,
            isSubscriber: true,
            profilePhoto: {
              fileName: data.email,
              googleDriveLink: data.picture
            }
          },
          {new:true, upsert:true }
        );
        const token = auth.createAccessToken(result);
        resolve(token);
      } else {
        resolve(false);
      }
    }catch(error) {
      reject(error);
    }
  })
}

router.get('/', async function(req, res, next) {
  const code = req.query.code;
  // console.log(`code:${code}`);

  try{
    const redirectURL = "http://127.0.0.1:3000/oauth"
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );
    
    const r =  await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(r.tokens);
    // console.info('Tokens acquired.');
    const user = oAuth2Client.credentials;
    // console.log('credentials',user);
    
    // const googleUser = jwt.decode(user.id_token);

    // console.log({googleUser})

    const token = await getUserData(oAuth2Client.credentials.access_token);
      console.log(token)
    if(token) {    
      res.redirect(303, `http://localhost:5173/authenticating/?token=${token}`);

    } else {
      res.redirect(303, `http://localhost:5173/signup`);
    }
    
  }catch(err) {
    console.log('Error with signing in with Google')
    res.redirect(303, `http://localhost:5173/signup`);
  }
  
},getUserData);


module.exports = router;

