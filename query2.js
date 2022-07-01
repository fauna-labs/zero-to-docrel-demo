import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
  domain: process.env.FAUNADB_DOMAIN
});

const q = faunadb.query;
const { Map, Let, Get, Ref, Collection, Lambda, Select, Var, Do, Foreach, If, LTE, Abort, Concat, 
  ToString, Time, Update, Subtract, Create } = q;

const customerId = "101";
const requestedProducts = [
  { productId: "201", quantity: 10 }, 
  { productId: "202", quantity: 11 } 
];

client.query( 
  Let(
    {
      customer: Get(Ref(Collection("customers"), customerId)),
      products: Map(
        requestedProducts,
        Lambda(
          "requestedProduct",
          Let(
            {
              product: Get(
                Ref(
                  Collection("products"), 
                  Select("productId", Var("requestedProduct"))
                )
              )
            },
            {
              ref: Select("ref", Var("product")),
              price: Select(["data", "price"], Var("product")),
              currentQuantity: Select(["data", "quantity"], Var("product")),
              requestedQuantity: Select(["quantity"], Var("requestedProduct")),
              backorderLimit: Select(["data", "backorderLimit"], Var("product"))
            }
          )
        )
      )
    },
    Do(
      Foreach(
        Var("products"),
        Lambda(
          "product",
          If(
            LTE(
              Select("requestedQuantity", Var("product")),
              Select("currentQuantity", Var("product"))
            ),
            Var("product"),
            Abort(
              Concat([
                "Stock quantity for Product [",
                Select(["ref", "id"], Var("product")),
                "] not enough – requested at [",
                ToString(Time("now")),
                "]"
              ])
            )
          )
        )
      ),
      Foreach(
        Var("products"),
        Lambda(
          "product",
          Update(Select("ref", Var("product")), {
            data: {
              quantity: Subtract(
                Select("currentQuantity", Var("product")),
                Select("requestedQuantity", Var("product"))
              )
            }
          })
        )
      ),
      Foreach(
        Var("products"),
        Lambda(
          "product",
          If(
            LTE(
              Subtract(
                Select("currentQuantity", Var("product")),
                Select("requestedQuantity", Var("product"))
              ),
              Select("backorderLimit", Var("product"))
            ),
            Update(Select("ref", Var("product")), {
              data: { backordered: true }
            }),
            Var("product")
          )
        )
      ),
      Let(
        {
          shoppingCart: Map(
            Var("products"),
            Lambda("product", {
              product: Select("ref", Var("product")),
              quantity: Select("requestedQuantity", Var("product")),
              price: Select("price", Var("product"))
            })
          )
        },
        Create(Collection("orders"), {
          data: {
            customer: Select("ref", Var("customer")),
            cart: Var("shoppingCart"),
            status: "processing",
            creationDate: Time("now"),
            shipDate: null,
            deliveryAddress: Select(["data", "address"], Var("customer")),
            creditCard: Select(["data", "creditCard"], Var("customer"))
          }
        })
      )
    )
  )
)
.then(res => { console.log(res) })
.catch(err => { console.log(err.requestResult.responseContent) })

