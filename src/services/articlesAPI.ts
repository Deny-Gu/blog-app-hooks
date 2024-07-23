import axios from "axios";

const urlAPI = "https://api.realworld.io/api";

export const getArticles = async (pagination: number) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `${urlAPI}/articles?limit=5&offset=${pagination}`,
      {
        headers: {
          Authorization: token ? `Token ${token}` : "",
        },
      },
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};

export const getArticle = async (slug: string) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${urlAPI}/articles/${slug}`, {
      headers: {
        Authorization: token ? `Token ${token}` : "",
      },
    });
    if (res.data) {
      return res.data.article;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};

type PropsCreateArticle = {
  title: string;
  description: string;
  body: string;
  tagList?: string[] | null;
  slug?: string;
};

export const createArticle = async (article: PropsCreateArticle) => {
  const token = localStorage.getItem("token");
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
      },
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};

export const deleteArticle = async (slug: string) => {
  const token = localStorage.getItem("token");
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
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};

export const editArticle = async (article: PropsCreateArticle) => {
  const token = localStorage.getItem("token");
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
      },
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};

export const favoriteArticle = async (slug: string) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${urlAPI}/articles/${slug}/favorite`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    if (res.data) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 422) {
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};

export const unfavoriteArticle = async (slug: string) => {
  const token = localStorage.getItem("token");
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
          const keys = Object.keys(error.response.data.errors).join(" and ");
          const obj = {
            message: `${keys} is already in use.`,
            fields: Object.keys(error.response.data.errors),
          };
          return obj;
        }
      }
      if (error.message) {
        const obj = {
          message: error.message,
        };
        return obj;
      }
    }
  }
};
