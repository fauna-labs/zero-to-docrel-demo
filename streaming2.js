import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

const q = faunadb.query;
const { Documents, Collection } = q;

client.stream(
  Documents(Collection("customer"))
)
.on('set', s => { console.log(s) })
.start()

