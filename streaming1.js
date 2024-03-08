import { Client, fql } from 'fauna'
import 'dotenv/config';

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});


const stream = client.stream(fql`
order.all().toStream()
`)
stream.start()

try {
  for await (const event of stream) {
    let e = event
    if (event.type != "start") {
      let data = event.data
      delete data.ref
      delete data.coll
      delete data.ts
      e = { type: event.type, data: data }  
    }
    console.log(JSON.stringify(e)) 
  }
} catch (error) {
  console.error(error)
  stream.close()
}
