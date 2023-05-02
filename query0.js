import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({ 
  secret: process.env.FAUNADB_SECRET
});

try {
  const res = await client.query(
    fql`
    Collection.all()
    `
  );
  console.log(res);
} catch (err) {
  console.log(err)
}


