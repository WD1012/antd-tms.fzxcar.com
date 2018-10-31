import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import { _login } from 'services/login'
import * as cookie from '../services/cookie'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({payload,}, { put, call, select }) {
      const data = yield call(_login, payload)

      //const _loginData = yield call(_login, payload)


      const { locationQuery } = yield select(_ => _.app)
      if (data) {
        const cookieData = { ...data.data.data }
        console.log(cookieData)
        cookie.setCookie('token', cookieData, 1)
        const { from } = locationQuery
        yield put({ type: 'app/query', payload: { data, cookie } })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },


}
