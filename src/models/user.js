/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { create, remove, update } from 'services/user'
import * as usersService from '../services/users'
import { pageModel } from './common'

const { query } = usersService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalEditVisible:false,
    roles:[],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user') {
          const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {

      const roles =  yield call(usersService.roles,)

      const data = yield call(usersService.list, payload)
      if (data) {
          yield put({
            type: 'rolesInit',
            payload: {
              roles:roles.data.data,
            }
          })
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data.data.records,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.data.data.total,
              },
            },
          })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(usersService.del, payload.id,payload.userPin)
      if (data) {
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'query' })

        return 200
      } else {
        throw data
      }
    },

    * resetPassWord ({ payload }, { call, put, select }) {
      const data = yield call(usersService.resetPassWord, payload.userName)
      if (data) {
        yield put({ type: 'hideEditModal' })
        return 200
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(usersService.create, payload.data)
      if (data) {
        if(payload.type === 1){
          yield put({ type: 'hideEditModal' })
        }else{
          yield put({ type: 'hideModal' })
        }
        yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }

    },

    * update ({ payload }, { select, call, put }) {

      const data = yield call(usersService.update, payload.account,payload.data)
      if (data) {
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'query' })

        return 200
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    showEditModal (state, { payload }) {
      return { ...state, ...payload, modalEditVisible: true }
    },

    hideEditModal (state) {
      return { ...state, modalEditVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

    rolesInit (state, { payload }) {
      return { ...state, ...payload,  roles: payload.roles }
    },

  },
})
