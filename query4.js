import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
  domain: process.env.FAUNADB_DOMAIN
});

const q = faunadb.query;
const { Login, Ref, Collection } = q;

const res = await client.query( 
  Login(
    Ref(Collection("customers"), "101"), 
    { password: "Fauna123" }
  )
);

console.log(res);
