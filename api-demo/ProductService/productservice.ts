// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import { Handler, Context, Callback } from 'aws-lambda';
import { Client, QuerySuccess, fql } from "fauna";

interface Response {
  statusCode: number;
  body: string;
}

const FAUNA_API_KEY: string = process.env.FAUNA_API_KEY || "";


const createProduct: Handler = async (event: any, context: Context, callback: Callback) => {
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
      product.create({
        'sku': ${body.sku},
        'name': ${body.name},
        'description': ${body.description},
        'price': ${body.price},
        'quantity': ${body.quantity},
        'backorderedLimit': ${body.backorderedLimit},
        'backordered': ${body.quantity < body.backorderedLimit ? true : false}
      }) {
        objectID: .id,
        sku,
        name,
        description,
        price,
        quantity,
        backorderedLimit,
        backordered
      }
    `  
    const t1 = Date.now();    
    const res: QuerySuccess<any> = await db.query(query);
    const t2 = Date.now();
    db.close();

    let product: any = res.data;
    response.body = JSON.stringify({
      data: product,
      time: (t2 - t1)/1000
    });
  } catch (err: any) {
    response.statusCode = err.httpStatus;
    response.body = err.message;
  }
  callback(undefined, response);
};


const getProducts: Handler = async (event: any, context: Context, callback: Callback) => {
  let response: Response = {
    statusCode: 200,
    body: JSON.stringify("[]")
  };

  try {
    const db = new Client({
      secret: FAUNA_API_KEY
    });

    const query = fql`
      product.all() {
        id,
        name,
        description,
        sku,
        price,
        quantity,
        backorderedLimit,
        backordered
      }
    `  

    const t1 = Date.now();    
    const res: QuerySuccess<any> = await db.query(query);
    const t2 = Date.now()
    db.close();

    response.body = JSON.stringify({
      data: res.data.data,
      time: (t2 - t1)/1000
    })

  } catch (err: any) {
    response.statusCode = err.httpStatus;
    response.body = err.message;
  }

  callback(undefined, response);
};

export { getProducts, createProduct }

