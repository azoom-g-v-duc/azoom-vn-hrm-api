const firebase = require('firebase')

const fireStore = firebase.firestore()

export const getLeaveApplicationCollection = () => {
    return fireStore.collection(process.env.DB_TABLE_LEAVE_APPLICATION)
}