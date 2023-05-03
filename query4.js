import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
});

try {
  const query = fql`
    Credentials.byDocument(customer.byId("101")).login("Fauna123")
  `;
  const res = await client.query(query);

  console.log(res.data);
} catch (err) {
  console.log(err)
}