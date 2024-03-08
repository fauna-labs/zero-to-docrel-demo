import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

try {
  const status = "processing";
  const query = fql`
    order.byStatus(${status}) {
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
  client.close();
} catch (err) {
  console.log(err)
}


