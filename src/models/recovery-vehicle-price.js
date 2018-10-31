//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from './common'

import * as recoveryVehiclePriceService from '../services/recoveryVehiclePriceService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'recoveryVehiclePrice',
  state: {
    recoveryVehiclePriceList:[],
  },

  reducers: {

    querySuccess (state, { payload }) {
      return {...state, recoveryVehiclePriceList: payload.recoveryVehiclePriceList,}
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen((location) => {
        if (location.pathname === '/recovery-vehicle-price') {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {

      const list = yield call(recoveryVehiclePriceService.list,)

      if (list) {
        yield put({
          type: 'querySuccess',
          payload: {
            recoveryVehiclePriceList: list.data.data,
          },
        })
      }
    },

    * update ({ payload = {} }, { call, put }) {

      const res = yield call(recoveryVehiclePriceService.update,payload.data,payload.userPin)

      if(res) {
        yield put({
          type: 'query',
        })

        return 200
      }
    },

  },


})
