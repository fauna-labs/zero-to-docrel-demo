import 'dotenv/config';

import { Client, fql } from "fauna";
import faunadb from 'faunadb';


const client = new Client({ 
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

try {
  const fieldName = "description";
  const field1=fql(["." + fieldName]);
  const oper1=fql(["=="]);
  const value1 = "foo";
  const q = fql`
    foo.where(${field1}${oper1}${value1});
    `
  const res = await client.query(q);
  client.close();
  console.log(res.data)
} catch (err) {
  console.log(err)
}


