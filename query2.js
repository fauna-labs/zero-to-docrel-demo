import 'dotenv/config';
import { Client, fql } from "fauna";

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

const customerId = "101";
const cart = [
  { productId: "201", quantity: 10 }, 
  { productId: "202", quantity: 11 } 
];

try {
  const query = fql`
    ${cart}.forEach(x=>{              
      let p = product.byId(x.productId)!
      let updatedQty = p.quantity - x.quantity

      if (updatedQty < 0) {                  
        abort("Insufficient stock for product " + p.name + ": Requested quantity=" + x.quantity.toString())
      } else {
        p.update({
          quantity: updatedQty
        })
      }
    })
    
    let cust = customer.byId(${customerId})!

    order.create({
      name: "Order for " + cust.firstName,
      customer: cust,
      creationDate: Time.now(),
      status: 'processing',
      orderProducts: ${cart}.map(x=>{
        product: product.byId(x.productId),
        quantity: x.quantity,
        price: product.byId(x.productId)!.price
      }),
      deliveryAdress: cust.address,
      creditCard: cust.creditCard
    }) {
      id,
      creationDate
    }    
  `;
  const res = await client.query(query);
  console.log(res);
  client.close();
} catch (err) {
  console.log(err)
}
