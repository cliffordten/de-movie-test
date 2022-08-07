import config from "./constants";

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(config.APP_TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    return localStorage.setItem(config.APP_TOKEN_KEY, token);
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(config.APP_TOKEN_KEY);
  }
  return null;
};

export const formatDate = (d: number) => {
  let date = new Date(d).toLocaleDateString("en-us", { day: "numeric" });
  let month = new Date(d).toLocaleDateString("en-us", { month: "short" });
  let year = new Date(d).toLocaleDateString("en-us", { year: "numeric" });
  const formattedDate = `${date} ${month} ${year}`;

  return formattedDate;
};
