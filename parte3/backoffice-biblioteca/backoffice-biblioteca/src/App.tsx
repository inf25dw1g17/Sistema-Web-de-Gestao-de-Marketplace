import { Admin, Resource } from 'react-admin';
import dataProvider from './dataProvider';

import { AuthorList } from './authors/AuthorList';
import { AuthorCreate } from './authors/AuthorCreate';
import { AuthorEdit } from './authors/AuthorEdit';

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="authors"
      list={AuthorList}
      create={AuthorCreate}
      edit={AuthorEdit}
    />
  </Admin>
);

export default App;
