import { Client, fql } from 'fauna'
import 'dotenv/config';

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});


const stream = client.stream(fql`
order.where(.status=="active" || .status=="processing").toStream()
`)

try {
  for await (const event of stream) {
    let e = event
    console.log(JSON.stringify(e)) 
  }
} catch (error) {
  console.error(error)
  stream.close()
}
