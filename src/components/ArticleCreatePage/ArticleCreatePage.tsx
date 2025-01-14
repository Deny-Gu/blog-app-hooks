import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import styles from "./ArticleCreatePage.module.scss";
import { useNavigate } from "react-router-dom";
import { ICreateArticleForm } from "../../types/ICreateArticleForm";
import { createArticle } from "../../services/articlesAPI";
import ErrorBlock from "../ErrorBlock/ErrorBlock";

const schema: yup.ObjectSchema<ICreateArticleForm> = yup
  .object({
    title: yup.string().required("No title provided."),
    description: yup.string().required("No description provided."),
    body: yup.string().required("No body provided."),
    tagList: yup.array(yup.string().required("fff").trim()),
  })
  .required();

function ArticleCreatePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tagList: [" "],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagList",
  });

  const handleSubmitForm = (data: ICreateArticleForm) => {
    setIsLoading(true);
    createArticle(data).then((res) => {
      setSuccess(true);
      setIsLoading(false);
      if (res.message) {
        setError(res.message);
        setSuccess(false);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (success) {
      navigate(`/`);
    }
  }, [navigate, success]);

  if (error) {
    return <ErrorBlock />;
  }

  return (
    <div className={styles.createArticleWrapper}>
      <form
        className={styles.createArticleForm}
        onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      >
        <h3>Create new article</h3>
        <span>
          <label htmlFor="title">Title</label>
          <input
            className={errors.title ? styles.error : null}
            type="text"
            id="title"
            placeholder="Title"
            {...register("title")}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </span>
        <span>
          <label htmlFor="description">Short description</label>
          <input
            className={errors.description ? styles.error : null}
            type="text"
            id="description"
            placeholder="Description"
            {...register("description")}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </span>
        <span>
          <label htmlFor="body">Text</label>
          <textarea
            className={errors.body ? styles.error : null}
            id="body"
            rows={6}
            placeholder="Text"
            {...register("body")}
          />
          {errors.body && <p>{errors.body.message}</p>}
        </span>
        <div className={styles.tagsWrapper}>
          <div className={styles.tagsLeftBlock}>
            <div className={styles.tagItem}>
              <span>
                <label htmlFor="tags">Tags</label>
                <ul>
                  {fields.map((item, index) => {
                    return (
                      <li className={styles.tagItem} key={item.id}>
                        <input
                          className={
                            (errors.tagList &&
                              errors.tagList[index] &&
                              styles.error) +
                            " " +
                            styles.tag
                          }
                          {...register(`tagList.${index}`, { required: true })}
                        />
                        <button
                          className={styles.btnDeleteTag}
                          onClick={() => remove(index)}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </span>
            </div>
          </div>
          <div className={styles.tagsRightBlock}>
            <button
              className={styles.btnAddTag}
              type="button"
              onClick={() => {
                append("");
              }}
            >
              Add tag
            </button>
          </div>
        </div>
        <span className={styles.editProfileSave}>
          <input type="submit" value={isLoading ? "Загрузка..." : "Send"} />
        </span>
      </form>
    </div>
  );
}

export default ArticleCreatePage;
