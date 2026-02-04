import { Edit, SimpleForm, TextInput } from 'react-admin';

export const AuthorEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
