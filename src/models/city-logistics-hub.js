//送库费models
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { pageModel } from './common'
import queryString from 'query-string'
import * as deliverStorePriceService from '../services/deliverStorePriceService'

import * as transportRegularInfoService from 'services/transportRegularInfoService'
import * as manageCarrierLineService from '../services/carrier/carrierLineService'
import * as cityLogisticsHubService from 'services/cityLogisticsHubService'


const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'cityLogisticsHub',
  state: {
    usedCarDrivingPriceList:[],
    modalVisible:false,
    updateModalVisible:false,
    addrOptions:[],
    item:{},
    lon:0,//经度
    lat:0,//纬度
    address:'', //详细地址
    markerVisible:false,
    center:'',
    addrs:{},

  },

  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen((location) => {
        if (location.pathname === '/city-logistics-hub') {
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

      const data = yield call(cityLogisticsHubService.list, payload)

      if (data) {
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

    * prepareShowModal ({ payload = {} }, { call, put }) {

      const regionResult = yield call( manageCarrierLineService.addr,{})

      if(regionResult){
        yield put({ type: 'showModalSuccess',
          payload: {
            addrOptions:  regionResult.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
          }
        })
      }
    },

    * lazilyAddr3 ({ payload = {} }, { call, put }) {
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

    * prepareShowUpdateModal ({ payload = {} }, { call, put }) {
      const regionResult = yield call( manageCarrierLineService.addr,{})

      const item = payload.currentItem
      if(regionResult){
        yield put({ type: 'showUpdateModalSuccess',
          payload: {
            addrOptions:  regionResult.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),item:item,
          }
        })
      }
    },

    * save ({ payload = {} }, { select,call, put }) {

      const addrs = yield select(({ cityLogisticsHub }) => cityLogisticsHub.addrs)
      const lon = yield select(({ cityLogisticsHub }) => cityLogisticsHub.lon)
      const lat = yield select(({ cityLogisticsHub }) => cityLogisticsHub.lat)
      const address = yield select(({ cityLogisticsHub }) => cityLogisticsHub.address)

      if(!address){
        throw '请正确打点后保存'
      }

      let index = 0
      let cityCode

      if(addrs.size < 3){
        throw "定位地址必须选择到区"
      }

      for(let i of addrs ) {

        if(index === 1){
          cityCode = i.key
          break
        }
        index++
      }

      const data = {'cityCode':cityCode,'gpsLatitude':lat,'gpsLongitude':lon,'searchAddress':address}

      const result = yield call(cityLogisticsHubService.save, data)

      if(result){
        yield put({
          type: 'query',
        })
        yield put({
          type: 'hideModal',
        })
        return 200
      }
    },

    * update ({ payload = {} }, { select,call, put }) {

      const addrs = yield select(({ cityLogisticsHub }) => cityLogisticsHub.addrs)
      const lon = yield select(({ cityLogisticsHub }) => cityLogisticsHub.lon)
      const lat = yield select(({ cityLogisticsHub }) => cityLogisticsHub.lat)
      const address = yield select(({ cityLogisticsHub }) => cityLogisticsHub.address)
      const item = yield select(({ cityLogisticsHub }) => cityLogisticsHub.item)

      if(!address){
        throw '请正确打点后保存'
      }
      let cityCode
      if(addrs && addrs.size > 0){

        if(addrs.size < 3){
          throw "定位地址必须选择到区"
        }

        let index = 0
        for(let i of addrs ) {
          if(index === 1){
            cityCode = i.key
            break
          }
          index++
        }
      }else{
        cityCode = item.cityCode
      }

      const data = {'cityCode':cityCode,'gpsLatitude':lat,'gpsLongitude':lon,'id':item.id,'searchAddress':address}
      const result = yield call(cityLogisticsHubService.save, data)

      if(result){
        yield put({
          type: 'query',
        })
        yield put({
          type: 'hideUpdateModal',
        })
        return 200
      }
    },

    * del ({ payload = {} }, { select,call, put }) {

      const result = yield call(cityLogisticsHubService.remove, payload)

      if(result){
        yield put({
          type: 'query',
        })
        return 200
      }
    },

  },

  reducers: {

    showModalSuccess (state, { payload }) {
      return { ...state, modalVisible: true,addrOptions:payload.addrOptions,markerVisible:false,lng: 0,lat:0,address:'',center:'' }
    },
    hideModal (state, { payload }) {
      return { ...state, modalVisible: false, markerVisible:false,lon: 0,lat:0,address:'',center:'' }
    },

    hideUpdateModal (state, { payload }) {
      return { ...state, updateModalVisible: false, markerVisible:false,lon: 0,lat:0,address:'',center:'',item:{} }
    },
    local(state, { payload }) {
      return { ...state, center: payload.center,addrs:payload.addrs}
    },
    dot(state, { payload }) {
      return { ...state, lon:parseFloat(payload.lon),lat:parseFloat(payload.lat),address:payload.address,markerVisible:true }
    },

    showUpdateModalSuccess (state, { payload }) {

      return { ...state,
        updateModalVisible: true,
        addrOptions:payload.addrOptions,
        item:payload.item,
        lon:parseFloat(payload.item.gpsLongitude ),
        lat:parseFloat(payload.item.gpsLatitude),
        center:'',
        address:payload.item.searchAddress,
        markerVisible:true
      }
    },
  },



})
