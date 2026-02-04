import {
  List,
  Datagrid,
  TextField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
} from "react-admin";

export const AuthorList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
    </Datagrid>
  </List>
);

export const AuthorCreate = props => (
  <Create {...props} redirect="list">
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export const AuthorEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
