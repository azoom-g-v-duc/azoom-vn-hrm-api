const firebase = require('firebase')
const initConfigDbType = { firebase: true }
const isDatabase = { firebase: false, isInit: false }
let database = ''

export const initCloudStoreFirebase = () => {
  const firebaseConfig = {
    apiKey: process.env.FIRE_BASE_API_KEY,
    authDomain: process.env.FIRE_BASE_AUTH_DOMAIN,
    databaseURL: process.env.FIRE_BASE_DATABASE_URL,
    projectId: process.env.FIRE_BASE_PROJECT_ID,
    storageBucket: process.env.FIRE_BASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
    appId: process.env.FIRE_BASE_APP_ID
  }
  isDatabase.firebase = true
  firebase.initializeApp(firebaseConfig)
  const datarole = { id: '1', name: 'admin' }
  firebase.firestore().collection(process.env.DB_TABLE_POSITION_PERMISSION).doc(datarole.id).set(datarole)

  return firebase.firestore()
}

export const initDatabase = () => {
  if (initConfigDbType.firebase) {
    isDatabase.isInit = true
    return (database = initCloudStoreFirebase())
  }
}

export const getTable = tableName => {
  if (!isDatabase.isInit) {
    return initDatabase().collection(tableName)
  }
  if (isDatabase.firebase) {
    return database.collection(tableName)
  }
  return false
}
