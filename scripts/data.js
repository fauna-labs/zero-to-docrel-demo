import faunadb from 'faunadb';
const q = faunadb.query;
const { Ref, Collection, Time } = q;


const customers = [
  {
    id: 101,
    data: {
      firstName: "Alice",
      lastName: "Appleseed",
      address: {
        street: "87856 Mendota Court",
        city: "Washington",
        state: "DC",
        zipCode: "20220"
      },
      telephone: "208-346-0715",
      creditCard: {
        network: "Visa",
        number: "4556781272473393"
      }
    }
  },
  {
    id: 102,
    data: {
      firstName: "Bob",
      lastName: "Brown",
      address: {
        street: "72 Waxwing Terrace",
        city: "Washington",
        state: "DC",
        zipCode: "20002"
      },
      telephone: "719-872-8799",
      creditCard: {
        network: "Visa",
        number: "4916112310613672"
      }
    }
  },
  {
    id: 103,
    data: {
      firstName: "Carol",
      lastName: "Clark",
      address: {
        street: "5 Troy Trail",
        city: "Washington",
        state: "DC",
        zipCode: "20220"
      },
      telephone: "907-949-4470",
      creditCard: {
        network: "Amex",
        number: "4532636730015542"
      }
    }
  }
]

const stores = [
  {
    id: 301,
    data: {
      name: "DC Fruits",
      address: {
        street: "13 Pierstorff Drive",
        city: "Washington",
        state: "DC",
        zipCode: "20220"
      }
    }
  },
  {
    id: 302,
    data: {
      name: "Party Supplies",
      address: {
        street: "7529 Capitalsaurus Court",
        city: "Washington",
        state: "DC",
        zipCode: "20002"
      }
    }
  },
  {
    id: 303,
    data: {
      name: "Foggy Bottom Market",
      address: {
        street: "4 Florida Ave",
        city: "Washington",
        state: "DC",
        zipCode: "20037"
      }
    }
  }
]

const products = [
  {
    id: 201,
    data: {
      name: "cups",
      description: "Translucent 9 Oz, 100 ct",
      price: 6.98,
      quantity: 100,
      store: Ref(Collection("stores"), "302"),
      backorderLimit: 5,
      backordered: false
    }
  },
  {
    id: 202,
    data: {
      name: "pinata",
      description: "Original Classic Donkey Pinata",
      price: 24.99,
      quantity: 20,
      store: Ref(Collection("stores"), "302"),
      backorderLimit: 10,
      backordered: false
    }
  },
  {
    id: 203,
    data: {
      name: "pizza",
      description: "Frozen Cheese",
      price: 4.99,
      quantity: 100,
      store: Ref(Collection("stores"), "303"),
      backorderLimit: 15,
      backordered: false
    }
  },
  {
    id: 204,
    data: {
      name: "avocados",
      description: "Conventional Hass, 4ct bag",
      price: 3.99,
      quantity: 1000,
      store: Ref(Collection("stores"), "301"),
      backorderLimit: 15,
      backordered: false
    }
  },
  {
    id: 205,
    data: {
      name: "limes",
      description: "Conventional, 1 ct",
      price: 0.35,
      quantity: 1000,
      store: Ref(Collection("stores"), "301"),
      backorderLimit: 15,
      backordered: false
    }
  },
  {
    id: 206,
    data: {
      name: "limes",
      description: "Organic, 16 oz bag",
      price: 3.49,
      quantity: 50,
      store: Ref(Collection("stores"), "301"),
      backorderLimit: 15,
      backordered: false
    }
  },
  {
    id: 207,
    data: {
      name: "limes",
      description: "Conventional, 16 oz bag",
      price: 2.99,
      quantity: 30,
      store: Ref(Collection("stores"), "303"),
      backorderLimit: 15,
      backordered: false
    }
  },
  {
    id: 208,
    data: {
      name: "cilantro",
      description: "Organic, 1 bunch",
      price: 1.49,
      quantity: 100,
      store: Ref(Collection("stores"), "301"),
      backorderLimit: 15,
      backordered: false
    }
  },
  {
    id: 209,
    data: {
      name: "pinata",
      description: "Giant Taco Pinata",
      price: 23.99,
      quantity: 10,
      store: Ref(Collection("stores"), "302"),
      backorderLimit: 10,
      backordered: false
    }
  }
]

const orders = [
  {
    customer: Ref(Collection("customers"), "103"),
    cart: [
      {
        product: Ref(Collection("products"), "201"),
        quantity: 25,
        price: 6.98
      },
      {
        product: Ref(Collection("products"), "203"),
        quantity: 10,
        price: 4.99
      }
    ],
    status: "processing",
    creationDate: Time("2022-06-08T16:24:53.202530Z"),
    deliveryAddress: {
      street: "5 Troy Trail",
      city: "Washington",
      state: "DC",
      zipCode: "20220"
    },
    creditCard: {
      network: "Visa",
      number: "4532636730015542"
    }
  },
  {
    customer: Ref(Collection("customers"), "102"),
    cart: [
      {
        product: Ref(Collection("products"), "203"),
        quantity: 15,
        price: 4.99
      },
      {
        product: Ref(Collection("products"), "202"),
        quantity: 45,
        price: 24.99
      }
    ],
    status: "processing",
    creationDate: Time("2022-06-08T16:24:53.202530Z"),
    deliveryAddress: {
      street: "72 Waxwing Terrace",
      city: "Washington",
      state: "DC",
      zipCode: "20002"
    },
    creditCard: {
      network: "Visa",
      number: "4916112310613672"
    }
  },
  {
    customer: Ref(Collection("customers"), "101"),
    cart: [
      {
        product: Ref(Collection("products"), "204"),
        quantity: 10,
        price: 3.99
      },
      {
        product: Ref(Collection("products"), "206"),
        quantity: 5,
        price: 3.49
      },
      {
        product: Ref(Collection("products"), "208"),
        quantity: 20,
        price: 1.49
      }
    ],
    status: "processing",
    creationDate: Time("2022-06-08T16:24:53.202530Z"),
    deliveryAddress: {
      street: "87856 Mendota Court",
      city: "Washington",
      state: "DC",
      zipCode: "20220"
    },
    creditCard: {
      network: "Visa",
      number: "4556781272473393"
    }
  }      
]

export { customers, stores, products, orders}