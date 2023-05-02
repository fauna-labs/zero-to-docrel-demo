import { Client, fql } from "fauna";
import 'dotenv/config';
import { customers, stores, products, orders} from './data.js';

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
});

async function createDocument(collection, data) {  
  try {
    let res = await client.query(fql`
      let createColl = Collection.byName(${collection}) == null
      if (createColl) {
        Collection.create({
          name: ${collection}
        })
      }
    `)
    let postProcess = fql`newdoc.id`;
    if (collection == 'products') {
      postProcess = fql`
        ${data.coll}.byId(newdoc.id).update({
          store: stores.byId(newdoc.store)
        })
      `
    }
    if (collection == 'orders') {
      postProcess = fql`
        ${data.coll}.byId(newdoc.id).update({
          customer: customers.byId(newdoc.customer),
          creationDate: Time(newdoc.creationDate),
          cart: newdoc.cart.map(x=>{
            Object.assign(x, { product: products.byId(x.product) })
          })
        })
      `
    }

    res = await client.query(fql`
      ${data.data}.map(x=>{
        if (!${data.coll}.byId(x.id).exists()) {
          let newdoc = ${data.coll}.create(x)
          ${postProcess}
        }
      })
    `)
    console.log(res.data)
  } catch(err) {
    console.log(err)
  }
}



await createDocument("customers", customers);
await createDocument("stores", stores);
await createDocument("products", products);
await createDocument("orders", orders);


