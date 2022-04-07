import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";
import fetch from 'node-fetch'



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

app.get("/",async(req, res) => {
    
    console.log('******** path / start');
    console.log(shopes[req.query.shop])
    
    if(typeof shopes[req.query.shop] !== "undefined")
    {
        console.log('shop == ',req.query.shop)
        console.log('token == ',shopes[req.query.shop].accessToken)
        const products = await getProducts(`https://${req.query.shop}/admin/api/2022-04/graphql.json`, shopes[req.query.shop].accessToken);
        console.log(products)
        res.send("hello akdjkad");
    }
    else
    {
        res.redirect(`/auth?shop=${req.query.shop}`)
    }
});


app.get('/auth',async (req,res)=>{
    console.log('******** path /auth start');

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
console.log('******** path /auth/callback start');

const shopSession =  await Shopify.Auth.validateAuthCallback(
    req,
    res,
    req.query
) 
console.log('shopify validate',shopSession);
shopes[shopSession.shop] = shopSession
res.redirect(`http://${shopSession.shop}/admin/apps/node-oauth-2`);
})



app.listen(port, () => console.log(`server is running at https:\\${host}:${port}`));


async function  getProducts(url,accessToken)  {
    console.log('get profucts token :',accessToken)
    const products = await fetch(url,
    {
        headers:{
            "Content-type": "application/json",
            "X-Shopify-Access-Token": `${accessToken}`,

        },
        method: "POST",
          body: JSON.stringify({
            query: `
            {
                products(first: 5) {
                  edges {
                    node {
                      id
                      handle
                    }
                  }
                  pageInfo {
                    hasNextPage
                  }
                }
              }
                `,
          }),
    })
return products
}