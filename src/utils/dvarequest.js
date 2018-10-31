import fetch from 'dva/fetch'

import * as cookie from 'services/cookie'



function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  if (response.status === 400) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response

  throw error
}
function checkBizReturn (data) {
  if (data.code === 400 || data.message !== 'SUCCESS') {
    const error = new Error(data.message)
    error.response = data
    throw error
  }
  return data
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function dvarequest (url, options) {
  const local_cookie = cookie.getCookie('token')
  const local_cookie_string = local_cookie === '' ? '{}' : local_cookie
  const { accountUuid, account } = JSON.parse(local_cookie_string)
  const user = { accountUuid, account }

  if (options.headers) {
    Object.assign(options.headers, { user: JSON.stringify(user) })
  } else {
    const headers = { headers: { user: JSON.stringify(user) } }
    Object.assign(options, headers)
  }

  const response = await fetch(url, options)
  checkStatus(response)
  const data = await response.json()
  checkBizReturn(data)
  const ret = {
    data,
    headers: {},
  }
  return ret
}
