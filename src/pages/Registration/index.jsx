import React from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {fetchAuth, fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {Navigate} from "react-router-dom";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isValid}
  } = useForm({
    defaultValues: {
      fullName: 'Dolly',
      email: 'test1@mail.ru',
      password: '12'
    },
    mode: 'onChange'
  })

  const onSubmit = async (data) => {
    const result = await dispatch(fetchRegister(data));

    if (!result.payload) {
      return alert('Failed to Register');
    }

    if ('token' in result.payload) {
      localStorage.setItem('token', result.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Full Name"
          fullWidth
          error={!!errors.fullName?.message}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Enter your name' })}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
        />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register('password', { required: 'Введите пароль' })}
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Sign up
        </Button>
      </form>
    </Paper>
  );
};
