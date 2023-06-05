import 'dotenv/config';

import { Client, fql } from "fauna";

const client = new Client({ 
  secret: process.env.FAUNADB_SECRET
});

try {
  const res = await client.query(
    fql`
    order.all() {
      name
    }
    `
  );
  console.log(JSON.stringify(res.data, null, 2));
} catch (err) {
  console.log(err)
}


