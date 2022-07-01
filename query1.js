import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
  domain: process.env.FAUNADB_DOMAIN
});

const q = faunadb.query;
const { Map, Paginate, Match, Index, Lambda, Select, Get, Var } = q;

function foo() {
  return Select(["data", "firstName"], Get(Select(["data", "customer"], Get(Var("x")))))
}
const res = await client.query( 
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
console.log(res);

