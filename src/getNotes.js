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
    body: "Remember to pay the internet bill!!! ",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now() - 800000,
    videoTimeStamp: "",
  },
  {
    id: 1,
    pageLink: "",
    body: "",
    videoLink: "",
    imgLink: "https://www.clipartkey.com/mpngs/m/71-716395_clip-art-math-equations-png-math-equations-transparent.png",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "",
  },
  {
    id: 1,
    pageLink: "",
    body: "At this part of the video she explains how to manage projects with multiple stake holders and a strict timeline",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "[806, 194]",
  },
  {
    id: 4,
    pageLink: "",
    body: "",
    videoLink: "https://cdn.loom.com/sessions/raw/b03b93514c8e4397aa748e64b638f621.webm?Expires=1598529625&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4ubG9vbS5jb20vc2Vzc2lvbnMvcmF3L2IwM2I5MzUxNGM4ZTQzOTdhYTc0OGU2NGI2MzhmNjIxLndlYm0iLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTg1Mjk2MjV9fX1dfQ__&Signature=Wfe1a8N76oiv-Tl~wNghrGk4QSjRmgBK3wEUo980lvD6ACLnbJw9QmBe1fzBqeDrKVVdRD0tQELw1bzPj3D7d0VZJH3tcomLwyofAklLPgBtup54aVcMYeRF5siS-XAZfew8lx8Lxqt6e2Wo5~y84z2h92S-ogaMjv813l9AuVpVgQT95IpcyoUZlvQNyDGEs5TtQkGvrIJDf3g0-PEBnVSTcD8U1vMiv-SqJd4fKSKAmuOx4PSBAjJLyu94oP4OSVUoDwitWbusvYXDQ5jTbkazFRVME1PVxlwI9hlMQgvtjUScVgnuJy2g4l65h-55lCEIgirElgIBTQC-m8YPtg__&Key-Pair-Id=APKAJQIC5BGSW7XXK7FQ",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "",
  },
  {
    id: 2,
    pageLink: "",
    body: "One spring, when I was making my own humble pilgrimage to Canterbury, I stayed at the Tabard Inn in the city of Southwark. While I was there, a group of twenty-nine people who were also making the same pilgrimage arrived at the hotel. None of them had really known each other before, but they had met along the way. It was a pretty diverse group of people from different walks of life. The hotel was spacious and had plenty of room for all of us. I started talking with these people and pretty soon fit right into their group. We made plans to get up early and continue on the journey to Canterbury together.",
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
    videoLink: "https://dafftube.org/wp-content/uploads/2014/01/Sample_1280x720_mp4.mp4",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "",
  }
]);

export {
  currentPageNotes,
}