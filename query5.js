import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

try {
  const customerId = "101"
  const password = "Fauna123"
  const query = fql`
    Credentials.byDocument(customer.byId(${customerId}))!.login(${password}) {
      secret      
    }
  `;
  const res = await client.query(query);
  
  const client2 = new Client({
    secret: res.data.secret //-----USE SECRET FROM LOGIN-----//
  });

  const query2 = fql`
    order.all() {
      name,
      customer { firstName },
      orderProducts {
        product {
          name
        }
      }
    }
  `;
  const res2 = await client2.query(query2);
  console.log(JSON.stringify(res2.data.data, null, 2))
  client.close();
  client2.close();
} catch(err) {
  console.log(err)  
}
