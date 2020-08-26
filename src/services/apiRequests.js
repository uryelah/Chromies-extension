import axios from 'axios';

const baseURL = 'https://blooming-inlet-46820.herokuapp.com';
// const baseURL = "https://weather-app-2-272202.ew.r.appspot.com";

const registerUser = async (username) => (
  axios.post(`${baseURL}/users/register`, { name: username })
    .then(res => res)
    .catch(err => err.response)
);

const loginUser = async (username) => (
  axios.post(`${baseURL}/users/login`, { name: username })
    .then(res => res)
    .catch(err => err.response)
);

// endpoint for creating only plain text notes
const addBasicNote = async (pageLink, body, userID) => (
  axios.post(`${baseURL}/notes/upload/text`, { pageLink, body, userID })
    .then(res => res)
    .catch(err => err.response)
);

// this endpoint can detect the type of media uploaded
// if the media is an img, the videoLink will be an empty string
// if the media is a video, the imgLink will be an empty string
const addMediaNote = async (pageLink, userID, body, file, videoTimeStamp) => {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const data = await axios(
    {
      method: 'post',
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
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

// Grabs all notes for user with given userID and pageLink(optional)
const getUserNotes = async (userID, pageLink) => (
  axios.get(`${baseURL}/notes/users/${userID}`, { pageLink })
    .then(res => res)
    .catch(err => err.response)
);

export {
  registerUser, loginUser, addBasicNote, addMediaNote, getUserNotes,
};