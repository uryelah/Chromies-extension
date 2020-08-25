/*
NOTE schema

const note = {
  pageLink: "",
  body: "",
  videoLink: "",
  imgLink: "",
  userID: "", 
  createdAt: Date.now(),
  // strigfied array of video start and end point
  videoTimeStamp: "",
}

user = { name: "" }

*/

// window.location.href that have notes from the extension users
const currentPageNotes = () => ([
  {
    id: 0,
    pageLink: "",
    body: "",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "[10, 34]",
  },
  {
    id: 1,
    pageLink: "",
    body: "",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "[56, 134]",
  },
  {
    id: 2,
    pageLink: "",
    body: "",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "",
  },
  {
    id: 3,
    pageLink: "",
    body: "",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "",
  }
]);

export {
  currentPageNotes,
}