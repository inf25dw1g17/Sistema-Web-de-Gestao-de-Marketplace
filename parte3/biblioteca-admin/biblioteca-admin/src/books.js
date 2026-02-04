import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export const BookList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="authorId" reference="authors">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export const BookCreate = props => (
  <Create {...props} redirect="list">
    <SimpleForm>
      <TextInput source="title" />
      <ReferenceInput source="authorId" reference="authors">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export const BookEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <ReferenceInput source="authorId" reference="authors">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
