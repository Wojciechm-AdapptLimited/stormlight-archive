import * as dotenv from "dotenv";
import * as process from "process";

import express from "express";
import session from "express-session";

import {UnitOfWork} from "@/base/unit_of_work.js";
import {type ProductMiniDto, type ProductDto} from "@/model/product.js";
import {CartItemService} from "@/services/cart_item_service.js";
import {ProductService} from "@/services/product_service.js";
import {CartDto, CartItemDto} from "@/model/cart_item.js";

dotenv.config();

const sql = new UnitOfWork({
    host: process.env["DB_HOST"],
    port: Number(process.env["DB_PORT"]),
    username: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_DATABASE"],
});

const productService = new ProductService(sql);
const cartItemService = new CartItemService(sql);

const app = express();

const sess = {
    secret: process.env["SESSION_SECRET"] ?? "secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
};

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sess.cookie = {
        secure: true,
        sameSite: "none",
    };
}

app.use(session(sess));

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (_req, res) => {
    const products = await productService.getProducts();

    if (!products.success || !products.value) {
        res.status(400).send(products.error);
        return;
    }

    const productDtos = products.value.map(product => {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            image: product.image,
        } as ProductMiniDto;
    });

    res.json(productDtos);
});

app.get("/products/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).send("Invalid request");
        return;
    }

    const product = await productService.getProductById(id);

    if (!product.success || !product.value) {
        res.status(404).send(product.error);
        return;
    }

    const productDto = {
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        quantity: product.value.quantity,
        category: product.value.category,
        image: product.value.image,
        description: product.value.description,
    } as ProductDto;

    res.json(productDto);
});

app.get("/cart", async (req, res) => {
    const sessionId = req.sessionID;
    const cart = await cartItemService.getCart(sessionId);

    if (!cart.success || !cart.value) {
        res.status(400).send(cart.error);
        return;
    }

    const cartDtos = cart.value.map(cartItem => {
        return {
            quantity: cartItem.quantity,
            productId: cartItem.productId,
        } as CartItemDto;
    });

    res.json(cartDtos);
});

app.get("/cart/mini", async (req, res) => {
    const sessionId = req.sessionID;

    const total = await cartItemService.getCartTotal(sessionId);
    const quantity = await cartItemService.getCartQuantity(sessionId);

    if (!total.success || total.value == undefined) {
        res.status(400).send(total.error);
        return;
    }

    if (!quantity.success || quantity.value == undefined) {
        res.status(400).send(quantity.error);
        return;
    }

    const cartDto = {
        total: total.value,
        quantity: quantity.value,
    } as CartDto;

    res.json(cartDto);
});

app.post("/cart/add/:id", async (req, res) => {
    const sessionId = req.sessionID;

    const productId = Number(req.params.id);
    const quantity = req.query["quantity"] ? Number(req.query["quantity"]) : undefined;

    if (isNaN(productId) || quantity == undefined || isNaN(quantity)) {
        res.status(400).send("Invalid request");
        return;
    }

    const result = await cartItemService.addToCart(sessionId, productId, quantity);

    if (result.success) {
        res.redirect("/cart");
    } else {
        res.status(400).send(result.error);
    }
});

app.post("/cart/checkout", async (req, res) => {
    const sessionId = req.sessionID;

    const result = await cartItemService.checkoutCart(sessionId);

    if (result.success) {
        res.redirect("/products");
    } else {
        res.status(400).send(result.error);
    }
});

app.post("/cart/clear", async (req, res) => {
    const sessionId = req.sessionID;

    const result = await cartItemService.clearCart(sessionId);

    if (result.success) {
        res.redirect("/products");
    } else {
        res.status(400).send(result.error);
    }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
