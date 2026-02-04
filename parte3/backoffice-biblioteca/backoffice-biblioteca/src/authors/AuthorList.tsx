import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

export const AuthorList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
