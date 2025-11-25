// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
  cache: new InMemoryCache(),
});

const query = gql`
  query {
    allBooks {
      title
      published
      author
      genres
    }
  }
`;

client.query({ query }).then((response) => {
  console.log("getting books", response.data);
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
