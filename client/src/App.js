import './App.css';
import axios from "axios";


function App() {
console.log(window.location.href);
if(window.location.search)
{
  window.location.replace(
    "/",);
  console.log('go go to another')
}
const requestShopify = async()=>{


  // const data = await axios.get('https://d4af-197-230-240-146.ngrok.io?shop=developer-2022.myshopify.com')
  // console.log(data)
  window.location.replace('https://d4af-197-230-240-146.ngrok.io?shop=developer-2022.myshopify.com')

}

  return (
    <div className="App">
     <button onClick={requestShopify}>sign with Shopify</button>
     <h1>{window.location.href}</h1>
    </div>
  );
}

export default App;
