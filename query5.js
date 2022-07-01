import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
  domain: process.env.FAUNADB_DOMAIN
});

const q = faunadb.query;
const { Login, Ref, Collection, Map, Paginate, Match, Index, Lambda, Select, Get, Var } = q;

let res = await client.query( 
  Login(
    Ref(Collection("customers"), "101"), 
    {
      password: "Fauna123"
    }
  )
);

const client2 = new faunadb.Client({
  secret: res.secret, //-----USE SECRET FROM LOGIN-----//
  domain: process.env.FAUNADB_DOMAIN
});

client2.query( 
  Map(
    Paginate(Match(Index("orders_by_status"), "processing")),
    Lambda("x", 
      {
        status: Select(["data", "status"], Get(Var("x"))),
        customer: {
          firstName: Select(["data", "firstName"], Get(Select(["data", "customer"], Get(Var("x"))))),
          lastName: Select(["data", "lastName"], Get(Select(["data", "customer"], Get(Var("x")))))
        }
      }
    )
  )  
)
.then(res => {
  console.log(res);
})
.catch(err => {
  console.log(err.requestResult.responseContent);
})
