import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import styles from "./ArticleEditPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ICreateArticleForm } from "../../types/ICreateArticleForm";
import { Article } from "../../types/Article";
import { editArticle, getArticle } from "../../services/articlesAPI";
import ErrorBlock from "../ErrorBlock/ErrorBlock";
import Loader from "../Loader/Loader";

const schema: yup.ObjectSchema<ICreateArticleForm> = yup
  .object({
    title: yup.string().required("No title provided."),
    description: yup.string().required("No description provided."),
    body: yup.string().required("No text provided."),
    tagList: yup.array(yup.string().required("fff")),
  })
  .required();

function ArticleEditPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getArticle(slug).then((res) => {
        setArticle(res);
        setIsLoading(false);
        if (res.message) {
          setError(res.message);
          setSuccess(false);
          setIsLoading(false);
        }
      });
    }
  }, [slug, navigate]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    values: {
      title: article?.title || "",
      description: article?.description || "",
      body: article?.body || "",
      tagList: article?.tagList,
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagList",
  });

  const handleSubmitForm = (data: ICreateArticleForm) => {
    setSuccess(false);
    editArticle({ ...data, slug })
      .then((res) => {
        setArticle(res);
        setSuccess(true);
        navigate(`/`);
      })
      .catch((error) => setError(error));
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorBlock />;
  }

  return (
    <div className={styles.createArticleWrapper}>
      <form
        className={styles.createArticleForm}
        onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      >
        <h3>Edit article</h3>
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
          <input type="submit" value={!success ? "Загрузка..." : "Send"} />
        </span>
      </form>
    </div>
  );
}

export default ArticleEditPage;
