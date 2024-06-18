import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.jsx";
//apollo client
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // url of graphql server
  cache: new InMemoryCache(), // apollo client puts the results into cache after querying them.
  credentials: 'include' // this tells apollo client to send cookies along with every request to the server.
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>

        <App />

        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>
);
