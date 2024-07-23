import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignInPage.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { useAuth } from "../AuthProvider/AuthProvider";
import { ISignInForm } from "../../types/ISignInForm";
import { IErrorUser } from "../../types/IErrorUser";
import { logUser } from "../../services/userAPI";

const schema: yup.ObjectSchema<ISignInForm> = yup
  .object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("No email provided."),
    password: yup.string().required("No password provided."),
  })
  .required();

function SignInPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<IErrorUser | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { editUser, isAuth, loginAuth } = useAuth();
  const navigate = useNavigate();

  const errorModal = useCallback(async () => {
    await messageApi.open({
      type: "error",
      content: error?.logUser?.message,
    });
  }, [error?.logUser?.message, messageApi]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data: ISignInForm) => {
    setIsLoading(true);
    logUser(data).then((res) => {
      if (res.user) {
        editUser(res.user);
        loginAuth();
        setIsLoading(false);
      }
      if (res.logUser) {
        setError(res);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
    if (error) {
      errorModal();
    }
  }, [isAuth, error, navigate, errorModal]);

  return (
    <>
      {contextHolder}
      <div className={styles.signInWrapper}>
        <form
          className={styles.signInForm}
          onSubmit={handleSubmit((data) => handleSubmitForm(data))}
        >
          <h3>Sign In</h3>
          <span>
            <label htmlFor="email">Email address</label>
            <input
              className={
                errors.email ||
                error?.logUser?.fields?.includes("email or password")
                  ? styles.error
                  : null
              }
              id="email"
              placeholder="Email address"
              {...register("email", { required: true })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </span>
          <span>
            <label htmlFor="password">Password</label>
            <input
              className={
                errors.password ||
                error?.logUser?.fields?.includes("email or password")
                  ? styles.error
                  : null
              }
              type="password"
              id="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </span>
          <span className={styles.signUp}>
            <input type="submit" value={isLoading ? "Загрузка..." : "Login"} />
            Don’t have an account?
            <Link to="/sign-up"> Sign Up</Link>.
          </span>
        </form>
      </div>
    </>
  );
}

export default SignInPage;
