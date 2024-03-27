import { Client, fql } from 'fauna'
import 'dotenv/config';

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  endpoint: process.env.FAUNA_ENDPOINT
});

const res = await client.query(fql`
  let set = order.where(.status=="active" || .status=="processing")
  {
    initialPage: set.pageSize(10),
    streamToken: set.toStream()    
  }
`);

const { initialPage, streamToken } = res.data;

const stream = client.stream(streamToken);

try {
  for await (const event of stream) {
    let e = event
    console.log(JSON.stringify(e)) 
  }
} catch (error) {
  console.error(error)
  stream.close()
}
