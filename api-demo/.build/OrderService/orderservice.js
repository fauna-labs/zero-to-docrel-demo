"use strict";
// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.createOrder = void 0;
const fauna_1 = require("fauna");
const FAUNA_API_KEY = process.env.FAUNA_API_KEY || "";
const createOrder = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const body = JSON.parse(event.body);
    let response = {
        statusCode: 200,
        body: ""
    };
    try {
        const db = new fauna_1.Client({
            secret: FAUNA_API_KEY
        });
        const query = (0, fauna_1.fql) `
      let cart = ${body.orderProducts}

      cart.forEach(x=>{
        let p = product.byId(x.productId)
        if (x.quantity > p.quantity) {
          abort(p.name + " does not have enough stock to fullfill qty: " + x.quantity)
        } else {
          p.update({
            quantity: p.quantity - x.quantity
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
    `;
        const res = yield db.query(query);
        db.close();
        let order = res.data;
        response.body = JSON.stringify(order);
    }
    catch (err) {
        response.statusCode = err.httpStatus;
        response.body = err.abort ? err.abort : err.message;
    }
    callback(undefined, response);
});
exports.createOrder = createOrder;
const getOrders = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    let response = {
        statusCode: 200,
        body: JSON.stringify("[]")
    };
    try {
        const db = new fauna_1.Client({
            secret: FAUNA_API_KEY
        });
        const query = (0, fauna_1.fql) `
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
    `;
        const res = yield db.query(query);
        db.close();
        response.body = JSON.stringify(res.data.data);
    }
    catch (err) {
        response.statusCode = err.httpStatus;
        response.body = err.message;
    }
    callback(undefined, response);
});
exports.getOrders = getOrders;
//# sourceMappingURL=orderservice.js.map