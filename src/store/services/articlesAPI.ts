import { createAsyncThunk } from '@reduxjs/toolkit';
import { ArticlesSuccess } from '../../types/Articles';
import { Article } from '../../types/Article';
import axios from 'axios';
import { IRejectValue } from '../../types/IRejectValue';

const urlAPI = 'https://api.realworld.io/api';

export const fetchArticles = createAsyncThunk<
  ArticlesSuccess,
  number,
  { rejectValue: IRejectValue }
>('articles/fetchArticles', async function (pagination: number, { rejectWithValue }) {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${urlAPI}/articles?limit=5&offset=${pagination}`, {
      headers: {
        Authorization: token ? `Token ${token}` : '',
      },
    });
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(' and ');
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return rejectWithValue(obj);
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return rejectWithValue(obj);
      }
    }
  }
});

export const fetchArticle = createAsyncThunk<Article, string, { rejectValue: IRejectValue }>(
  'articles/fetchArticle',
  async function (slug: string, { rejectWithValue }) {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${urlAPI}/articles/${slug}`, {
        headers: {
          Authorization: token ? `Token ${token}` : '',
        },
      });
      if (res.data) {
        return res.data.article;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 422) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            message: error.message,
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);

type PropsCreateArticle = {
  title: string;
  description: string;
  body: string;
  tagList?: string[] | null;
  slug?: string;
};

export const createArticle = createAsyncThunk<
  Article,
  PropsCreateArticle,
  { rejectValue: IRejectValue }
>('articles/createArticle', async function (article, { rejectWithValue }) {
  const token = localStorage.getItem('token');
  try {
    const { title, description, body, tagList } = article;
    const res = await axios.post(
      `${urlAPI}/articles`,
      {
        article: {
          title,
          description,
          body,
          tagList,
        },
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(' and ');
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return rejectWithValue(obj);
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return rejectWithValue(obj);
      }
    }
  }
});

export const deleteArticle = createAsyncThunk<Article, string, { rejectValue: IRejectValue }>(
  'articles/deleteArticle',
  async function (slug: string, { rejectWithValue }) {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${urlAPI}/articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 422) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            message: error.message,
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);

export const editArticle = createAsyncThunk<
  Article,
  PropsCreateArticle,
  { rejectValue: IRejectValue }
>('articles/editArticle', async function (article, { rejectWithValue }) {
  const token = localStorage.getItem('token');
  try {
    const { title, description, body, tagList, slug } = article;
    const res = await axios.put(
      `${urlAPI}/articles/${slug}`,
      {
        article: {
          title,
          description,
          body,
          tagList,
        },
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(' and ');
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return rejectWithValue(obj);
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return rejectWithValue(obj);
      }
    }
  }
});

interface IFavorite {
  article: Article;
}

export const favoriteArticle = createAsyncThunk<IFavorite, string, { rejectValue: IRejectValue }>(
  'articles/favoriteArticle',
  async function (slug: string, { rejectWithValue }) {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${urlAPI}/articles/${slug}/favorite`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 422) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            message: error.message,
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);

export const unfavoriteArticle = createAsyncThunk<IFavorite, string, { rejectValue: IRejectValue }>(
  'articles/favoriteArticle',
  async function (slug: string, { rejectWithValue }) {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${urlAPI}/articles/${slug}/favorite`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 422) {
            const keys = Object.keys(error.response.data.errors).join(' and ');
            const obj = {
              message: `${keys} is already in use.`,
              fields: Object.keys(error.response.data.errors),
            };
            return rejectWithValue(obj);
          }
        }
        if (error.message) {
          const obj = {
            message: error.message,
          };
          return rejectWithValue(obj);
        }
      }
    }
  }
);
