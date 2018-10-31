import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { commons, config } from 'utils'
import * as manageLocationService from 'services/manageLocationService'
import * as cityCollectionInfoService from 'services/cityCollectionInfoService'

import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'manageLocation',

  state: {
    currentItem: {},
    modalVisible: false,
    updateModalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    provinceListOption: [],
    accountListOption: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/manage-location') {
          const payload = Object.keys(queryString.parse(location.search)).length === 0 ? {
            page: 1,
            pageSize: 10,
          } : queryString.parse(location.search)
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload }, { call, put }) {
      const data = yield call(manageLocationService.list, payload)
      if (data) {
        console.log(data)
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data.records,
            pagination: {
              current: Number(data.data.data.current) || 1,
              pageSize: Number(data.data.data.size) || 10,
              total: data.data.data.total,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(manageLocationService.remove, payload )
      if (data) {
        const page = yield select(state => state.manageLocation.pagination.current)
        const pageSize = yield select(state => state.manageLocation.pagination.pageSize)
        yield put({
          type: 'query',
          payload: { page, pageSize },
        })
      } else {
        throw data
      }
    },


    * create ({ payload }, { call, put, select }) {
      const data = yield call(manageLocationService.addAccountRequest, payload)
      if (data.data.code === 200) {
        const page = yield select(state => state.manageLocation.pagination.current)
        const pageSize = yield select(state => state.manageLocation.pagination.pageSize)
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload: { page, pageSize },
        })
      } else {
        throw data
      }
    },
    * update ({ payload }, { select, call, put }) {
      const data = yield call(manageLocationService.update, payload)
      if (data.data.code === 200) {
        const page = yield select(state => state.manageLocation.pagination.current)
        const pageSize = yield select(state => state.manageLocation.pagination.pageSize)
        yield put({ type: 'hideUpdateModal' })
        yield put({
          type: 'query',
          payload: { page, pageSize },
        })
      } else {
        throw data
      }
    },
    * prepareShowModal ({ payload }, { call, put }) {
      // const result = yield call(manageLocation.provincList)
      const result = yield call(cityCollectionInfoService.regionProvinceList)
      const _result = yield call(manageLocationService.accountList)
      if (_result) {
        console.log(_result)
        yield put({
          type: 'putAccountList',
          payload: _result.data.data,
        })
      }
      if (result) {
        yield put({
          type: 'showModal',
          payload: result.data.data,
        })
      }
    },
    * prepareShowUpdateModal ({ payload }, { call, put }) {
      console.log(payload)
      const result = yield call(manageLocationService.provincList)
      const _result = yield call(manageLocationService.accountList)
      const _item = yield call(manageLocationService.getById, payload.regionId)
      console.log(_item)
      if (_item) {
        yield put({
          type: 'putItem',
          payload: _item.data.data,
        })
      }
      if (_result) {
        yield put({
          type: 'putAccountList',
          payload: _result.data.data,
        })
      }
      if (result) {
        yield put({
          type: 'showUpdateModal',
          payload: result.data.data,
        })
      }
    },
  },

  reducers: {

    putItem (state, { payload }) {
      return {
        ...state,
        currentItem: payload,
      }
    },
    showModal (state, { payload }) {
      return {
        ...state,
        provinceListOption: payload,
        modalVisible: true,
      }
    },
    showUpdateModal (state, { payload }) {
      return {
        ...state,
        provinceListOption: payload,
        updateModalVisible: true,
      }
    },
    putAccountList (state, { payload }) {
      return {
        ...state,
        accountListOption: payload,
      }
    },

    hideModal (state) {
      return {
        ...state,
        modalVisible: false,
      }
    },
    hideUpdateModal (state) {
      return {
        ...state,
        updateModalVisible: false,
      }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return {
        ...state,
        isMotion: !state.isMotion,
      }
    },

  },
})
