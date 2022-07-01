import faunadb from 'faunadb';
import { customers, stores, products, orders} from './data.js';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET_FOR_GQL_DEMO,
  domain: process.env.FAUNADB_DOMAIN
});

const q = faunadb.query;
const { Map, Create, Ref, Collection, Lambda, Var, Select } = q;


async function createDocument(collection, data) {
  const res = await client.query( 
    Map(
      data,
      Lambda("x",
        Create(Ref(Collection(collection), Select(["id"], Var("x"))), {
          data: Select(["data"], Var("x"))
        })
      )    
    )
  )
  console.log(res)
}

await createDocument("customers", customers);
await createDocument("stores", stores);
await createDocument("products", products);
await client.query( 
  Map(
    orders,
    Lambda("x",
      Create(Collection("orders"), {
        data: Var("x")
      })
    )    
  )
)

