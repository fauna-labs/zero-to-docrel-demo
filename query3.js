import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

try {
  const query = fql`
    Credentials.create({
      document: customer.byId("101"),
      password: "Fauna123"
    })
  `;
  const res = await client.query(query);
  console.log(res.data);
  client.close();
} catch (err) {
  console.log(err)
}