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
    body: "People want to go on religious pilgrimages to spiritual places in the springtime, when the April rains have soaked deep into the dry ground to water the flowers’ roots; and when Zephyrus, the god of the west wind, has helped new flowers to grow everywhere; and when you can see the constellation Aries in the sky; and when the birds sing all the time. ",
    videoLink: "",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
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
    videoLink: "http://v20.lscache8.c.youtube.com/videoplayback?sparams=id%2Cexpire%2Cip%2Cipbits%2Citag%2Cratebypass%2Coc%3AU0hPRVRMVV9FSkNOOV9MRllD&amp;itag=43&amp;ipbits=0&amp;signature=D2BCBE2F115E68C5FF97673F1D797F3C3E3BFB99.59252109C7D2B995A8D51A461FF9A6264879948E&amp;sver=3&amp;ratebypass=yes&amp;expire=1300417200&amp;key=yt1&amp;ip=0.0.0.0&amp;id=37da319914f6616c",
    imgLink: "",
    userID: "", 
    createdAt: Date.now(),
    videoTimeStamp: "",
  }
]);

export {
  currentPageNotes,
}