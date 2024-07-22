import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect } from 'react';
import styles from './ArticleEditPage.module.scss';
import { editArticle } from '../../store/services/articlesAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { ICreateArticleForm } from '../../types/ICreateArticleForm';

const schema: yup.ObjectSchema<ICreateArticleForm> = yup
  .object({
    title: yup.string().required('No title provided.'),
    description: yup.string().required('No description provided.'),
    body: yup.string().required('No text provided.'),
    tagList: yup.array(yup.string().required('fff')),
  })
  .required();

const ArticleEditPage: React.FC = () => {
  const { slug } = useParams();
  const { article, isLoading, success } = useAppSelector((state) => state.articles);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tagList: article?.tagList,
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  });

  const handleSubmitForm = (data: ICreateArticleForm) => {
    dispatch(editArticle({ ...data, slug }));
  };

  useEffect(() => {
    if (success) {
      navigate(`/`);
    }
  }, [success]);

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
            defaultValue={article?.title}
            {...register('title')}
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
            defaultValue={article?.description}
            {...register('description')}
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
            defaultValue={article?.body}
            {...register('body')}
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
                            (errors.tagList && errors.tagList[index] && styles.error) +
                            ' ' +
                            styles.tag
                          }
                          {...register(`tagList.${index}`, { required: true })}
                        />
                        <button className={styles.btnDeleteTag} onClick={() => remove(index)}>
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
                append('');
              }}
            >
              Add tag
            </button>
          </div>
        </div>
        <span className={styles.editProfileSave}>
          <input type="submit" value={isLoading ? 'Загрузка...' : 'Send'} />
        </span>
      </form>
    </div>
  );
};

export default ArticleEditPage;
