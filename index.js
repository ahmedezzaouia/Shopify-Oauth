import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";
import fetch from 'node-fetch'
import axios from "axios";



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
    IS_EMBEDDED_APP: false,
});
const app = express();

app.get("/",async(req, res) => {
    
    console.log('******** path / start');
    console.log(shopes[req.query.shop])
    
    if(typeof shopes[req.query.shop] !== "undefined")
    {
        const products = await axios.get(`https://${req.query.shop}/admin/api/2022-04/products.json`,{
          headers:{
            "X-Shopify-Access-Token": shopes[req.query.shop].accessToken
          }
        })
    
         
        console.log(products.data.products)
        res.send(products.data.products);
        
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
    const products = await axios.get(url,{
      headers:{
        "X-Shopify-Access-Token": accessToken
      }
    })

return products
}