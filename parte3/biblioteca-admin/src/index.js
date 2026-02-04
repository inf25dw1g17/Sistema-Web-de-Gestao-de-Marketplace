import * as React from "react";
import { createRoot } from "react-dom/client";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

import { AuthorList, AuthorCreate, AuthorEdit } from "./authors";
import { BookList, BookCreate, BookEdit } from "./books";

const dataProvider = simpleRestProvider("http://localhost:3001");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="authors"
      list={AuthorList}
      create={AuthorCreate}
      edit={AuthorEdit}
    />
    <Resource
      name="books"
      list={BookList}
      create={BookCreate}
      edit={BookEdit}
    />
  </Admin>
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
