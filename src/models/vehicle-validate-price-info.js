import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { commons, config } from 'utils'
import * as vehicleValidatePriceInfoService from 'services/vehicleValidatePriceInfoService'
import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'vehicleValidatePriceInfo',

  state: {
    currentItem: [],
    modalVisible: false,
    vehicleValidatePriceInfoList:[],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/vehicle-validate-price-info') {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload }, { call, put }) {
      const data = yield call(vehicleValidatePriceInfoService.list, payload)
      if (data) {
        yield put({
          type: 'putItem',
          payload: {
            vehicleValidatePriceInfoList: data.data.data,
          },
        })
      }
    },

    * updateItem ({ payload }, { select, put }) {
      let currentItem = yield select(state => state.vehicleValidatePriceInfo.currentItem)
      currentItem.splice(currentItem.findIndex(item => item.id === payload.currentItem.id), 1, payload.currentItem)
      yield put({
        type: 'updateItemState',
        payload: currentItem,
      })
    },

    /** update ({ payload }, { select, call, put }) {
      const param = {}
      param.updateUser = payload
      let currentItem = yield select(state => state.vehicleValidatePriceInfo.currentItem)
      param.list = currentItem

      const data = yield call(vehicleValidatePriceInfoService.update, param)
      if (data) {
        yield put({
          type: 'query',
        })
      } else {
        throw data
      }
    },
*/

    * update ({ payload = {} }, { call, put }) {
      const res = yield call(vehicleValidatePriceInfoService.update,payload.data,payload.userPin)
      if(res) {
        yield put({
          type: 'query',
        })
        return 200
      }
    },
  },

  reducers: {
    putItem (state, { payload }) {
      return { ...state,vehicleValidatePriceInfoList: payload.vehicleValidatePriceInfoList,}
    },
    updateItemState (state, { payload }) {
      return {
        ...state,
        currentItem: payload,
      }
    },
  },
})
