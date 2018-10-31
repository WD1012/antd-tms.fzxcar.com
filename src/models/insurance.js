import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { commons, config } from 'utils'
import * as manageLocationService from 'services/manageLocationService'
import * as insuranceService from 'services/insuranceService'
import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'insurance',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    updateModalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    provinceListOption: [],
    accountListOption: [],
    tableData: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/insurance-list') {
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
      const data = yield call(insuranceService.list, payload)
      if (data) {
        yield put({
          type: 'showList',
          payload: {
            list: data.data.data.records,
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(insuranceService.remove, payload)
      if (data) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * addTableRow ({ payload }, { put, select }) {
      const tableData = yield select(state => state.insurance.tableData)
      if (tableData) {
        console.log(tableData)
        payload.index = tableData.length === 0 ? 0 : tableData.length
        tableData.push(payload)
        yield put({
          type: 'addTableRowState',
          payload: tableData,
        })
      }
    },
    * saveTableRow ({ payload }, { put, select }) {
      const tableData = yield select(state => state.insurance.tableData)
    },
    * deleteTableRow ({ payload }, { put, select }) {
      const tableData = yield select(state => state.insurance.tableData)
      if (tableData) {
        tableData.splice(tableData.findIndex(item => item.index === payload.index), 1)
      }
      yield put({
        type: 'addTableRowState',
        payload: tableData,
      })
    },

    * create ({ payload }, { call, put, select }) {
      const data = yield call(insuranceService.create, payload)
      if (data.data.code === 200) {
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload: {
          },
        })
      } else {
        throw data
      }
    },
    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = {
        ...payload,
        id,
      }
      const data = yield call(update, newUser)
      if (data.data.code === 200) {
        const page = yield select(state => state.manageLocation.pagination.current)
        const pageSize = yield select(state => state.manageLocation.pagination.pageSize)
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
          },
        })
      } else {
        throw data
      }
    },
    * prepareShowModal ({ payload }, { call, put }) {
      yield put({
        type: 'showModal',
      })
      yield put({
        type: 'addTableRow',
        payload: { unit: 0, rate: 0, edit: true },
      })
    },
    * prepareShowUpdateModal ({ payload }, { call, put }) {

      const result = yield call(manageLocationService.provincList)
      const _result = yield call(manageLocationService.accountList)
      const _item = yield call(manageLocationService.getById, payload.regionId)

      if (result) {
        yield put({
          type: 'showUpdateModal',
          payload: result.data.data,
        })
      }
      if (_result) {
        yield put({
          type: 'putAccountList',
          payload: _result.data.data,
        })
      }
      if (_item) {
        yield put({
          type: 'putItem',
          payload: _item.data,
        })
      }
    },
  },

  reducers: {
    showList (state, { payload }) {
      return {
        ...state,
        list: payload.list,
      }
    },
    changUnit (state, { payload }) {
      return {
        ...state,
      }
    },
    changRate (state, { payload }) {
      return {
        ...state,...payload
      }
    },
    addTableRowState (state, { payload }) {
      return {
        ...state,
        tableData: payload,
      }
    },
    showModal (state, { payload }) {
      return {
        ...state,
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
        tableData: [],
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
