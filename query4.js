import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET
});

try {
  const customerId = "101"
  const pwd = "Fauna123"
  const query = fql`
    Credentials.byDocument(customer.byId(${customerId}))!.login(${pwd})
  `;
  const res = await client.query(query);

  console.log(res.data);
} catch (err) {
  console.log(err)
}