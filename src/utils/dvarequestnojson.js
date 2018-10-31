import fetch from 'dva/fetch'
import * as cookie from 'services/cookie'

const local_cookie = cookie.getCookie('token')
const local_cookie_string = local_cookie === '' ? '{}' : local_cookie
const { accountUuid, account } = JSON.parse(local_cookie_string)

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  if (response.data.code === 200) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function dvarequestnojson(url, options) {
  const user = { accountUuid, account }
  if (options.headers) {
    Object.assign(options.headers, { user: JSON.stringify(user) })
  } else {
    const headers = { headers: { user: JSON.stringify(user) } }
    Object.assign(options, headers)
  }

  const response = await fetch(url, options)
  checkStatus(response)
  const ret = {
    response: response.body,
    headers: {},
  }
  return ret
}
