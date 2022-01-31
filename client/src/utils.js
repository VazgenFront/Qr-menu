import axios from "axios";

export const changeFieldHandler = async (url, body, token) => {
  await axios.put(url, body, {
    headers: { "x-access-token": token },
  });
};

export const addFieldHandler = async (url, body, token) => {
  await axios.post(url, body, {
    headers: {
      "x-access-token": token,
    },
  });
};
