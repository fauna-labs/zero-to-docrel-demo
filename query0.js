// import { newConsoleLog } from './utils/newconsolelog.js';
// console.log = newConsoleLog;
import 'dotenv/config';

import { Client, fql } from "fauna";


const client = new Client({ 
  secret: process.env.FAUNADB_SECRET
});

try {
  const res = await client.query(
    fql`

    `
  );
  console.log(res.data);
} catch (err) {
  console.log(err)
}


