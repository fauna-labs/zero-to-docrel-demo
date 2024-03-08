import { Router } from 'itty-router';
import { fql, Client, FaunaError, AbortError } from "fauna";

const router = Router();

router.get('/products', async (request, env, context) => {
  try {
    const client = new Client({
      secret: `${env.FAUNADB_SECRET}`,
      endpoint: `${env.FAUNA_ENDPOINT}`
    })
    
    let res = await client.query(fql`
      product.all() {
        id,
        name,
        description,
        sku,
        price,
        quantity,
        backorderedLimit,
        backordered
      }
      abort('foo')
    `)
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });    
  } catch(error) {
    return new Response(
      JSON.stringify({
        error: error.name,
        description: error.message
      }),
      { status: 500 }
    );  
  }
});

router.post('/product', async (request, env, context) => {
  const body = await request.json();

  try {
    const client = new Client({
      secret: `${env.FAUNADB_SECRET}`,
      endpoint: `${env.FAUNA_ENDPOINT}`
    })
    
    let res = await client.query(fql`
      product.create({
        'sku': ${body.sku},
        'name': ${body.name},
        'description': ${body.description},
        'price': ${body.price},
        'quantity': ${body.quantity},
        'backorderedLimit': ${body.backorderedLimit},
        'backordered': ${body.quantity < body.backorderedLimit ? true : false}
      }) {
        objectID: .id,
        sku,
        name,
        description,
        price,
        quantity,
        backorderedLimit,
        backordered
      }
    `)
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch(error) {
    return new Response(
      JSON.stringify({
        error: error.name,
        description: error.message
      }),
      { status: 500 }
    );
  }
});

router.get('/orders', async (request, env, context) => {
  try {
    const client = new Client({
      secret: `${env.FAUNADB_SECRET}`,
      endpoint: `${env.FAUNA_ENDPOINT}`
    })
    
    let res = await client.query(fql`
      order.all().map(o=>{
        {
          id: o.id,
          orderName: o.orderName,
          creationDate: o.creationDate,
          status: o.status,
          orderProducts: o.orderProducts.map(x=>{
            price: x.price,
            quantity: x.quantity,
            productId: x.product.id,
            productName: x.product.name,
            productSku: x.product.sku,
            productDescription: x.product.description
          })
        }
      })
    `)
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });    
  } catch(error) {
    return new Response(
      JSON.stringify({
        error: error.name,
        description: error.message
      }),
      { status: 500 }
    );  
  }
});

router.post('/order', async (request, env, context) => {
  try {
    const client = new Client({
      secret: `${env.FAUNADB_SECRET}`,
      endpoint: `${env.FAUNA_ENDPOINT}`
    })
    
    const body = await request.json();

    let res = await client.query(fql`
      let cart = ${body.orderProducts}

      cart.forEach(x=>{
        let p = product.byId(x.productId)!
        if (x.quantity > p.quantity) {
          abort(p.name + " does not have enough stock to fullfill qty: " + x.quantity.toString())
        } else {
          let updatedQty = p.quantity - x.quantity
          p.update({
            quantity: updatedQty,
            backordered: if (updatedQty < p.backorderedLimit) true else false
          })
        }
      })

      let orderProducts = cart.map(x=>{
        product: product.byId(x.productId),
        quantity: x.quantity,
        price: x.price
      })

      order.create({
        orderName: ${body.orderName},
        creationDate: Time.now(),
        status: "processing",
        orderProducts: orderProducts
      }) {
        objectID: .id,
        orderName,
        status,
        orderProducts
      }
    `)
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch(error) {
    return new Response(
      JSON.stringify({
        error: error.name,
        description: error.message
      }),
      { status: 500 }
    );
  }
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
};
