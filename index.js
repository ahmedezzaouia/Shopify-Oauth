import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";


const host = "127.0.0.1";
const port = 3000;
dotenv.config();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST } = process.env;

const shopes = {};

Shopify.Context.initialize({
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: true,
});
const app = express();

app.get("/", (req, res) => {
    
console.log(req.query)

    console.log('path / start');
    
    if(typeof shopes[req.query.shop] !== "undefined")
    {
        res.send("Hello World");
    }
    else
    {
        res.redirect(`/auth?shop=${req.query.shop}`)
    }
});

app.get('/auth',async (req,res)=>{
    console.log('path /auth start');

const authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    req.query.shop,
    '/auth/callback',
    false,
)

res.redirect(authRoute);
})

app.get('/auth/callback',async (req,res)=>{
console.log('path /auth/callback start');
console.log(`the shop is : ${req.query}`)

const query =  req.query;
const shopSession =  await Shopify.Auth.validateAuthCallback({
    req,
    res,
    query
}) 
console.log('shopify validate',shopSession);
shopes[shopSession.shop] = shopSession
res.redirect(`https://${shopSession.shop}/admin/apps/node-oauth-2`);
})

app.listen(port, () => console.log(`server is running at https:\\${host}:${port}`));
