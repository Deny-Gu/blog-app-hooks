import { createSlice } from '@reduxjs/toolkit';
import { Article } from '../../types/Article';
import { IRejectValue } from '../../types/IRejectValue';
import {
  createArticle,
  deleteArticle,
  editArticle,
  favoriteArticle,
  fetchArticle,
  fetchArticles,
} from '../services/articlesAPI';

type State = {
  article: Article | null;
  articles: Article[];
  articlesCount: number;
  isLoading: boolean;
  success: boolean;
  error: null | IRejectValue | undefined;
};

const initialState: State = {
  article: null,
  articles: [],
  articlesCount: 0,
  isLoading: false,
  success: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.article = null;
        state.articles = [];
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.article = null;
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.article = null;
      })
      .addCase(fetchArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(editArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.article = action.payload;
      })
      .addCase(editArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(favoriteArticle.pending, (state) => {
        state.error = null;
      })
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        state.article = action.payload.article;
        state.articles = state.articles.map((article) => {
          if (article.slug === action.payload.article.slug) {
            return {
              ...article,
              favorited: action.payload.article.favorited,
              favoritesCount: action.payload.article.favoritesCount,
            };
          } else {
            return article;
          }
        });
      })
      .addCase(favoriteArticle.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSuccess, clearError } = articlesSlice.actions;

export default articlesSlice.reducer;
