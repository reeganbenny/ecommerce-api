const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Variants = require("../models/variants");

const sampleProduct1 = {
  name: "T-Shirt",
  description: "Comfortable and stylish T-Shirt.",
  price: 200,
};

const sampleProduct2 = {
  name: "T-Shirt 2",
  description: "Comfortable and stylish T-Shirt.",
  price: 300,
};

const sampleProduct3 = {
  name: "T-Shirt 3",
  description: "Comfortable and stylish T-Shirt.",
  price: 300,
};

const testDBUrl = process.env.TEST_MONGODBURI;
beforeAll(async () => {
  await mongoose.connect(testDBUrl);
  server = app.listen(3000);
});

afterAll(async () => {
  await Product.deleteMany({});
  await Variants.deleteMany({});
  await mongoose.connection.close();
});

describe("Product API", () => {
  test("should create a new product", async () => {
    const response = await request(app).post("/products").send(sampleProduct1);

    expect(response.status).toBe(201);
    // expect(response.body.message).toBe("Product created successfully");

    const product = await Product.findOne({ name: "T-Shirt" });
    expect(product).toBeTruthy();
  });
});

describe("GET /products/search", () => {
  beforeAll(async () => {
    // Delete all products and varaints
    await Product.deleteMany({});
    await Variants.deleteMany({});
    // Insert a product with variants for testing the search functionality
    const products = await Product.create(sampleProduct1);
    const sampleVariant = {
      name: "Blue T-Shirt",
      SKU: "ABC-TS-B-S",
      additionalCost: 0,
      stockCount: 10,
      productId: products._id,
    };
    const variant = await Variants.create(sampleVariant);
    const productUpdate = await Product.updateOne(
      {
        _id: products._id,
      },
      {
        $addToSet: { variants: variant._id },
      }
    );
  });

  it("should search products by name, description, or variant name", async () => {
    const searchTerm = "Blue";
    const response = await request(app).get(
      `/products/search?val=${searchTerm}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    // Validate that the searched product and variant are present in the response
    const product = response.body[0];
    expect(product.name).toBe(sampleProduct1.name);
    expect(product.variants).toHaveLength(1);
    expect(product.variants[0].name).toContain(searchTerm);
  });
});

describe("GET /products", () => {
  beforeAll(async () => {
    // Delete all products and varaints
    await Product.deleteMany({});
    await Variants.deleteMany({});
    // Insert a product with variants for testing the search functionality
    const products = await Product.create(sampleProduct1);
    const sampleVariant = {
      name: "Blue T-Shirt",
      SKU: "ABC-TS-B-S",
      additionalCost: 0,
      stockCount: 10,
      productId: products._id,
    };
    const variant = await Variants.create(sampleVariant);
    const productUpdate = await Product.updateOne(
      {
        _id: products._id,
      },
      {
        $addToSet: { variants: variant._id },
      }
    );

    const products1 = await Product.create(sampleProduct2);
    const sampleVariant2 = {
      name: "Blue T-Shirt",
      SKU: "ABC-TS-B-S",
      additionalCost: 0,
      stockCount: 10,
      productId: products1._id,
    };
    const variant1 = await Variants.create(sampleVariant2);
    const productUpdate1 = await Product.updateOne(
      {
        _id: products1._id,
      },
      {
        $addToSet: { variants: variant1._id },
      }
    );
  });
  it("should get all products", async () => {
    // Act
    const response = await request(app).get("/products");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(2);
  });
});
