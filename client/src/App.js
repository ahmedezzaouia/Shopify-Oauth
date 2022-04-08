import "./App.css";
import React, { useEffect } from "react";
import axios from "axios";

function App() {
  if (window.location.search) {
    localStorage.setItem("user", window.location.search);
  }
  if (window.location.ancestorOrigins[0]) {
    window.parent.location.replace("https://myfront.netlify.app");
  }

  const requestShopify = async () => {
    window.location.replace("https://e9b2-197-230-240-146.ngrok.io?shop=developer-2022.myshopify.com");
  };

  useEffect(() => {

    const queryString = `{
    products (first: 3) {
      edges {
        node {
          id
          title
        }
      }
    }
  }`;

    axios
      .post("https://developer-2022.myshopify.com/admin/api/2022-04/graphql.json", {
        headers: {
          "X-Shopify-Access-Token": `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`,
          "Access-Control-Allow-Origin":"*"
        },
        data:{
          query: queryString
        }
      })
      .then((data) => console.log(data));

  }, []);

  if (!window.location.ancestorOrigins[0]) {
    return (
      <div className="App">
        {!localStorage.getItem("user") ? (
          <button onClick={requestShopify}>sign with Shopify</button>
        ) : (
          <button>sign out</button>
        )}

        <h1>{window.location.href}</h1>
        <h2>{window.location.ancestorOrigins[0]}</h2>
      </div>
    );
  }
}

export default App;
