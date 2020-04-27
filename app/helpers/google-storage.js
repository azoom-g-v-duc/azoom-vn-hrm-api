import { Storage } from '@google-cloud/storage'

export const storage = new Storage({ projectId: process.env.FIRE_BASE_PROJECT_ID })

export const uploadFile = async (filePath) => {
  const res = await storage.bucket(process.env.STORAGE_BUCKET).upload(filePath)
  await storage.bucket(process.env.STORAGE_BUCKET).file(filePath).acl.readers.addDomain('azoom.jp')
  return res[0].metadata.mediaLink
}
