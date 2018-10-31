/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import * as transportRegularInfoService from 'services/transportRegularInfoService'
import * as transportInfoService from 'services/transportInfoService'
import { pageModel } from './common'
import * as manageCarrierLineService from '../services/carrier/carrierLineService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'transportRegularInfo',

  state: {
    currentItem: {},
    startCityOption: [],
    endCityOption: [],
    putStateList: [],
    regionResultList: [],
    updateRegionResultList: [],
    regionBaseResultList:[],
    modalVisible: false,
    updateModalVisible: false,
    modalType: 'create',
    tableData: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transport-regular-info') {
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

      const data = yield call(transportRegularInfoService.list, payload)
      if (data) {

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
      const result = yield call(transportRegularInfoService.getStates)
      if (result) {
        yield put({
          type: 'putStateList',
          payload: result.data.data,
        })
      }
      //const regionResult = yield call(transportInfoService.getRegionList)
      const param = {}
      const regionResult = yield call(manageCarrierLineService.addr, param)
      if (regionResult) {
        const addrOptions = regionResult.data.data.map((item) => {
          const m = { value: item.id, label: item.desc, isLeaf: false }
          return m
        })

        yield put({
          type: 'putRegionBaseResultList',
          payload: addrOptions,
        })
      }
    },

    * prepareShowModal ({ payload }, { call, put, select }) {
      const regionResult = yield call(transportRegularInfoService.getRegionList)

      if (regionResult) {
        const addrOptions = regionResult.data.data.map((item) => {
          const m = { value: item.id, label: item.desc, isLeaf: false }
          return m
        })
        yield put({
          type: 'putRegionResultList',
          payload: addrOptions,
        })
      }
      yield put({
        type: 'showModal',
      })
    },

    * load2Addr ({ payload = {} }, { call, put }) {
      const data = yield call(transportRegularInfoService.get2RegionList, payload.value)
      if (data) {
        payload.loading = false
        payload.children = data.data.data.map((item) => {
          const m = { value: item.id, label: item.desc, isLeaf: true }
          return m
        })
      }
    },



    /*
    * 加载三级行政区域
    * */
    * load3Addr ({ payload = {} }, { call, put }) {

      let param = {"provCode":payload.value,"queryType":2}
      let collectionCodeMin = 900000
      let isLeaf = false
      if(payload.value < collectionCodeMin && !Number.isInteger(payload.value / 10000)){
        param = {"cityCode":payload.value,"queryType":3}
        isLeaf = true
      }

      let data
      if(payload.value > collectionCodeMin){
        isLeaf = true
        data = yield call(transportRegularInfoService.get2RegionList, payload.value)
      }else{
        data = yield call(manageCarrierLineService.addr, param)
      }

      if(data){
        payload.loading = false;
        payload.children = data.data.data.map((item) =>{
          const m = {'value':item.id,'label':item.desc,'isLeaf': isLeaf};
          return m;})
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put, select }) {
      const tableData = yield select(state => state.transportRegularInfo.tableData)
      const startCityOption = yield select(state => state.transportRegularInfo.startCityOption)
      const endCityOption = yield select(state => state.transportRegularInfo.endCityOption)
      const startCityParam = startCityOption.map((item) => {
        return item.label
      })
      const endCityParam = endCityOption.map((item) => {
        return item.label
      })
      const param = {
        createUser: 'nocookie',
        destinationProvinceCode: payload.destinationCity[0],
        destinationCityCode: payload.destinationCity[1],
        destinationCity: endCityParam[1],
        destinationProvince: endCityParam[0],
        priorityLevel: payload.priorityLevel,

        billType:payload.billType,
        transportTypeId:payload.transportTypeId,

        startProvinceCode: payload.startCity[0],
        startCityCode: payload.startCity[1],
        startProvince: startCityParam[0],
        startCity: startCityParam[1],
        list: tableData,
      }

      if(payload.destinationCity[2]){
        param.destinationRegion = endCityParam[2]
        param.destinationRegionCode =  payload.destinationCity[2]
        param.startRegion = startCityParam[2]
        param.startRegionCode = payload.startCity[2]
      }
      // destinationRegion
      // destinationRegionCode
      // startRegion
      // startRegionCode

      // {
      //   "createUser": "string",
      //   "destinationCity": "string",
      //   "destinationCityCode": "string",
      //   "destinationProvince": "string",
      //   "destinationProvinceCode": "string",
      //   "list": [
      //   {
      //     "billUnit": "string",
      //     "unit": "string"
      //   }
      // ],
      //   "priorityLevel": 0,
      //   "startCity": "string",
      //   "startCityCode": "string",
      //   "startProvince": "string",
      //   "startProvinceCode": "string",
      //   "updateUser": "string"
      // }
      const data = yield call(transportRegularInfoService.create, param)
      if (data) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * updateRecordState ({ payload }, { call, put }) {
      const data = yield call(transportRegularInfoService.updateRecordState, payload)
      if (data) {
        //yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * deleteRecord ({ payload }, { call, put }) {
      const data = yield call(transportRegularInfoService.deleteRecord, payload)
      if (data) {
        //yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * editRecord ({ payload }, { call, put }) {
      const data = yield call(transportRegularInfoService.getRecord, payload)

      let billUnits = [];
      // const region2Result = yield call(transportRegularInfoService.getAll2RegionTree)
      if (data) {

        data.data.data.detailList.map((item) =>{
          billUnits[item.index] = item.billUnit

          item.beforUnit = billUnits[item.index -1 ]?billUnits[item.index -1 ]:0


        })

        yield put({
          type: 'showUpdateModal',
          payload: data.data.data,
        })
      } else {
        throw data.message
      }
    },

    * update ({ payload }, { select, call, put }) {

      const tableData = yield select(state => state.transportRegularInfo.tableData)

      const param = {
        createUser: 'nocookie',
        priorityLevel:payload.data.priorityLevel,
        billType:payload.data.billType,
        list: tableData,
      }

      const data = yield call(transportRegularInfoService.update, param,  payload.id)

      if (data) {
        yield put({ type: 'hideUpdateModal' })
        yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },

    * addTableRow ({ payload }, { put, select }) {
      const tableData = yield select(state => state.transportRegularInfo.tableData)
      let billUnit = 0
      let billUnits = [];
      tableData.map((item) => {
        billUnits[item.index] = item.billUnit

        item.beforUnit = billUnits[item.index -1 ]?billUnits[item.index -1 ]:0

        if(item.index > 1 && item.billUnit > 0 && item.beforUnit >=  item.billUnit){
          throw '最大公里数不应该小于等于最小公里数'
        }

        if(item.billUnit < billUnit){
          item.billUnit = 0
        }

      })
      if (tableData) {
        payload.index = tableData.length === 0 ? 0 : tableData.length
        tableData.push(payload)
        yield put({
          type: 'addTableRowState',
          payload: tableData,
        })
      }
    },
    * deleteTableRow ({ payload }, { put, select }) {
      const tableData = yield select(state => state.transportRegularInfo.tableData)

      let index = payload.index
      const length = tableData.length
      tableData.map((item) =>{
        if(index === length -1){
          return
        }
        tableData.splice(tableData.findIndex(item => item.index === index), 1)
        index++
      })

      tableData.forEach((item, index, array) => {
        tableData[index].index = index
      })

      yield put({
        type: 'addTableRowState',
        payload: tableData,
      })
    },


  },

  reducers: {

    showModal (state, { payload }) {
      const fRow = { billUnit: 0, unit: 0, index: 0 }
      const dataArray = []
      dataArray.push(fRow)
      return {
        ...state, ...payload, tableData: dataArray, modalVisible: true,
      }
    },
    showUpdateModal (state, { payload }) {
      return {
        ...state, updateModalVisible: true, currentItem: payload, tableData: payload.detailList,
      }
    },
    update2RegoinList (state, { payload }) {
      return {
        ...state, updateRegionResultList: payload,
      }
    },
    putStateList (state, { payload }) {
      return { ...state, putStateList: payload }
    },

    putRegionResultList (state, { payload }) {
      return { ...state, regionResultList: payload }
    },

    putRegionBaseResultList (state, { payload }) {
      return { ...state, regionBaseResultList: payload }
    },

    hideModal (state) {
      return { ...state, modalVisible: false, tableData: [] }
    },
    hideUpdateModal (state) {
      return { ...state, updateModalVisible: false, tableData: [] }
    },
    changUnit (state, { payload }) {
      return {
        ...state,
      }
    },
    changRate (state, { payload }) {
      return {
        ...state,
      }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    addTableRowState (state, { payload }) {
      return {
        ...state,
        tableData: payload,
      }
    },
    putStartCityOption (state, { payload }) {
      return { ...state, startCityOption: payload }
    },
    putEndCityOption (state, { payload }) {
      return { ...state, endCityOption: payload }
    },
  },
})
