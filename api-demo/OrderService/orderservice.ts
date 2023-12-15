// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import { Handler, Context, Callback } from 'aws-lambda';
import { Client, QuerySuccess, fql } from "fauna";

interface Response {
  statusCode: number;
  body: string;
}

const FAUNA_API_KEY: string = process.env.FAUNA_API_KEY || "";

const createOrder: Handler = async (event: any, context: Context, callback: Callback) => {
  const body = JSON.parse(event.body);

  let response: Response = {
    statusCode: 200,
    body: ""
  };

  try {
    const db = new Client({
      secret: FAUNA_API_KEY
    });

    const query = fql`
      let cart = ${body.orderProducts}

      cart.forEach(x=>{
        let p = product.byId(x.productId)!
        if (x.quantity > p.quantity) {
          abort(p.name + " does not have enough stock to fullfill qty: " + x.quantity.toString())
        } else {
          let updatedQty = p.quantity - x.quantity
          p.update({
            quantity: updatedQty,
            backordered: if (updatedQty < p.backorderedLimit) true else false
          })
        }
      })

      let orderProducts = cart.map(x=>{
        product: product.byId(x.productId),
        quantity: x.quantity,
        price: x.price
      })

      order.create({
        orderName: ${body.orderName},
        creationDate: Time.now(),
        status: "processing",
        orderProducts: orderProducts
      }) {
        objectID: .id,
        orderName,
        status,
        orderProducts
      }
    `  

    const t1 = Date.now();    
    const res: QuerySuccess<any> = await db.query(query);
    const t2 = Date.now();
    db.close();

    let order: any = res.data;
    response.body = JSON.stringify({
      data: order,
      time: (t2-t1)/1000
    });
  } catch (err: any) {
    response.statusCode = err.httpStatus;
    response.body = err.abort ? err.abort : err.message;
  }
  callback(undefined, response);
};


const getOrders: Handler = async (event: any, context: Context, callback: Callback) => {
  let response: Response = {
    statusCode: 200,
    body: JSON.stringify("[]")
  };

  try {
    const db = new Client({
      secret: FAUNA_API_KEY
    });
  
    const query = fql`
      order.all().map(o=>{
        {
          id: o.id,
          orderName: o.orderName,
          creationDate: o.creationDate,
          status: o.status,
          orderProducts: o.orderProducts.map(x=>{
            price: x.price,
            quantity: x.quantity,
            productId: x.product.id,
            productName: x.product.name,
            productSku: x.product.sku,
            productDescription: x.product.description
          })
        }
      })
    `  
    const t1 = Date.now();    
    const res: QuerySuccess<any> = await db.query(query);
    const t2 = Date.now();
    db.close();
    response.body = JSON.stringify({
      data: res.data.data,
      time: (t2-t1)/1000
    });    
  } catch (err: any) {
    response.statusCode = err.httpStatus;
    response.body = err.message;
  }
  callback(undefined, response);
};

export { createOrder, getOrders }

