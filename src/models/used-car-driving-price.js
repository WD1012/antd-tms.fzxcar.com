//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from './common'

import * as usedCarDrivingPriceService from '../services/usedCarDrivingPriceService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'usedCarDrivingPrice',
  state: {
    usedCarDrivingPriceList:[],
  },

  reducers: {

    querySuccess (state, { payload }) {
      return {...state, usedCarDrivingPriceList: payload.usedCarDrivingPriceList,}
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen((location) => {
        if (location.pathname === '/used-car-driving-price') {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {

      const list = yield call(usedCarDrivingPriceService.list,)

      if (list) {
        yield put({
          type: 'querySuccess',
          payload: {
            usedCarDrivingPriceList: list.data.data.records,
          },
        })
      }
    },

    * update ({ payload = {} }, { call, put }) {

      const res = yield call(usedCarDrivingPriceService.update,payload.data,payload.userPin)
      if(res) {
        yield put({
          type: 'query',
        })
        return 200
      }
    },

  },


})
