import { checkIdUserExist } from '@cloudStoreDatabase/user'
const date = require('date-and-time')
const firebase = require('firebase')

const projectMemberCollection = () => {
  return firebase.firestore().collection(process.env.DB_TABLE_PROJECT_MEMBER)
}

export const projectMember = {
  id: '',
  projectId: '',
  memberId: '',
  joiningProcess: [
    {
      position: 1,
      startDate: date.format(new Date(), 'YYYY/MM/DD'),
      endDate: ''
    }
  ],
  isActive: true,
  createdUserId: '',
  created: date.format(new Date(), 'YYYY/MM/DD'),
  updated: ''
}

export const setProjectMemberId = (projectId, memberId) => {
  return projectId + '_' + memberId + date.format(new Date(), 'YYYYMMDD')
}

export const isValidProjectMember = async data => {
  if (
    (await checkIdUserExist(data.memberId)) &&
    !(await getIdProjectMember(data.projectId, data.memberId))
  ) {
    return true
  }
  return false
}

export const saveProjectMember = async data => {
  data.id = setProjectMemberId(data.projectId, data.memberId)
  await projectMemberCollection()
    .doc(data.id)
    .set(data)
  return data
}

export const getProjectListOfManagerId = async managerId => {
  const queryData = await projectMemberCollection()
    .where('memberId', '==', managerId)
    .where('joiningProcess.position', '==', 1)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}

export const getMemberOfProjectList = async projectList => {
  const queryData = await projectMemberCollection()
    .where('projectId', 'in', projectList)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}

export const getIdProjectMember = async (projectId, memberId) => {
  const queryData = await projectMemberCollection()
    .where('projectId', '==', projectId)
    .where('memberId', '==', memberId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const UpdateProjectMember = async data => {
  data.id = setProjectMemberId(data.projectId, data.memberId)
  await projectMemberCollection()
    .doc(data.id)
    .set(data)
  return data
}

export const getProjectListOfManagerId = async managerId => {
  const queryData = await projectMemberCollection()
    .where('memberId', '==', managerId)
    .where('joiningProcess.position', '==', 1)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}

export const getMemberOfProjectList = async projectList => {
  const queryData = await projectMemberCollection()
    .where('projectId', 'in', projectList)
    .get()
  return queryData.empty ? [] : queryData.docs.map(doc => doc.data())
}

export const getIdProjectMember = async (projectId, memberId) => {
  const queryData = await projectMemberCollection()
    .where('projectId', '==', projectId)
    .where('memberId', '==', memberId)
    .get()
  return queryData.empty ? '' : queryData.docs[0].data()
}

export const UpdateProjectMember = async data => {
  data.id = setProjectMemberId(data.projectId, data.memberId)
  await projectMemberCollection()
    .doc(data.id)
    .set(data)
  return data
}
