export function setCookie (cname, cvalue, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = `expires=${d.toUTCString()}`
  let obj = JSON.stringify(cvalue)
  document.cookie = `${cname}=${obj}; ${expires}`
}
// 获取cookie
export function getCookie (cname) {
  let name = `${cname}=`
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
  }
  return ''
}
// 清除cookie
export function clearCookie (name) {
  setCookie(name, '', -1)
}
