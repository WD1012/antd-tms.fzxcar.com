import fetch from 'dva/fetch'

import * as cookie from 'services/cookie'

const local_cookie = cookie.getCookie('token')
const local_cookie_string = local_cookie === '' ? '{}' : local_cookie
const { accountUuid, account } = JSON.parse(local_cookie_string)
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function dvarequestbytes (url, options) {
  const user = { accountUuid, account }
  if (options.headers) {
    Object.assign(options.headers, { user: JSON.stringify(user) })
  } else {
    const headers = { headers: { user: JSON.stringify(user) } }
    Object.assign(options, headers)
  }

  const response = await fetch(url, options)
  return response
}
