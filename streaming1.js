import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

const q = faunadb.query;
const { Ref, Collection } = q;

client.stream.document(
  Ref(Collection("customer"), "101")
)
.on('version', v => { console.log(v) })
.start()

