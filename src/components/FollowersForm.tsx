import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// TODO: apply github username validation rules, eg https://github.com/shinnn/github-username-regex
const yupUserValidation = yup
  .string()
  .required('Required')
  .min(4, 'Min 4 chars')
  .matches(/^[a-zA-Z0-9]+$/, 'Only (a-Z 0-9) allowed');

const validationSchema = yup.object().shape({
  user1: yupUserValidation,
  user2: yupUserValidation,
});

export interface FormValues {
  user1: string;
  user2: string;
}

interface FollowersFormProps {
  onSubmit: (values: FormValues, formikHelpers?: FormikHelpers<FormValues>) => void;
}

function FollowersForm({ onSubmit }: FollowersFormProps) {
  const formik = useFormik({
    initialValues: {
      user1: '',
      user2: '',
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display='flex' justifyContent='space-between' columnGap={2}>
        <TextField
          name='user1'
          label='user1'
          value={formik.values.user1}
          onChange={formik.handleChange}
          error={formik.touched.user1 && Boolean(formik.errors.user1)}
          helperText={(formik.touched.user1 && formik.errors.user1) || ' '}
          size='small'
        />

        <TextField
          name='user2'
          label='user2'
          value={formik.values.user2}
          onChange={formik.handleChange}
          error={formik.touched.user2 && Boolean(formik.errors.user2)}
          helperText={(formik.touched.user2 && formik.errors.user2) || ' '}
          size='small'
        />

        <Box>
          <Button variant='contained' type='submit'>
            Search
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default FollowersForm;
