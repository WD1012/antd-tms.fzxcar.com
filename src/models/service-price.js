//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from './common'

import * as servicePriceService from '../services/servicePriceService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'servicePrice',
  state: {
    currentItem: {},
    list:[],
    addModalVisible: false,
    editModalVisible:false,
    servicePriceList:[],
  },

  reducers: {
    showAddModal (state, { payload }) {
      return { ...state, addModalVisible: true,}
    },

    hideAddModal (state) {
      return {...state, addModalVisible: false,}
    },

    showEditModal (state, { payload }) {
      return { ...state, editModalVisible: true,currentItem:payload.currentItem }
    },

    hideEditModal (state) {
      return {...state, editModalVisible: false,}
    },

    querySuccess (state, { payload }) {
      return {...state, servicePriceList: payload.servicePriceList,}
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/serivce-price-info') {

          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {

      const list = yield call(servicePriceService.list,)

      if (list) {
        yield put({
          type: 'querySuccess',
          payload: {
            servicePriceList: list.data.data,
          },
        })
      }
    },

    * add ({ payload = {} }, { call, put }) {

      console.log(payload)
      yield put({
        type: 'hideAddModal',
      })
      yield put({
        type: 'query',
      })
      return 200
    },

    * delete ({ payload = {} }, { call, put }) {

      yield put({
        type: 'query',
      })

    },

    * update ({ payload = {} }, { call, put }) {

      const res = yield call(servicePriceService.update,payload.data,payload.userpin)

      if(res) {
        yield put({
          type: 'query',
        })

        return 200
      }
    },

  },


})
