import axios from "axios";
const baseURL = "https://blooming-inlet-46820.herokuapp.com";
// const baseURL = "https://weather-app-2-272202.ew.r.appspot.com";

export const signUpUserWithUsername = async (username) => {
  return await axios.post(`${baseURL}/users/register`, {
    name: username,
  });
};

export const loginUser = async (username) => {
  return await axios.post(`${baseURL}/users/login`, {
    name: username,
  });
};

// endpoint for creating only plain text notes
export const createPlainTextNote = async (pageLink, userID, body) => {
  return await axios.post(`${baseURL}/notes/upload/text`, {
    pageLink,
    userID,
    body,
  });
};

// this endpoint can detect the type of media uploaded
// if the media is an img, the videoLink will be an empty string
// if the media is a video, the imgLink will be an empty string
export const createNoteWithMedia = async (
  pageLink,
  userID,
  body,
  file,
  videoTimeStamp
) => {
  let formData = new FormData();
  formData.append("file", file, file.name);

  const data = axios(
    {
      method: "post",
      url: `${baseURL}/notes/upload/media`,
      data: {
        pageLink,
        userID,
        body,
        videoTimeStamp,
        file: formData,
      },
    },

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const getNotesForUser = async (userID) => {
  return await axios.get(`${baseURL}/notes/users/${userID}`);
};
