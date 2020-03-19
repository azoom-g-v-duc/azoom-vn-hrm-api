
const firebase =require('firebase')
let database=''

export const getDatabase = () => {
  var firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID
  }
  firebase.initializeApp(firebaseConfig);
  return firebase.firestore()
}

export const getTable = (tableName) => {
  if (!database){
    database = getDatabase()
  }
  return  database.collection(tableName)
}
