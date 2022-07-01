import { newConsoleLog } from './utils/newconsolelog.js';
console.log = newConsoleLog;
import 'dotenv/config';
import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
  domain: process.env.FAUNADB_DOMAIN
});

const q = faunadb.query;
const { Ref, Collection } = q;

client.stream.document(
  Ref(Collection("customers"), "101")
)
.on('version', v => { console.log(v) })
.start()

