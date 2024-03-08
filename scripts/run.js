import { Client, fql } from "fauna";
import 'dotenv/config';
import { customers, stores, products, orders} from './data.js';

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
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

    if (collection == 'product') {
      postProcess = fql`
        ${data.coll}.byId(newdoc.id)!.update({
          store: store.byId(newdoc.store)
        })
      `
    }
    else if (collection == 'order') {
      postProcess = fql`
        ${data.coll}.byId(newdoc.id)!.update({
          customer: customer.byId(newdoc.customer),
          creationDate: Time(newdoc.creationDate),
          orderProducts: newdoc.orderProducts.map(x=>{
            Object.assign(x, { product: product.byId(x.product) })
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



await createDocument("customer", customers);
await createDocument("store", stores);
await createDocument("product", products);
await createDocument("order", orders);


