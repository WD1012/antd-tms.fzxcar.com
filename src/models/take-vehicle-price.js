//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from './common'

import * as takeVehiclePriceService from '../services/takeVehiclePriceService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'takeVehiclePrice',
  state: {
    takeVehiclePriceList:[],
  },

  reducers: {

    querySuccess (state, { payload }) {
      return {...state, takeVehiclePriceList: payload.takeVehiclePriceList,}
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen((location) => {
        if (location.pathname === '/tabke-vehicle-price') {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {

      const list = yield call(takeVehiclePriceService.list,)

      if (list) {
        yield put({
          type: 'querySuccess',
          payload: {
            takeVehiclePriceList: list.data.data,
          },
        })
      }
    },

    * update ({ payload = {} }, { call, put }) {

      const res = yield call(takeVehiclePriceService.update,payload.data,payload.userPin)

      if(res) {
        yield put({
          type: 'query',
        })

        return 200
      }
    },

  },


})
