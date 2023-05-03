import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
});

try {
  const query = fql`
    order.byStatus("processing") {
      id,
      status,
      customer {
        firstName,
        lastName
      }
    }
  `;
  const res = await client.query(query);

  console.log(res.data.data);
} catch (err) {
  console.log(err)
}


