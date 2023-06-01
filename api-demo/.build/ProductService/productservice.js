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
exports.createProduct = exports.getProducts = void 0;
const fauna_1 = require("fauna");
const FAUNA_API_KEY = process.env.FAUNA_API_KEY || "";
const createProduct = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
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
    `;
        const res = yield db.query(query);
        db.close();
        let product = res.data;
        response.body = JSON.stringify(product);
    }
    catch (err) {
        response.statusCode = err.httpStatus;
        response.body = err.message;
    }
    callback(undefined, response);
});
exports.createProduct = createProduct;
const getProducts = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    let response = {
        statusCode: 200,
        body: JSON.stringify("[]")
    };
    try {
        const db = new fauna_1.Client({
            secret: FAUNA_API_KEY
        });
        const query = (0, fauna_1.fql) `
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
exports.getProducts = getProducts;
//# sourceMappingURL=productservice.js.map