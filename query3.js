import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
});

try {
  const query = fql`
    Credentials.create({
      document: customers.byId("101"),
      password: "Fauna123"
    })
  `;
  const res = await client.query(query);

  console.log(res.data);
} catch (err) {
  console.log(err)
}