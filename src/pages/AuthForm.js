import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Icon } from "@iconify/react/dist/iconify.js";
import * as Yup from 'yup';
import apiClient from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import toast from "react-hot-toast";
import { useAuth } from '../context/auth';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleFormType = () => {
    setIsRegister(!isRegister);
  };

  const validationSchema = Yup.object({
    name: isRegister ? Yup.string().required('Name is required') : null,
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/\d/, 'Password must contain at least one digit')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
      .required('Password is required'),
  });

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const endpoint = isRegister ? '/api/register' : '/api/login';
      if (!isRegister) {
        delete values.name;
      }
      const response = await apiClient().post(endpoint, {
        ...values
      });
      if (!isRegister && response.data) {
        localStorage.setItem('authToken', JSON.stringify(response.data));
        console.log('✌️response.data --->', response.data);
        setAuth({
          user: response.data.user,
          token: response.data.token,
        });
        navigate('/documents');
      }
      toast.success(`${isRegister ? 'Registered' : 'Logged in'} successfully`);
      if (isRegister) {
        setIsRegister(false);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const CustomInput = ({ field, form, ...props }) => (
    <div className="relative">
      <input
        {...field}
        {...props}
        className="w-full px-4 py-3 text-gray-200 bg-gray-800 transition-all duration-300 ease-in-out border-b-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-0 focus:scale-105"
      />
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 transition-transform duration-300 origin-left"></div>
    </div>
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-lg bg-gray-800 p-12 rounded-lg shadow-lg m-3 sm:m-0">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">{isRegister ? 'Register' : 'Login'}</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="space-y-6">
                  {isRegister && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
                      <Field
                        name="name"
                        component={CustomInput}
                        placeholder="Enter your name"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                    <Field
                      name="email"
                      component={CustomInput}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                    <div className="relative">
                      <Field
                        name="password"
                        component={CustomInput}
                        type={passwordShown ? 'text' : 'password'}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-300"
                      >
                        {passwordShown ? <Icon icon="mingcute:eye-2-fill" /> : <Icon icon="mdi:eye-off" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    {isRegister ? 'Register' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="text-center mt-6">
              {isRegister ? (
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <button onClick={toggleFormType} className="font-medium text-orange-500 hover:text-orange-400">
                    Login here
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button onClick={toggleFormType} className="font-medium text-orange-500 hover:text-orange-400">
                    Register here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthForm;
