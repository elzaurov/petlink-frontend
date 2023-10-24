import { lang } from './lang';

export const ValidationRules = {
  email: [
    {
      required: true,
      message: lang.validation.required,
    },
    {
      type: 'email',
      message: lang.validation.validEmail,
    },
  ],
  password: [
    {
      required: true,
      message: lang.validation.required,
    },
    {
      min: 6,
      message: lang.validation.password,
    },
  ],
  passwordMatch: [
    {
      required: true,
      message: lang.validation.required,
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(lang.validation.noPasswordMatch);
      },
    }),
  ],
  input: [
    {
      required: true,
      message: lang.validation.required,
    },
  ],
  select: [
    {
      required: true,
      message: lang.validation.required,
    },
  ],
  radio: [
    {
      required: true,
      message: lang.validation.required,
    },
  ],
  bank: [
    {
      required: true,
      message: lang.validation.required,
    },
    {
      len: 11,
      message: lang.validation.len,
    },
  ],
  uploader: [
    {
      required: true,
      message: lang.validation.required,
    },
    () => ({
      validator: (_, value) => {
        if (value.file.status === 'error') {
          return Promise.reject(
            'Filopplasting mislyktes. Vennligst prøv igjen.'
          );
        }
        return Promise.resolve();
      },
    }),
  ],
};
