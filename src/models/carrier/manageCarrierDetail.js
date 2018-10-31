//承运商管理models
import pathToRegexp from 'path-to-regexp'
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { pageModel } from '../common'
import * as manageCarrierService from '../../services/carrier/carrierService'
import * as carrierEmployeeService from '../../services/carrier/carrierEmployeeService'
import * as carrierRegionService from '../../services/carrier/carrierRegionService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'manageCarrierDetail',
  state: {
    carrierDetail: {},
    employees: [],
    regionDatas: [],
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload,}
    },

  },

  subscriptions: {

    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/manage-carrier/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },

  },

  effects: {

    * query ({ payload = {} }, { call, put }) {

      const carrierDetail = yield call(manageCarrierService.detail, payload.id)

      if(carrierDetail){
        const employees = yield call(carrierEmployeeService.list, payload.id)
        const regionDatas = yield call(carrierRegionService.list, payload.id)

        yield put({
          type: 'showModal',
          payload: {
            carrierDetail:carrierDetail.data.data,
            employees:employees.data.data.map((item) =>{
              const m = {"id":item.id,
                "name":item.employeeName,
                "tel":item.linkTel,
                "isMaster":item.isMain,
              }
              return m
            }),
            regionDatas:regionDatas.data.data.map((item) =>{
              const m = {'id':item.id,'origin':item.startingPlace,'destination': item.destinationPlace,'link': item.employeeName+'/'+item.linkTel,'transportType': item.transportType};
              return m;
            }),
          }
        })
      }
    },

  },


})
