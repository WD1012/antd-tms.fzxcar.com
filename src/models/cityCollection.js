import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { commons, config } from 'utils'
import * as cityCollectionInfoService from 'services/cityCollectionInfoService'
import { pageModel } from './common'
import * as manageCarrierLineService from 'services/carrier/carrierLineService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'cityCollection',

  state: {
    currentItem: {},
    modalVisible: false,
    updateModalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    provinceListOption: [],
    cityListOption: [],
    targetKeys: [],
    targetCheckboxs: [],
    updateCheckBoxDefault: [],

    allCitys:[],//市全集
    candidateList:[], //候选列表
    selectedList:[],//已选择列表

    modalProvinceVisible: false,//省
    candidateProvinceList:[], //候选省列表
    selectedProvinceList:[],//已选省列表
    updateProvinceModalVisible: false,

    modalRegionVisible: false,//区
    candidateRegionList:[], //候选区列表
    selectedRegionList:[],//已选区列表
    addrOptions:[],
    updateRegionModalVisible: false,

    collectionType:'', //3省 0市 2区
  },

  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen((location) => {

        if (location.pathname === '/city-collection') {
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

    * query ({ payload }, { call, put,select }) {
      const collectionType = yield select(state => state.cityCollection.collectionType)

      if(!payload.queryType){
        if(collectionType === '' ){
          payload.queryType = 3;
        }else {
          payload.queryType = collectionType;
        }
      }

      const data = yield call(cityCollectionInfoService.list, payload)
      if (data) {
        yield put({
          type: 'collectionType',
          payload: payload.queryType,
        })

        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data.records,
            pagination: {
              current: Number(data.data.data.current) || 1,
              pageSize: Number(data.data.data.pageSize) || 10,
              total: data.data.data.total,
            },
          },
        })


      }
    },

    * showCreate ({ payload }, { call, put, select }) {
      const provinceList = yield call(cityCollectionInfoService.regionProvinceList)
      if (provinceList) {
        yield put({
          type: 'updateProvinceList',
          payload: provinceList.data.data,
        })
        yield put({
          type: 'showModal',
        })
      }
    },
    * showEidtModal ({ payload }, { call, put, select }) {
      const data = yield call(cityCollectionInfoService.getCityCollectionInfo, payload)

      const provinceList = yield call(cityCollectionInfoService.regionProvinceList)
      if (provinceList) {
        yield put({
          type: 'updateProvinceList',
          payload: provinceList.data.data,
        })
      }

      if (data) {

        yield put({
          type: 'showUpdateModal',
          payload:{
            currentItem:data.data.data,
            selectedList:data.data.data.collecitonDetail
          } ,
        })
      }
    },
    * create ({ payload }, { call, put, select }) {
      const selectedList = yield select(state => state.cityCollection.selectedList)

      if(selectedList.length === 0){
        throw '已选城市为空，不允许创建操作'
      }

      const d = {}
      d.collecitonDetail = selectedList
      d.collectionName = payload.collectionName

      const data = yield call(cityCollectionInfoService.create, d)
      if (data) {
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
          },
        })
      }
    },

    * update ({ payload }, { call, put, select }) {
      const currentItem = yield select(state => state.cityCollection.currentItem)

      if(currentItem.collecitonDetail.length === 0){
        throw '已选城市为空，不允许编辑操作，如果为空，建议删除该集合'
      }
      const d = {}
      d.collecitonDetail = currentItem.collecitonDetail
      //d.user = 'admin'
      //d.id = currentItem.id
      d.collectionName = payload.collectionName

      const data = yield call(cityCollectionInfoService.update, d,currentItem.id)

      if(data){
        if(data.data.data.code != 200){
          throw data.data.data.message
        }
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({ type: 'hideUpdateModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
          },
        })
        return 200
      }
    },

    * selectCityByProvince ({ payload }, { call, put, select }) {
      const param = {
        provCode: payload,
        queryType: '2',
      }
      const cityList = yield call(cityCollectionInfoService.regionCityList, param)
      if (cityList) {
        const selectedList = yield select(state => state.cityCollection.selectedList)
        const map = new Map()
        selectedList.map((item) =>{
          map.set(item.cityCode, item.cityName)
        })
        const d = []
        cityList.data.data.map((item) =>{
          if(!map.has(item.id)){
            d.push(item)
          }
        })

        yield put({
          type: 'updateCityList',
          payload: { citys: d,        allCitys:cityList.data.data, },
        })
      }
    },
    * removeSelectCheckBox ({ payload }, { call, put, select }) {
      /*const cityList = yield select(state => state.cityCollection.targetCheckboxs)
      cityList.splice(cityList.findIndex(item => item.value === payload), 1)
      yield put({
        type: 'updateRemoveSelectCheckBox',
        payload: cityList,
      })*/

      const allCitys = yield select(state => state.cityCollection.allCitys)
      const cityListOption = yield select(state => state.cityCollection.cityListOption)
      const selectedList = yield select(state => state.cityCollection.selectedList)


      selectedList.splice(selectedList.findIndex(item => item.cityCode === `${payload}`), 1)

      let isUp = false
      if(allCitys.length > 0) {
        allCitys.map((item) => {
          if (item.id === payload) {
            cityListOption.push(item)
            isUp = true
          }
        })

        if (isUp) {
          yield put({
            type: 'updateCityList',
            payload: {citys: cityListOption,allCitys:allCitys},
          })
        }
      }
    },
    * removeUpdateSelectCheckBox ({ payload }, { call, put, select }) {

      const allCitys = yield select(state => state.cityCollection.allCitys)
      const cityListOption = yield select(state => state.cityCollection.cityListOption)
      const currentItem = yield select(state => state.cityCollection.currentItem)
      currentItem.collecitonDetail.splice(currentItem.collecitonDetail.findIndex(item => item.cityCode === `${payload}`), 1)

      let isUp = false
      if(allCitys.length > 0){
        allCitys.map((item) => {
          if(item.id === payload){
            cityListOption.push(item)
            isUp = true
          }
        })

        if(isUp){
          yield put({
            type: 'updateCityList',
            payload: { citys: cityListOption ,allCitys:allCitys},
          })
        }

      }

      yield put({
        type: 'putItem',
        payload: currentItem,
      })
    },
    * delete ({ payload }, { call, put, select }) {
      const data = yield call(cityCollectionInfoService.deleteCollectionInfo, payload)
      const collectionType = yield select(state => state.cityCollection.collectionType)

      if (data) {
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
           queryType : collectionType,
          },
        })
      }
    },
    * updateUpdateSelectCheckBox ({ payload }, { call, put, select }) {

      const _currentItem = yield select(state => state.cityCollection.currentItem)

      if (payload.length === 0) {
        const _data = yield call(cityCollectionInfoService.getCityCollectionInfo, _currentItem)

        if (_data) {
          yield put({
            type: 'putItem',
            payload: _data.data.data,
          })
        }
      } else {
        //const _data = yield call(cityCollectionInfoService.getCityCollectionInfo, _currentItem)


        //cityListOption: payload.citys,
        const citys = yield select(state => state.cityListOption)
        const c = payload[payload.length-1].split(',')
        const cityName = c[1];
        const cityCode = c[0];
        const present = {'cityName': cityName, 'cityCode':cityCode}

        const _data = []
        _data.push(present)

        _currentItem.collecitonDetail.map((item) =>{
          const m = {"cityName":item.cityName,
            "cityCode":item.cityCode,
          }
          _data.push(m)
        })

        _currentItem.collecitonDetail = _data
        if (_data) {
          yield put({
            type: 'putItem',
            payload: _currentItem,
          })
        }
      }
    },

    //点击候选后 将 候选移除 在 已选
    * onSelected ({ payload }, { call, put, select }) {

      const c = payload.split(',')
      const cityName = c[1];
      const cityCode = c[0];
      const present = {'cityName': cityName, 'cityCode':cityCode}

      const cityListOption = yield select(state => state.cityCollection.cityListOption)
      const currentItem = yield select(state => state.cityCollection.currentItem)
      const selectedList = yield select(state => state.cityCollection.selectedList)
      const map = new Map()
      map.set(cityCode,cityName)
      selectedList.push(present)
      selectedList.map((item) =>{
        map.set(item.cityCode, item.cityName)
      })

      const d = []
      cityListOption.map((item) =>{
        if(!map.has(item.id)){
          d.push(item)
        }
      })
      currentItem.collecitonDetail = selectedList
      yield put({
        type: 'onSelectedSuccess',
        payload:{
          currentItem:currentItem,
          selectedList:selectedList,
          cityListOption:d
        } ,
      })
    },

    * showProvinceCreate ({ payload }, { call, put, select }) {
      const provinceList = yield call(cityCollectionInfoService.regionProvinceList)

      if (provinceList) {
        yield put({
          type: 'showProvinceModal',
          payload: provinceList.data.data,
        })
      }
    },

    * onSelectedProvince ({ payload }, { call, put, select }) {

      const c = payload.split(',')
      const cityName = c[1];
      const cityCode = c[0];
      const present = {'cityName': cityName, 'cityCode':cityCode}

      const cityListOption = yield select(state => state.cityCollection.candidateProvinceList)
      const currentItem = yield select(state => state.cityCollection.currentItem)
      const selectedList = yield select(state => state.cityCollection.selectedProvinceList)
      const map = new Map()
      map.set(cityCode,cityName)
      selectedList.push(present)
      selectedList.map((item) =>{
        map.set(item.cityCode, item.cityName)
      })

      const d = []
      cityListOption.map((item) =>{
        if(!map.has(item.id)){
          d.push(item)
        }
      })

      yield put({
        type: 'onSelectedProvinceSuccess',
        payload:{
          selectedList:selectedList,
          candidateProvinceList:d
        } ,
      })
    },

    * removeSelectProvinceCheckBox ({ payload }, { call, put, select }) {

      const candidateProvinceList = yield select(state => state.cityCollection.candidateProvinceList)
      const selectedProvinceList = yield select(state => state.cityCollection.selectedProvinceList)

      selectedProvinceList.splice(selectedProvinceList.findIndex(item => item.cityCode === `${payload.cityCode}`), 1)
      candidateProvinceList.push({'id': payload.cityCode, 'desc': payload.cityName})

      yield put({
        type: 'removeProvinceList',
        payload: {
          candidateProvinceList: candidateProvinceList,
          selectedProvinceList:selectedProvinceList
        },
      })

    },

    * createProvince ({ payload }, { call, put, select }) {
      const selectedProvinceList = yield select(state => state.cityCollection.selectedProvinceList)

      if(selectedProvinceList.length === 0){
        throw '已选省份为空，不允许创建操作'
      }

      const d = {}
      d.collecitonDetail = selectedProvinceList
      d.collectionName = payload.collectionName

      d.type =  3
      const data = yield call(cityCollectionInfoService.createProvince, d)
      if (data) {
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({ type: 'hideProvinceModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
            queryType:3,
          },
        })
      }
    },

    * showRegionCreate ({ payload }, { call, put, select }) {
      const provinceList = yield call(cityCollectionInfoService.regionProvinceList)

      if (provinceList) {
        yield put({
          type: 'showRegionModal',
          payload: {
            addrOptions:  provinceList.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
          },
        })
      }
    },

    * onSelectedProvinceCity ({ payload }, { call, put, select }) {

      const param = {"cityCode":payload,"queryType":3}

      const data = yield call(manageCarrierLineService.addr, param)

      //candidateRegionList
      if (data) {
        yield put({
          type: 'showRegioneModal',
          payload: data.data.data,
        })
      }
    },

    /*
    * 加载二级行政区域
    * */

    * lazilyAddr ({ payload = {} }, { call, put }) {

      const param = {"provCode":payload.value,"queryType":2}
      const data = yield call(manageCarrierLineService.addr, param)
      if(data){
        payload.loading = false;
        payload.children = data.data.data.map((item) =>{
          const m = {'value':item.id,'label':item.desc,'isLeaf': true};
          return m;})
      }
    },

    * onSelectedRegion ({ payload }, { call, put, select }) {

      const c = payload.split(',')
      const cityName = c[1];
      const cityCode = c[0];
      const present = {'cityName': cityName, 'cityCode':cityCode}

      const cityListOption = yield select(state => state.cityCollection.candidateRegionList)
      const currentItem = yield select(state => state.cityCollection.currentItem)
      const selectedList = yield select(state => state.cityCollection.selectedRegionList)
      const map = new Map()
      map.set(cityCode,cityName)
      selectedList.push(present)
      selectedList.map((item) =>{
        map.set(item.cityCode, item.cityName)
      })

      const d = []
      cityListOption.map((item) =>{
        if(!map.has(item.id)){
          d.push(item)
        }
      })

      yield put({
        type: 'onSelectedRegionSuccess',
        payload:{
          selectedList:selectedList,
          candidateRegionList:d
        } ,
      })
    },

    * removeSelectRegionCheckBox ({ payload }, { call, put, select }) {

      const candidateRegionList = yield select(state => state.cityCollection.candidateRegionList)
      const selectedRegionList = yield select(state => state.cityCollection.selectedRegionList)

      selectedRegionList.splice(selectedRegionList.findIndex(item => item.cityCode === `${payload.cityCode}`), 1)
      candidateRegionList.push({'id': payload.cityCode, 'desc': payload.cityName})

      yield put({
        type: 'removeRegionList',
        payload: {
          candidateRegionList: candidateRegionList,
          selectedRegionList:selectedRegionList
        },
      })
    },

    * createRegion ({ payload }, { call, put, select }) {
      const selectedRegionList = yield select(state => state.cityCollection.selectedRegionList)

      if(selectedRegionList.length === 0){
        throw '已选区为空，不允许创建操作'
      }

      const d = {}
      d.collecitonDetail = selectedRegionList
      d.collectionName = payload.collectionName

      d.type =  3
      const data = yield call(cityCollectionInfoService.createRegion, d)
      if (data) {
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({ type: 'hideRegionModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
            queryType:2,
          },
        })
      }
    },

    * showProvinceEidtModal ({ payload }, { call, put, select }) {
      const data = yield call(cityCollectionInfoService.getProvinceCollectionInfo, payload)

      const provinceList = yield call(cityCollectionInfoService.regionProvinceList)

      /*modalProvinceVisible: false,//省
        candidateProvinceList:[], //候选省列表
        selectedProvinceList:[],//已选省列表
        updateProvinceModalVisible: false,*/
      const item = data.data.data
      const map = new Map()
      item.collecitonDetail.map((item) =>{
        map.set(item.cityCode, item.cityName)
      })

      const d = []
      provinceList.data.data.map((item) =>{
        if(!map.has(item.id)){
          d.push(item)
        }
      })

      if (data) {
        yield put({
          type: 'showUpdateProvinceModal',
          payload:{
            currentItem:data.data.data,
            candidateProvinceList:d,
            selectedProvinceList:item.collecitonDetail
          } ,
        })
      }
    },

    * showRegionEidtModal ({ payload }, { call, put, select }) {
      const data = yield call(cityCollectionInfoService.getRegionCollectionInfo, payload)


  /*    "cityName": "沈阳",
        "cityCode": "210100",
        "provName": "辽宁",
        "provCode": "210000",*/


     // const provinceList = yield call(cityCollectionInfoService.regionProvinceList)

      const param = {"cityCode":data.data.data.cityCode,"queryType":3}

      const regionList = yield call(manageCarrierLineService.addr, param)

      const item = data.data.data
      const map = new Map()
      item.collecitonDetail.map((item) =>{
        map.set(item.cityCode, item.cityName)
      })

      const d = []
      regionList.data.data.map((item) =>{
        if(!map.has(item.id)){
          d.push(item)
        }
      })

      if (data) {
        yield put({
          type: 'showUpdateRegionModal',
          payload:{
            currentItem:data.data.data,
            candidateRegionList:d,
            selectedRegionList:item.collecitonDetail
          } ,
        })
      }
    },

    * updateProvince ({ payload }, { call, put, select }) {
      const currentItem = yield select(state => state.cityCollection.currentItem)
      const selectedProvinceList = yield select(state => state.cityCollection.selectedProvinceList)
      if(currentItem.collecitonDetail.length === 0){
        throw '已选省份为空，不允许编辑操作，如果为空，建议删除该集合'
      }
      const d = {}
      d.collecitonDetail = selectedProvinceList
      //d.user = 'admin'
      //d.id = currentItem.id
      d.collectionName = payload.collectionName

      const data = yield call(cityCollectionInfoService.updateProvince, d,currentItem.id)

      if(data){
        if(data.data.data.code != 200){
          throw data.data.data.message
        }
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({ type: 'hideUpdateProvinceModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
            queryType:3,
          },
        })
        return 200
      }
    },

    * updateRegion ({ payload }, { call, put, select }) {
      const currentItem = yield select(state => state.cityCollection.currentItem)
      const selectedRegionList = yield select(state => state.cityCollection.selectedRegionList)
      if(currentItem.collecitonDetail.length === 0){
        throw '已选省份为空，不允许编辑操作，如果为空，建议删除该集合'
      }
      const d = {}
      d.collecitonDetail = selectedRegionList
      //d.user = 'admin'
      //d.id = currentItem.id
      d.collectionName = payload.collectionName

      const data = yield call(cityCollectionInfoService.updateRegion, d,currentItem.id)

      if(data){
        if(data.data.data.code != 200){
          throw data.data.data.message
        }
        const page = yield select(state => state.cityCollection.pagination.current)
        const pageSize = yield select(state => state.cityCollection.pagination.pageSize)
        yield put({ type: 'hideUpdateRegionModal' })
        yield put({
          type: 'query',
          payload: {
            page,
            pageSize,
            queryType:2,
          },
        })
        return 200
      }
    },

  },

  reducers: {

    onSelectedSuccess (state, { payload }){
      return {
        ...state,
        selectedList: payload.selectedList,
        cityListOption:payload.cityListOption,
        currentItem:payload.currentItem,
      }
    },
    changeTransferChange (state, { payload }) {
      return {
        ...state,
        targetKeys: payload.nextTargetKeys,
      }
    },
    updateRemoveSelectCheckBox (state, { payload }) {
      return {
        ...state,
        targetCheckboxs: payload,
      }
    },
    updateSelectCheckBox (state, { payload }) {
      const checkedBox = payload.map((item) => {
        return {
          value: item.split(',')[0],
          label: item.split(',')[1],
        }
      })
      return {
        ...state,
        targetCheckboxs: checkedBox,
      }
    },
    putItem (state, { payload }) {
      return {
        ...state,
        currentItem: payload,
      }
    },
    updateProvinceList (state, { payload }) {
      return {
        ...state,
        provinceListOption: payload,
      }
    },
    updateCityList (state, { payload }) {
      return {
        ...state,
        cityListOption: payload.citys,
        allCitys:payload.allCitys,
      }
    },
    showModal (state, { payload }) {
      return {
        ...state,
        modalVisible: true,
        allCitys:[],//市全集
        candidateList:[], //候选列表
        selectedList:[],//已选择列表
        cityListOption:[],
      }
    },
    showUpdateModal (state, { payload }) {
      // const checked = payload.collecitonDetail.map((i) => { return `${i.cityCode},${i.cityName}` })
      return {
        ...state,
        updateModalVisible: true,
        currentItem: payload.currentItem,
        selectedList:payload.selectedList,
        cityListOption:[],
        // updateCheckBoxDefault: checked,
      }
    },
    hideUpdateModal (state, { payload }) {
      return {
        ...state,
        updateModalVisible: false,
      }
    },

    hideModal (state) {
      return {
        ...state,
        modalVisible: false,
        selectedRowKeys: [],
        provinceListOption: [],
        cityListOption: [],
        targetKeys: [],
        targetCheckboxs: [],
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

    showProvinceModal(state, { payload }) {
      return {
        ...state,
        modalProvinceVisible: true,
        candidateProvinceList: payload,
        selectedProvinceList:[],
      }
    },

    hideProvinceModal (state) {
      return {
        ...state,
        modalProvinceVisible: false,
        candidateProvinceList:[],
        selectedProvinceList:[],
      }
    },

    hideRegionModal (state) {
      return {
        ...state,
        modalRegionVisible: false,
        candidateRegionList:[],
        selectedRegionList:[],
      }
    },

    onSelectedProvinceSuccess (state, { payload }){
      return {
        ...state,
        selectedProvinceList: payload.selectedList,
        candidateProvinceList:payload.candidateProvinceList,
      }
    },

    removeProvinceList (state, { payload }) {
      return {
        ...state,
        candidateProvinceList: payload.candidateProvinceList,
        selectedProvinceList:payload.selectedProvinceList,
      }
    },

    showRegionModal (state, { payload }) {
      return {
        ...state,
        addrOptions: payload.addrOptions,
        modalRegionVisible: true,
        candidateRegionList:[],
        selectedRegionList:[],
      }
    },
    collectionType (state, { payload }) {
      return { ...state, collectionType: payload}
    },

    showRegioneModal(state, { payload }) {
      return {
        ...state,
        candidateRegionList: payload,
        selectedRegionList:[],
      }
    },

    onSelectedRegionSuccess (state, { payload }){
      return {
        ...state,
        selectedRegionList: payload.selectedList,
        candidateRegionList:payload.candidateRegionList,
      }
    },

    removeRegionList (state, { payload }) {
      return {
        ...state,
        candidateRegionList: payload.candidateRegionList,
        selectedRegionList:payload.selectedRegionList,
      }
    },

    showUpdateProvinceModal (state, { payload }) {
      // const checked = payload.collecitonDetail.map((i) => { return `${i.cityCode},${i.cityName}` })
      return {
        ...state,
        updateProvinceModalVisible: true,
        currentItem: payload.currentItem,
        candidateProvinceList:payload.candidateProvinceList,
        selectedProvinceList: payload.selectedProvinceList,
      }
    },

    showUpdateRegionModal (state, { payload }) {
      // const checked = payload.collecitonDetail.map((i) => { return `${i.cityCode},${i.cityName}` })
      return {
        ...state,
        updateRegionModalVisible: true,
        currentItem: payload.currentItem,
        candidateRegionList:payload.candidateRegionList,
        selectedRegionList: payload.selectedRegionList,
      }
    },

    hideUpdateProvinceModal (state, { payload }) {
      return {
        ...state,
        updateProvinceModalVisible: false,
      }
    },

    hideUpdateRegionModal (state, { payload }) {
      return {
        ...state,
        updateRegionModalVisible: false,
      }
    },

    hideUpdateRegionModal (state, { payload }) {
      return {
        ...state,
        updateRegionModalVisible: false,
      }
    },

  },
})
