import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

try {
  const customerId = "101"
  const pwd = "Fauna123"
  const query = fql`
    Credentials.byDocument(customer.byId(${customerId}))!
    .login(
      ${pwd}, 
      Time.now().add(60, "minute")
    )
  `;
  const res = await client.query(query);
  console.log(res.data);
  client.close();
} catch (err) {
  console.log(err)
}