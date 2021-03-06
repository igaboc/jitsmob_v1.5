import api, { setToken } from './init'
import { getDecodedToken } from './token'

export function signIn({ email, password }) {
  return api.post('/auth', { password, email })
  .then((res) => {
    const token = res.data.token
    console.log('hello', res)
    setToken(token, 'adminToken')
      return getDecodedToken('adminToken')
    })
    .catch((error) => {
      if (/ 401/.test(error.message)) {
        error = new Error('The email/password combination was incorrect')
      }

      throw error
    })
}

export function userSignUp({ email, password, firstName, lastName }) {
  return api.post('/authUser/register', { email, password, firstName, lastName })
    .then((res) => {
      const token = res.data.token
      setToken(token, 'userToken')
      return getDecodedToken('userToken')
    })
}

export function signOutNow(key) {
  // Forget the token
  
  setToken(null, key)
}

export function userSignIn({ email, password }) {
  return api.post('/authUser', { password, email })
  .then((res) => {
    const token = res.data.token
    setToken(token, 'userToken')
      return getDecodedToken('userToken')
    })
    .catch((error) => {
      if (/ 401/.test(error.message)) {
        error = new Error('The email/password combination was incorrect')
      }

      throw error
    })
}