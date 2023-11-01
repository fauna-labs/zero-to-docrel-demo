import express from 'express';
import bodyParser from "body-parser";
import 'dotenv/config';
import { Client, fql } from "fauna";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAuth as adminGetAuth } from "firebase-admin/auth";
import { initializeApp as adminInit, cert } from "firebase-admin/app";
import { serviceAccount } from "./.env-adminsdk.js";

// express
const app = express()
app.use(bodyParser.json())
const port = 3000

// firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);

// fauna
const client = new Client({ secret: process.env.FAUNADB_SECRET });

// routes
app.post('/login', async (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;
    
    const idToken = await auth.currentUser.getIdTokenResult();
    const role = idToken.claims.role ? idToken.claims.role : 'user';
    const exp = parseInt(idToken.claims.exp);

    const userData = {
      role: role,
      ...user.providerData[0]
    }

    const query = fql`
    let u = user.byEmail(${username}).first()

    let doc = if (u == null) {
      user.create(${userData})
    } else {
      u!.update(${userData})
    }

    Token.create({
      document: doc,
      ttl: Time.epoch(${exp}, 'seconds')
    })    
    `
    const queryResp = await client.query(query);

    res.send(queryResp.data);

  } catch(error) {
    console.log(error);
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log(`errorCode: ${errorCode}`);
    res.statusCode = 401;
    res.send(errorMessage)
  }
})


app.put('/user/:email', async (req, res) => {
  const email = req.params.email
  const body = req.body;
  const role = body.role;
  try {
    adminInit({
      credential: cert(serviceAccount)
    });
    const user = await adminGetAuth().getUserByEmail(email);
    console.log(user);
    adminGetAuth().setCustomUserClaims(user.uid, {
      role: role
    });  
  } catch(e) {
    console.log(e);
    res.send(e);
    return;
  }
  res.send('ok');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})