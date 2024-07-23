import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import styles from "./EditProfilePage.module.scss";
import { IEditProfileForm } from "../../types/IEditProfileForm";
import { useAuth } from "../AuthProvider/AuthProvider";
import { IErrorUser } from "../../types/IErrorUser";
import { editProfileUser } from "../../services/userAPI";

const schema: yup.ObjectSchema<IEditProfileForm> = yup
  .object({
    username: yup
      .string()
      .required("No email provided.")
      .min(3, "Username is too short - should be 3 chars minimum.")
      .max(20, "Username is too short - should be 20 chars maximum."),
    email: yup
      .string()
      .email("Please enter a valid email")
      .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email")
      .required("No email provided."),
    password: yup
      .string()
      .required("No password provided.")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .max(40, "Password is too short - should be 40 chars maximum."),
    image: yup
      .string()
      .matches(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i, "Invalid url.")
      .min(0),
  })
  .required();

function EditProfilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<IErrorUser | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { user, editUser } = useAuth();
  const token = localStorage.getItem("token");

  const successModal = useCallback(() => {
    messageApi.open({
      type: "success",
      content: "Edit profile success.",
    });
  }, [messageApi]);

  const errorModal = useCallback(async () => {
    await messageApi.open({
      type: "error",
      content: error?.editProfileUser?.message,
    });
  }, [error?.editProfileUser?.message, messageApi]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data: IEditProfileForm) => {
    setIsLoading(true);
    editProfileUser({ token, ...data }).then((res) => {
      if (res.user) {
        editUser(res.user);
        setError(null);
        setSuccess(true);
        setIsLoading(false);
      }
      if (res.editProfileUser) {
        setError(res);
        setSuccess(false);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (success) {
      successModal();
      setSuccess(false);
    }
    if (error?.editProfileUser) {
      errorModal();
    }
  }, [success, error, successModal, errorModal]);

  return (
    <>
      {contextHolder}
      <div className={styles.editProfileWrapper}>
        <form
          className={styles.editProfileForm}
          onSubmit={handleSubmit((data) => handleSubmitForm(data))}
        >
          <h3>Edit Profile</h3>
          <span>
            <label htmlFor="username">Username</label>
            <input
              className={
                errors.username ||
                error?.editProfileUser?.message.includes("username")
                  ? styles.error
                  : null
              }
              type="text"
              id="username"
              placeholder="Username"
              defaultValue={user?.username}
              {...register("username")}
            />
            {errors.username && <p>{errors.username.message}</p>}
            {error?.editProfileUser?.message.includes("username") && (
              <p>{"This username is already in use."}</p>
            )}
          </span>
          <span>
            <label htmlFor="email">Email address</label>
            <input
              className={
                errors.email ||
                error?.editProfileUser?.message.includes("email")
                  ? styles.error
                  : null
              }
              id="email"
              placeholder="Email address"
              defaultValue={user?.email}
              {...register("email")}
            />
            {errors.email && <p>{errors.email.message}</p>}
            {error?.editProfileUser?.message.includes("email") && (
              <p>{"This email is already in use."}</p>
            )}
          </span>
          <span>
            <label htmlFor="password">New password</label>
            <input
              className={errors.password ? styles.error : null}
              type="password"
              id="password"
              placeholder="New password"
              {...register("password")}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </span>
          <span>
            <label htmlFor="avatar">{`Avatar Image (url)`}</label>
            <input
              className={errors.image ? styles.error : null}
              id="avatar"
              placeholder="Avatar Images"
              defaultValue={user?.image}
              {...register("image")}
            />
            {errors.image && <p>{errors.image.message}</p>}
          </span>
          <span className={styles.editProfileSave}>
            <input type="submit" value={isLoading ? "Загрузка..." : "Save"} />
          </span>
        </form>
      </div>
    </>
  );
}

export default EditProfilePage;
