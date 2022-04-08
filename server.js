import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";
// import fetch from 'node-fetch'
import axios from "axios";
import bodyParser from 'body-parser'
import { GraphQLClient, gql } from 'graphql-request'


const host = "127.0.0.1";
const port = 5000;
dotenv.config();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST } = process.env;

const shopes = {};

Shopify.Context.initialize({
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST,
    IS_EMBEDDED_APP:false
   
});
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/",async(req, res) => {
    
    console.log('******** path / start');
    console.log('from front: ',req.query.shop)
    
    if(typeof shopes[req.query.shop] !== "undefined")
    {
        // const products = await axios.get(`https://${req.query.shop}/admin/api/2022-04/products.json`,{
        //   headers:{
        //     "X-Shopify-Access-Token": shopes[req.query.shop].accessToken
        //   }
        // })
    
         
        const queryString = gql`{
            products (first: 3) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }`;
        
           
              const endpoint = 'https://developer-2022.myshopify.com/admin/api/2022-04/graphql.json'

              const graphQLClient = new GraphQLClient(endpoint, {
                headers: {
                  "X-Shopify-Access-Token": shopes[req.query.shop].accessToken
                },
              })
            
              const data = await graphQLClient.request(queryString)
              console.log(JSON.stringify(data, undefined, 2))


 

        res.redirect(`https://myfront.netlify.app?${shopes[req.query.shop].accessToken}`)
        
    }
    else
    {
        res.redirect(`/auth?shop=${req.query.shop}`);
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
res.redirect(`https://${shopes[shopSession.shop].shop}/admin/apps/node-oauth-2`);
})



app.listen(port, () => console.log(`server is running at https:\\${host}:${port}`));

