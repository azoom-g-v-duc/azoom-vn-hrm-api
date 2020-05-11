import got from 'got'
const emailValid = process.env.GOOGLE_SCHEDULER_EMAIL
const audienceValid = process.env.GOOGLE_SCHEDULER_AUDIENCE
const urlVerifyToken = `https://oauth2.googleapis.com/tokeninfo?id_token=`

export default async (authToken) => {
  const token = authToken.split(' ')
  if (token.length < 2) return false
  const response = await got(`${urlVerifyToken}${token}`).catch(() => false)
  if(!response) return false
  const validateInfo = JSON.parse(response.body)
  const isEmailVerified = validateInfo.email_verified
  const isEmailValid = validateInfo.email === emailValid
  const isTimeExpired = Math.floor(Number(new Date()) / 1000) - validateInfo.exp > 0
  const isAudienceValid = validateInfo.aud === audienceValid
  if (
    !isEmailVerified ||
    !isEmailValid ||
    isTimeExpired ||
    !isAudienceValid
  )
    return false
  return true
}
