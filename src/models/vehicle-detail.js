/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import * as waybillService from 'services/waybillService'
import * as cityCollectionInfoService from 'services/cityCollectionInfoService'
import { pageModel } from './common'
import pathToRegexp from 'path-to-regexp'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'vehicleDetail',

  state: {
    currentItem: {},
    nomalPicsModalVisible: false,
    exceptionPicsModalVisible: false,
    insurancePicsModalVisible: false,
    referPicsModalVisible: false,
    showEditCarModalVisible: false,
    editShowNomalPicsModalVisible: false,
    ldsPicsModalVisible: false,
    editable: false,
    modalType: 'create',
    pics: [],
    nomalPics: [],
    nomalPicsActiveIndex: 0,
    exceptionPics: [],
    exceptionPicsActiveIndex: 0,
    insurancePics: [],
    insurancePicsActiveIndex: 0,
    referPics: [],
    lsdreferPics:[],
    referPicsActiveIndex: 0,
    images: [],
    selectedOptionsLabel: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    regionResultList: [],
    orderBaseId: '',
    vehicleId: '',

    guaranteeSlipVisible: false,//保单
    guaranteeSlipFileList: {},

    deliveryVehicleSlipVisible: false,//交车单
    deliveryVehicleSlipFileList: {},

    lsDeliveryVehicleSlipVisible: false,//入物流库交车单
    lsDeliveryVehicleSlipFileList: {},
    preViewLsDeliveryVisible:false,
    preViewLsDeliveryUrl:'',
    ldsReferPicsActiveIndex: 0,

    exceptionPicsVisible: false,//异常照片
    exceptionPicsFileList: {},

    exceptionRemarkVisible:false,//异常照片描述
    exceptionPicsItem:{},

    mileagePicFileList:[],//里程
    vinPicFileList:[],//车架号
    f45PicFileList:[],//前45度
    b45PicFileList:[],//后45度
    fInsidePicFileList:[],//内饰(前)
    bInsidePicFileList:[],//内饰（后）
    rightPicFileList:[],//右侧
    enginePicFileList:[],//发动机

    controlDisplay:{},//控制上传控件是否显示

    pickerInfo:[],//提车人
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/vehicle-detail/edit/')) {
          dispatch({
            type: 'query',
            payload: {
              orderBaseId: location.pathname.split('/')[3],
              vehicleId: location.pathname.split('/')[4],
              updateUser: 'zzh',
              editable: true,
            },
          })
          dispatch({
            type: 'loadAddressData',
          })
        } else if (location.pathname.includes('/vehicle-detail/')) {
          dispatch({
            type: 'query',
            payload: {
              orderBaseId: location.pathname.split('/')[2],
              vehicleId: location.pathname.split('/')[3],
              updateUser: 'zzh',
              editable:false,
            },
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      console.log(payload)

      const data = yield call(waybillService.getVehicleDetail, payload)
      console.log(data)
      if (data) {

        yield put({
          type: 'putItem',
          payload: data.data.data,
        })
        if (payload.editable) {
          yield put({
            type: 'updateEditable',
            payload: { editable: true },
          })
        }else {
          yield put({
            type: 'updateEditable',
            payload: { editable: false },
          })
        }
      }
    },
    * loadAddressData ({ payload }, { call, put, select }) {
      const regionResult = yield call(cityCollectionInfoService.regionProvinceList)
      if (regionResult) {
        yield put({
          type: 'putRegionResult',
          payload: regionResult.data.data,
        })
      }
    },
    * delete ({ payload }, { call, put, select }) {
      const data = yield call(waybillService.removeOnwayInfo, payload)
      if (data) {
        yield put({
          type: 'query',
          payload: {
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            updateUser: payload.updateUser,
            editable:true,
          },
        })
      } else {
        throw data
      }
    },
    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * load2Address ({ payload = {} }, { call, put, select }) {
      const data = yield call(waybillService.get2RegionList, { provCode: payload.value, queryType: 2 })
      if (data) {
        payload.loading = false
        payload.children = data.data.data.map((item) => {
          const m = { value: item.id, label: item.desc, isLeaf: true }
          return m
        })
      }
    },

    * updateVin ({ payload }, { select, call, put }) {
      const currentItem = yield select(({ vehicleDetail }) => vehicleDetail.currentItem)
      const data = yield call(waybillService.updateVin, {
        orderBaseId: currentItem.orderBaseId,
        vehicleId: currentItem.vehicleId,
        vin: payload.vin,
        currentUser: payload.currentUser,
      })
      if (data) {
        yield put({ type: 'cancelEditCarModal' })
        yield put({ type: 'query',
                     payload:{
                       orderBaseId: currentItem.orderBaseId,
                       vehicleId: currentItem.vehicleId,
                       currentUser: payload.currentUser,
                       editable:true,
                     }
        })
        return 200
      } else {
        throw data
      }
    },


    * updateExceptionPicsRemark ({ payload }, { select, call, put }) {

      const data = yield call(waybillService.updateVehiclePicsDesc, payload)

      if (data) {
        yield put({ type: 'cancelExceptionRemarkModal' })
        yield put({ type: 'query',
          payload:{
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            editable:true,
            currentUser: '',
          }
        })
        return 200
      } else {
        throw data
      }
    },

    * addOnWayInfo ({ payload }, { select, call, put }) {
      const currentItem = payload.currentItem
      const selectedOptionsLabel = yield select(({ vehicleDetail }) => vehicleDetail.selectedOptionsLabel)
      const data = yield call(waybillService.addOnWayInfo, {
        orderBaseId: currentItem.orderBaseId,
        vehicleId: currentItem.vehicleId,
        provinceName: selectedOptionsLabel[0],
        provinceCode: payload.provinceCode,
        nodeTime: payload.nodeTime,
        cityName: selectedOptionsLabel[1],
        cityCode: payload.cityCode,
        remark: payload.remark,
        currentUser: payload.currentUser,
        userCode: payload.userCode,
      })
      if (data) {
        yield put({ type: 'cancelAddOnwayInfoModal' })
        yield put({
          type: 'query',
          payload: {
            orderBaseId: currentItem.orderBaseId,
            vehicleId: currentItem.vehicleId,
            provinceName: selectedOptionsLabel[0],
            provinceCode: payload.provinceCode,
            nodeTime: payload.nodeTime,
            cityName: selectedOptionsLabel[1],
            cityCode: payload.cityCode,
            remark: payload.remark,
            currentUser: payload.currentUser,
            userCode: payload.userCode,
            editable: true,
          },
        })
      } else {
        throw data
      }
      return data
    },


    * updateNomalPics ({ payload }, { select, call, put }) {

      const waybill = yield call(waybillService.getByWaybillNo, {waybillNo:payload.orderBaseId})
      const vehicleNum =  waybill.data.data.vehicleNum //车数量

      let preMileagePicCondition = true
      let preVinPicCondition = true
      let preF45PicCondition = true
      let preB45PicCondition  = true
      let preFInsidePicCondition = true
      let preBInsidePicCondition = true
      let preRightPicCondition = true
      let preEnginePicCondition = true

      if(payload.newVehicle === 1){

        if(vehicleNum <= 5){
            preBInsidePicCondition = false,//内饰（后）
            preEnginePicCondition = false //发动机
            preRightPicCondition = false
        }else if(vehicleNum > 5){
            preF45PicCondition = false
            preB45PicCondition = false
            preFInsidePicCondition = false
            preBInsidePicCondition = false
            preRightPicCondition = false
            preEnginePicCondition = false
        }
      }

     /* console.log('preBInsidePicCondition:' + preMileagePicCondition)
      console.log('preVinPicCondition:' + preVinPicCondition)
      console.log('preF45PicCondition:' + preF45PicCondition)
      console.log('preB45PicCondition:' + preB45PicCondition)
      console.log('preFInsidePicCondition:' + preFInsidePicCondition)
      console.log('preBInsidePicCondition:' + preBInsidePicCondition)
      console.log('preRightPicCondition:' + preRightPicCondition)
      console.log('preEnginePicCondition:' + preEnginePicCondition)*/

      const mileagePicFileList = yield select(({ vehicleDetail }) => vehicleDetail.mileagePicFileList)
      const vinPicFileList = yield select(({ vehicleDetail }) => vehicleDetail.vinPicFileList)
      const f45PicFileList = yield select(({ vehicleDetail }) => vehicleDetail.f45PicFileList)
      const b45PicFileList = yield select(({ vehicleDetail }) => vehicleDetail.b45PicFileList)
      const fInsidePicFileList = yield select(({ vehicleDetail }) => vehicleDetail.fInsidePicFileList)
      const bInsidePicFileList = yield select(({ vehicleDetail }) => vehicleDetail.bInsidePicFileList)
      const rightPicFileList = yield select(({ vehicleDetail }) => vehicleDetail.rightPicFileList)
      const enginePicFileList = yield select(({ vehicleDetail }) => vehicleDetail.enginePicFileList)

     /* console.log(mileagePicFileList)
      console.log(vinPicFileList)
      console.log(f45PicFileList)
      console.log(b45PicFileList)
      console.log(fInsidePicFileList)
      console.log(bInsidePicFileList)
      console.log(rightPicFileList )
      console.log(enginePicFileList)*/

      if(preMileagePicCondition && (!mileagePicFileList )){
        return 401
      }
      if(preMileagePicCondition && ( mileagePicFileList.length === 0)){
        return 401
      }

      if(preVinPicCondition && (!vinPicFileList )){
        return 402
      }
      if(preVinPicCondition && (vinPicFileList.length === 0)){
        return 402
      }

      if(preF45PicCondition && (!f45PicFileList )){
        return 403
      }
      if(preF45PicCondition && ( f45PicFileList.length === 0)){
        return 403
      }

      if(preB45PicCondition && ( !b45PicFileList )){
        return 404
      }
      if(preB45PicCondition && ( b45PicFileList.length === 0)){
        return 404
      }

      if(preFInsidePicCondition && (!fInsidePicFileList )){
        return 405
      }
      if(preFInsidePicCondition && (fInsidePicFileList.length === 0)){
        return 405
      }

      if(preBInsidePicCondition && (!bInsidePicFileList)){
        return 406
      }

      if(preBInsidePicCondition && (bInsidePicFileList.length === 0)){
        return 406
      }

      if(preRightPicCondition && (!rightPicFileList)){
        return 407
      }
      if(preRightPicCondition && (rightPicFileList.length === 0)){
        return 407
      }

      if(preEnginePicCondition && (!enginePicFileList)){
        return 408
      }
      if(preEnginePicCondition && (enginePicFileList.length === 0)){
        return 408
      }

      const savePictures  = [];

      if(mileagePicFileList){
        const mileagePic = mileagePicFileList[0]
        savePictures.push({
          desc:'里程',
          ossPictureId:mileagePic.uid,
          ossPictureUrl:mileagePic.url,
          ossThumbnailUrl:mileagePic.url,
          pictureId:mileagePic.uid === mileagePic.key?'':mileagePic.key,
          picturePosition:4
        });
      }

      if(vinPicFileList){
        const vinPic = vinPicFileList[0]
        savePictures.push({
          desc:'车架号',
          ossPictureId:vinPic.uid,
          ossPictureUrl:vinPic.url,
          ossThumbnailUrl:vinPic.url,
          pictureId:vinPic.uid === vinPic.key?'':vinPic.key,
          picturePosition:9
        });
      }

      if(f45PicFileList){
        const f45Pic = f45PicFileList[0]
        savePictures.push({
          desc:'前45度',
          ossPictureId:f45Pic.uid,
          ossPictureUrl:f45Pic.url,
          ossThumbnailUrl:f45Pic.url,
          pictureId:f45Pic.uid === f45Pic.key?'':f45Pic.key,
          picturePosition:1
        });
      }

      if(b45PicFileList){
        const b45Pic = b45PicFileList[0]
        savePictures.push({
          desc:'后45度',
          ossPictureId:b45Pic.uid,
          ossPictureUrl:b45Pic.url,
          ossThumbnailUrl:b45Pic.url,
          pictureId:b45Pic.uid === b45Pic.key?'':b45Pic.key,
          picturePosition:2
        });
      }

      if(fInsidePicFileList){
        const fInsidePic = fInsidePicFileList[0]
        savePictures.push({
          desc:'内饰(前)',
          ossPictureId:fInsidePic.uid,
          ossPictureUrl:fInsidePic.url,
          ossThumbnailUrl:fInsidePic.url,
          pictureId:fInsidePic.uid === fInsidePic.key?'':fInsidePic.key,
          picturePosition:3
        });
      }

      if(bInsidePicFileList){
        const bInsidePic = bInsidePicFileList[0]
        savePictures.push({
          desc:'内饰(后)',
          ossPictureId:bInsidePic.uid,
          ossPictureUrl:bInsidePic.url,
          ossThumbnailUrl:bInsidePic.url,
          pictureId:bInsidePic.uid === bInsidePic.key?'':bInsidePic.key,
          picturePosition:8
        });
      }

      if(rightPicFileList){
        const rightPic = rightPicFileList[0]
        savePictures.push({
          desc:'右侧',
          ossPictureId:rightPic.uid,
          ossPictureUrl:rightPic.url,
          ossThumbnailUrl:rightPic.url,
          pictureId:rightPic.uid === rightPic.key?'':rightPic.key,
          picturePosition:6
        });
      }

      if(enginePicFileList){
        const enginePic = enginePicFileList[0]
        savePictures.push({
          desc:'发动机',
          ossPictureId:enginePic.uid,
          ossPictureUrl:enginePic.url,
          ossThumbnailUrl:enginePic.url,
          pictureId:enginePic.uid === enginePic.key?'':enginePic.key,
          picturePosition:7
        });
      }


      const data = {
        ...payload,
        savePictures:savePictures
      }

     const response = yield call(waybillService.maintenanceVehiclePicture, data)
      if (response) {
        //{orderBaseId: "675", vehicleId: "327", updateUser: "zzh", editable: true}
        yield put({ type: 'cancelNomalPicsModal' })
        yield put({
          type: 'query',
          payload: {
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            updateUser: 'zzh',
            editable:true,

          },
        })
      }
    },

    * editShowNomalPicsModal ({ payload = {} }, { call, put,select }) {

      const currentItem = payload

      const waybill = yield call(waybillService.getByWaybillNo, {waybillNo:currentItem.orderBaseId})
      const vehicleNum =  waybill.data.data.vehicleNum //车数量

      let preMileagePicCondition = true
      let preVinPicCondition = true
      let preF45PicCondition = true
      let preB45PicCondition  = true
      let preFInsidePicCondition = true
      let preBInsidePicCondition = true
      let preRightPicCondition = true
      let preEnginePicCondition = true


      if(payload.newVehicle === 1){

        if(vehicleNum <= 5){
          preBInsidePicCondition = false,//内饰（后）
          preEnginePicCondition = false //发动机
          preRightPicCondition = false
        }else if(vehicleNum > 5){
          preF45PicCondition = false
          preB45PicCondition = false
          preFInsidePicCondition = false
          preBInsidePicCondition = false
          preRightPicCondition = false
          preEnginePicCondition = false
        }
      }


      const controlDisplay = {
        preMileagePicCondition:preMileagePicCondition,
        preVinPicCondition:preVinPicCondition,
        preF45PicCondition:preF45PicCondition,
        preB45PicCondition :preB45PicCondition,
        preFInsidePicCondition:preFInsidePicCondition,
        preBInsidePicCondition:preBInsidePicCondition,
        preRightPicCondition:preRightPicCondition,
        preEnginePicCondition:preEnginePicCondition
      }


      let  mileagePicFileList,//里程
        vinPicFileList,//车架号
        f45PicFileList,//前45度
        b45PicFileList,//后45度
        fInsidePicFileList,//内饰(前)
        bInsidePicFileList,//内饰（后）
        rightPicFileList,//右侧
        enginePicFileList//发动机

      currentItem.pictures.map((file) => {
        if (file.pictureType === 1 && file.picturePosition === 4){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          mileagePicFileList = [f]
        }
        if (file.pictureType === 1 && file.picturePosition === 9){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          vinPicFileList = [f]
        }

        if (file.pictureType === 1 && file.picturePosition === 1){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          f45PicFileList = [f]
        }
        if (file.pictureType === 1 && file.picturePosition === 2){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          b45PicFileList = [f]
        }

        if (file.pictureType === 1 && file.picturePosition === 3){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          fInsidePicFileList = [f]
        }

        if (file.pictureType === 1 && file.picturePosition === 8){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          bInsidePicFileList = [f]
        }

        if (file.pictureType === 1 && file.picturePosition === 6){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          rightPicFileList = [f]
        }

        if (file.pictureType === 1 && file.picturePosition === 7){
          const f  = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          enginePicFileList = [f]
        }

      })

      yield put({
        type: 'editShowNomalPicsSuccess',
        payload: {
          currentItem: currentItem,
          mileagePicFileList:mileagePicFileList,
          vinPicFileList:vinPicFileList,
          f45PicFileList:f45PicFileList,
          b45PicFileList:b45PicFileList,
          fInsidePicFileList:fInsidePicFileList,
          bInsidePicFileList:bInsidePicFileList,
          rightPicFileList:rightPicFileList,
          enginePicFileList:enginePicFileList,
          controlDisplay:controlDisplay,
        },
      })
    },

    * editShowGuaranteeSlipModal ({ payload = {} }, { call, put,select }) {

      const currentItem = payload


      const fileList = [];
      currentItem.pictures.map((file) => {
        if (file.pictureType === 4 ) {
          const f = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          fileList.push(f);
        }

      })
      let guaranteeSlipFileList = {
        fileList:fileList
      }

      yield put({
        type: 'showGuaranteeSlipModalSuccess',
        payload:{
          guaranteeSlipFileList:guaranteeSlipFileList
        }
      })
    },

    * editShowDeliveryVehicleSlipModal ({ payload = {} }, { call, put,select }) {

      const currentItem = payload
      const response = yield call(waybillService.getPickerInfo, currentItem)


      let pickerInfo = []
      if(response && response.data){
          pickerInfo = response.data.data
      }

      const fileList = [];
      currentItem.pictures.map((file) => {
        if (file.pictureType === 6 ) {
          const f = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          fileList.push(f);
        }

      })
      let deliveryVehicleSlipFileList = {
        fileList:fileList
      }

      yield put({
        type: 'showDeliveryVehicleSlipModalSuccess',
        payload:{
          deliveryVehicleSlipFileList:deliveryVehicleSlipFileList,
          pickerInfo:pickerInfo
        }
      })
    },

    * editShowLSDeliveryVehicleSlipModal ({ payload = {} }, { call, put,select }) {

      const currentItem = payload

      const fileList = [];
      currentItem.pictures.map((file) => {
        if (file.pictureType === 7 ) {
          const f = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          fileList.push(f);
        }

      })
      let deliveryVehicleSlipFileList = {
        fileList:fileList
      }

      yield put({
        type: 'showLSDeliveryVehicleSlipModalSuccess',
        payload:{
          lsDeliveryVehicleSlipFileList:deliveryVehicleSlipFileList,
        }
      })
    },

    * editShowExceptionPicsModal ({ payload = {} }, { call, put,select }) {

      const currentItem = payload

      const fileList = [];
      currentItem.pictures.map((file) => {
        if (file.pictureType === 5 ) {
          const f = {
            key: file.pictureId,
            uid: file.ossPictureId,
            name: file.ossPictureId,
            status: 'done',
            url: file.ossPictureUrl,
          }
          fileList.push(f);
        }

      })
      let exceptionPicsFileList = {
        fileList:fileList
      }

      yield put({
        type: 'showExceptionPicsModalSuccess',
        payload:{
          exceptionPicsFileList:exceptionPicsFileList
        }
      })
    },

    * upLoadGuaranteeSlip ({ payload }, { call, put, select }) {
      let updateFileList = yield select(state => state.vehicleDetail.guaranteeSlipFileList)

      console.log('upLoadGuaranteeSlip')
      console.log(updateFileList)
      console.log('upLoadGuaranteeSlip')
      const guaranteeSlip = updateFileList.fileList.map((item) => {
        let m
        if(item.url){
          m = {
            "ossPictureId":item.name,
            "ossPictureUrl":item.url,
            "ossThumbnailUrl":item.url,
            "pictureId":item.key,
          }
        }else{
          m = {
            "ossPictureId":item.response.data.file_id?item.response.data.file_id:item.response.data.ossPictureId,
            "ossPictureUrl":item.response.data.url,
            "ossThumbnailUrl":item.response.data.icon,
            "pictureId":item.response.data.pictureId?item.response.data.pictureId:'',
          }
        }
        return m
      })

      const guaranteeSlipReq = {
        ...payload,
        "savePictures":guaranteeSlip,
        userCode: 'zzh',
      }

      console.log(JSON.stringify(guaranteeSlipReq))

     const response = yield call(waybillService.maintenanceVehiclePicture, guaranteeSlipReq)

      if (response) {
        yield put({ type: 'hideGuaranteeSlipModal' })
        yield put({
          type: 'query',
          payload: {
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            updateUser: 'zzh',
            editable:true,

          },
        })
        return 200
      } else {
        throw data
      }
    },

    * upLoadDeliveryVehicleSlip ({ payload }, { call, put, select }) {
      let updateFileList = yield select(state => state.vehicleDetail.deliveryVehicleSlipFileList)

      const guaranteeSlip = updateFileList.fileList.map((item) => {
        let m
        if(item.url){
          m = {
            "ossPictureId":item.name,
            "ossPictureUrl":item.url,
            "ossThumbnailUrl":item.url,
            "pictureId":item.key,
          }
        }else{
          m = {
            "ossPictureId":item.response.data.file_id?item.response.data.file_id:item.response.data.ossPictureId,
            "ossPictureUrl":item.response.data.url,
            "ossThumbnailUrl":item.response.data.icon,
            "pictureId":item.response.data.pictureId?item.response.data.pictureId:'',
          }
        }
        return m
      })

      const guaranteeSlipReq = {
        ...payload,
        "savePictures":guaranteeSlip,
        userCode: 'zzh',
      }

      const response = yield call(waybillService.maintenanceVehiclePicture, guaranteeSlipReq)

      if (response) {
        yield put({ type: 'hideDeliveryVehicleSlipModal' })
        yield put({
          type: 'query',
          payload: {
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            updateUser: 'zzh',
            editable:true,

          },
        })
        return 200
      } else {
        throw data
      }
    },

    * upLoadLSDeliveryVehicleSlip ({ payload }, { call, put, select }) {
      let updateFileList = yield select(state => state.vehicleDetail.lsDeliveryVehicleSlipFileList)

      const guaranteeSlip = updateFileList.fileList.map((item) => {
        let m
        if(item.url){
          m = {
            "ossPictureId":item.name,
            "ossPictureUrl":item.url,
            "ossThumbnailUrl":item.url,
            "pictureId":item.key,
          }
        }else{
          m = {
            "ossPictureId":item.response.data.file_id?item.response.data.file_id:item.response.data.ossPictureId,
            "ossPictureUrl":item.response.data.url,
            "ossThumbnailUrl":item.response.data.icon,
            "pictureId":item.response.data.pictureId?item.response.data.pictureId:'',
          }
        }
        return m
      })

      const guaranteeSlipReq = {
        ...payload,
        "savePictures":guaranteeSlip,
        userCode: 'zzh',
      }

      const response = yield call(waybillService.maintenanceVehiclePicture, guaranteeSlipReq)

      if (response) {
        yield put({ type: 'hideLSDeliveryVehicleSlipModal' })
        yield put({
          type: 'query',
          payload: {
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            updateUser: 'zzh',
            editable:true,

          },
        })
        return 200
      } else {
        throw data
      }
    },

    * upLoadExceptionPics ({ payload }, { call, put, select }) {
      let updateFileList = yield select(state => state.vehicleDetail.exceptionPicsFileList)

      const guaranteeSlip = updateFileList.fileList.map((item) => {
        let m
        if(item.url){
          m = {
            "ossPictureId":item.name,
            "ossPictureUrl":item.url,
            "ossThumbnailUrl":item.url,
            "pictureId":item.key?item.key:item.uid,
          }
        }else{
          m = {
            "ossPictureId":item.response.data.file_id?item.response.data.file_id:item.response.data.ossPictureId,
            "ossPictureUrl":item.response.data.url,
            "ossThumbnailUrl":item.response.data.icon,
            "pictureId":item.response.data.pictureId?item.response.data.pictureId:'',
          }
        }
        return m
      })

      const guaranteeSlipReq = {
        ...payload,
        "savePictures":guaranteeSlip,
        userCode: 'zzh',
      }

      const response = yield call(waybillService.maintenanceVehiclePicture, guaranteeSlipReq)

      if (response) {
        yield put({ type: 'hideExceptionPicsModal' })
        yield put({
          type: 'query',
          payload: {
            orderBaseId: payload.orderBaseId,
            vehicleId: payload.vehicleId,
            updateUser: 'zzh',
            editable:true,
          },
        })
        return 200
      } else {
        throw data
      }
    },

  },

  reducers: {

    mileagePicFileRemove (state, { payload }) {
      return {
        ...state,
        mileagePicFileList:[],
      }
    },

    mileagePicFileSuccess (state, { payload }) {
      return {
        ...state,
        mileagePicFileList:payload.mileagePicFileList.fileList,
      }
    },

    mileagePicFileDone (state, { payload }) {
      const file = payload.mileagePicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        mileagePicFileList:[f],
      }
    },

    vinPicFileRemove (state, { payload }) {
      return {
        ...state,
        vinPicFileList:[],
      }
    },
    vinPicFileSuccess (state, { payload }) {
      return {
        ...state,
        vinPicFileList:payload.vinPicFileList.fileList,
      }
    },

    vinPicFileDone (state, { payload }) {
      const file = payload.vinPicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        vinPicFileList:[f],
      }
    },

    f45PicFileRemove (state, { payload }) {
      return {
        ...state,
        f45PicFileList:[],
      }
    },
    f45PicFileSuccess (state, { payload }) {
      return {
        ...state,
        f45PicFileList:payload.f45PicFileList.fileList,
      }
    },

    f45PicFileDone (state, { payload }) {
      const file = payload.f45PicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        f45PicFileList:[f],
      }
    },

    b45PicFileRemove (state, { payload }) {
      return {
        ...state,
        b45PicFileList:[],
      }
    },
    b45PicFileSuccess (state, { payload }) {
      return {
        ...state,
        b45PicFileList:payload.b45PicFileList.fileList,
      }
    },

    b45PicFileDone (state, { payload }) {
      const file = payload.b45PicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        b45PicFileList:[f],
      }
    },

    finsidePicFileRemove (state, { payload }) {
      return {
        ...state,
        fInsidePicFileList:[],
      }
    },
    finsidePicFileSuccess (state, { payload }) {
      return {
        ...state,
        fInsidePicFileList:payload.fInsidePicFileList.fileList,
      }
    },

    finsidePicFileDone (state, { payload }) {
      const file = payload.fInsidePicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        fInsidePicFileList:[f],
      }
    },

    binsidePicFileRemove (state, { payload }) {
      return {
        ...state,
        bInsidePicFileList:[],
      }
    },
    binsidePicFileSuccess (state, { payload }) {
      return {
        ...state,
        bInsidePicFileList:payload.bInsidePicFileList.fileList,
      }
    },

    binsidePicFileDone (state, { payload }) {
      const file = payload.bInsidePicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        bInsidePicFileList:[f],
      }
    },

    rightPicFileRemove (state, { payload }) {
      return {
        ...state,
        rightPicFileList:[],
      }
    },
    rightPicFileSuccess (state, { payload }) {
      return {
        ...state,
        rightPicFileList:payload.rightPicFileList.fileList,
      }
    },

    rightPicFileDone (state, { payload }) {
      const file = payload.rightPicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        rightPicFileList:[f],
      }
    },

    enginePicFileRemove (state, { payload }) {
      return {
        ...state,
        enginePicFileList:[],
      }
    },
    enginePicFileSuccess (state, { payload }) {
      return {
        ...state,
        enginePicFileList:payload.enginePicFileList.fileList,
      }
    },

    enginePicFileDone (state, { payload }) {
      const file = payload.enginePicFileList.fileList[0].response.data
      const f  = {
        key: file.file_id,
        uid: file.file_id,
        name: file.file_id,
        status: 'done',
        url: file.url,
      }
      return {
        ...state,
        enginePicFileList:[f],
      }
    },

    editShowNomalPicsSuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
        editShowNomalPicsModalVisible: true,
      }
    },
    cancelNomalPicsModal (state, { payload }) {
      return {
        ...state,
        editShowNomalPicsModalVisible: false,
      }
    },
    changeCurrentItem (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },


    putRegionResult (state, { payload }) {
      return {
        ...state,
        regionResultList: payload.map((item) => {
          return {
            value: item.id,
            label: item.desc,
            isLeaf: false,
          }
        }),
      }
    },
    putItem (state, { payload }) {

      // const pics = payload.pictures.map((i) => { return { src: i.ossPictureUrl } })
      const pics = payload.pictures.map((i) => {
        return {
          src: i.ossPictureUrl,
          thumbnail: i.ossThumbnailUrl,
          pictureType: i.pictureType,
          desc: i.desc,
          ossPictureId: i.ossPictureId,
          picturePosition: i.picturePosition,
          picturePositionName: i.picturePositionName,
          pictureTypeName: i.pictureTypeName,
          pictureId: i.pictureId,

        }
      })
      const nomalPics = pics.map((i) => {
        // 1验车照片 2提车函 3运输合同  4保单信息 5异常照片 6交车单
        if (i.pictureType === 1) {
          return i
        }
      })
      const exceptionPics = pics.map((i) => {
        // 1验车照片 2提车函 3运输合同  4保单信息 5异常照片 6交车单
        if (i.pictureType === 5) {
          return i
        }
      })
      const insurancePics = pics.map((i) => {
        // 1验车照片 2提车函 3运输合同  4保单信息 5异常照片 6交车单
        if (i.pictureType === 4) {
          return i
        }
      })
      const referPics = pics.map((i) => {
        // 1验车照片 2提车函 3运输合同  4保单信息 5异常照片 6交车单
        if (i.pictureType === 6) {
          return i
        }
      })

      const lsdreferPics = pics.map((i) => {
        // 1验车照片 2提车函 3运输合同  4保单信息 5异常照片 6交车单
        if (i.pictureType === 7) {
          return i
        }
      })

      // const images = payload.pictures.map((i) => { return i.ossPictureUrl })
      const images = payload.pictures.map((i) => {
        return i.ossPictureUrl
      })
      return {
        ...state,
        currentItem: payload,
        pics,
        nomalPics: nomalPics.filter((val) => {
          return !(!val || val === '')
        }),
        exceptionPics: exceptionPics.filter((val) => {
          return !(!val || val === '')
        }),
        insurancePics: insurancePics.filter((val) => {
          return !(!val || val === '')
        }),
        referPics: referPics.filter((val) => {
          return !(!val || val === '')
        }),
        lsdreferPics:lsdreferPics.filter((val) => {
        return !(!val || val === '')
      }),
        images,
        modalVisible: false,
      }
    },
    updateEditable (state, { payload }) {
      return {
        ...state,
        editable: payload.editable,
      }
    },
    showModal (state, { payload }) {
      return {
        ...state,
        ...payload,
        modalVisible: true,
      }
    },
    showEditCarModal (state, { payload }) {
      return {
        ...state,
        showEditCarModalVisible: true,
      }
    },

    showEditExceptionPicsDescModal (state, { payload }) {

      return {
        ...state,
        exceptionPicsItem:{
          desc:payload.desc,
          pictureId:payload.pictureId,
          vehicleId:state.currentItem.vehicleId,
          orderBaseId:state.currentItem.orderBaseId,
        },
        exceptionRemarkVisible: true,
      }
    },

    showEditExceptionModal (state, { payload }) {
      return {
        ...state,
        exceptionPicsVisible: true,
      }
    },

    showGuaranteeSlipModalSuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
        guaranteeSlipVisible: true,
      }
    },

    showDeliveryVehicleSlipModalSuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
        deliveryVehicleSlipVisible: true,
      }
    },

    showLSDeliveryVehicleSlipModalSuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
        lsDeliveryVehicleSlipVisible: true,
      }
    },

    showExceptionPicsModalSuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
        exceptionPicsVisible: true,
      }
    },

    cancelEditCarModal (state, { payload }) {
      return {
        ...state,
        showEditCarModalVisible: false,
      }
    },

    cancelExceptionRemarkModal (state, { payload }) {
      return {
        ...state,
        exceptionRemarkVisible: false,
      }
    },

    closeNomalPicsImgViewer (state, { payload }) {
      return {
        ...state,
        nomalPicsModalVisible: false,
      }
    },
    closeExceptionPicsImgViewer (state, { payload }) {
      return {
        ...state,
        exceptionPicsModalVisible: false,
      }
    },
    closeInsurancePicsImgViewer (state, { payload }) {
      return {
        ...state,
        insurancePicsModalVisible: false,
      }
    },
    closeReferPicsImgViewer (state, { payload }) {
      return {
        ...state,
        referPicsModalVisible: false,
      }
    },
    closeLdsReferPicsImgViewer (state, { payload }) {
      return {
        ...state,
        ldsPicsModalVisible: false,
      }
    },
    startNomalPicsImgView (state, { payload }) {
      return {
        ...state,
        nomalPicsModalVisible: true,
        nomalPicsActiveIndex: payload.nomalPicsActiveIndex,
      }
    },
    startExceptionPicsImgView (state, { payload }) {
      return {
        ...state,
        exceptionPicsModalVisible: true,
        exceptionPicsActiveIndex: payload.exceptionPicsActiveIndex,
      }
    },
    startInsurancePicsImgView (state, { payload }) {
      return {
        ...state,
        insurancePicsModalVisible: true,
        insurancePicsActiveIndex: payload.insurancePicsActiveIndex,
      }
    },
    startReferPicsImgView (state, { payload }) {
      return {
        ...state,
        referPicsModalVisible: true,
        referPicsActiveIndex: payload.referPicsActiveIndex,
      }
    },
    startLdsReferPicsImgView (state, { payload }) {
      return {
        ...state,
        ldsPicsModalVisible: true,
        ldsReferPicsActiveIndex: payload.ldsReferPicsActiveIndex,
      }
    },

    updateNomalPicsActiveIndex (state, { payload }) {
      return {
        ...state,
        nomalPicsActiveIndex: payload.nomalPicsActiveIndex,
      }
    },
    updateExceptionPicsActiveIndex (state, { payload }) {
      return {
        ...state,
        exceptionPicsActiveIndex: payload.exceptionPicsActiveIndex,
      }
    },
    updateInsurancePicsActiveIndex (state, { payload }) {
      return {
        ...state,
        insurancePicsActiveIndex: payload.insurancePicsActiveIndex,
      }
    },
    updateReferPicsActiveIndex (state, { payload }) {
      return {
        ...state,
        referPicsActiveIndex: payload.referPicsActiveIndex,
      }
    },
    updateLdsReferPicsActiveIndex (state, { payload }) {
      return {
        ...state,
        ldsReferPicsActiveIndex: payload.ldsReferPicsActiveIndex,
      }
    },
    showAddOnwayInfoModal (state, { payload }) {
      return {
        ...state,
        showAddOnwayInfoModalVisible: true,
      }
    },
    cancelAddOnwayInfoModal (state, { payload }) {
      return {
        ...state,
        showAddOnwayInfoModalVisible: false,
      }
    },

    hideModal (state) {
      return {
        ...state,
        modalVisible: false,
      }
    },

    hideGuaranteeSlipModal (state) {
      return {
        ...state,
        guaranteeSlipVisible: false,
      }
    },

    hideExceptionPicsModal (state) {
      return {
        ...state,
        exceptionPicsVisible: false,
      }
    },

    hideDeliveryVehicleSlipModal (state) {
      return {
        ...state,
        deliveryVehicleSlipVisible: false,
      }
    },

    hideLSDeliveryVehicleSlipModal (state) {
      return {
        ...state,
        lsDeliveryVehicleSlipVisible: false,
      }
    },

    putBaseInfo (state, { payload }) {
      return {
        ...state,
        orderBaseId: payload.orderBaseId,
        vehicleId: payload.vehicleId,
      }
    },
    saveSelectedOptionsLabel (state, { payload }) {
      return {
        ...state,
        selectedOptionsLabel: payload,
      }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return {
        ...state,
        isMotion: !state.isMotion,
      }
    },

    guaranteeSlipFileDone (state, { payload }) {
      return {
        ...state,
        guaranteeSlipFileList:payload,
      }
    },

    deliveryVehicleSlipFileDone (state, { payload }) {
      return {
        ...state,
        deliveryVehicleSlipFileList:payload,
      }
    },

    lsDeliveryVehicleSlipFileDone (state, { payload }) {
      return {
        ...state,
        lsDeliveryVehicleSlipFileList:payload,
      }
    },

    exceptionPicsFileDone (state, { payload }) {
      return {
        ...state,
        exceptionPicsFileList:payload,
      }
    },

    guaranteeSlipFileRemove (state, { payload }) {

      const fileList =  state.guaranteeSlipFileList.fileList
      if(payload.url){
        fileList.splice(fileList.findIndex(item => (item.key?item.key:item.url?item.uid:item.response.data.file_id) === payload.uid ), 1)
      }else{
        fileList.splice(fileList.findIndex(item => (item.url?item.name:item.response.data.file_id === payload.response.data.file_id) === true), 1)
      }

      const guaranteeSlipFileList = {
        fileList:fileList
      }

      return {
        ...state,
        guaranteeSlipFileList: guaranteeSlipFileList,
      }

    },

    deliveryVehicleFileRemove (state, { payload }) {
      const fileList =  state.deliveryVehicleSlipFileList.fileList
      if(payload.url){
        fileList.splice(fileList.findIndex(item => (item.key?item.key:item.url?item.uid:item.response.data.file_id) === payload.uid ), 1)
      }else{
        fileList.splice(fileList.findIndex(item => (item.url?item.name:item.response.data.file_id === payload.response.data.file_id) === true), 1)
      }

      const deliveryVehicleSlipFileList = {
        fileList:fileList
      }

      return {
        ...state,
        deliveryVehicleSlipFileList: deliveryVehicleSlipFileList,
      }

    },

    lsDeliveryVehicleFileRemove (state, { payload }) {
      const fileList =  state.lsDeliveryVehicleSlipFileList.fileList
      if(payload.url){
        fileList.splice(fileList.findIndex(item => (item.key?item.key:item.url?item.uid:item.response.data.file_id) === payload.uid ), 1)
      }else{
        fileList.splice(fileList.findIndex(item => (item.url?item.name:item.response.data.file_id === payload.response.data.file_id) === true), 1)
      }

      const deliveryVehicleSlipFileList = {
        fileList:fileList
      }

      return {
        ...state,
        lsDeliveryVehicleSlipFileList: deliveryVehicleSlipFileList,
      }

    },

    exceptionPicsFileRemove (state, { payload }) {
      const fileList =  state.exceptionPicsFileList.fileList
      if(payload.url){
        fileList.splice(fileList.findIndex(item => (item.key?item.key:item.url?item.uid:item.response.data.file_id) === payload.uid ), 1)
      }else{
        fileList.splice(fileList.findIndex(item => (item.url?item.name:item.response.data.file_id === payload.response.data.file_id) === true), 1)
      }

      const exceptionPicsFileList = {
        fileList:fileList
      }

      return {
        ...state,
        exceptionPicsFileList: exceptionPicsFileList,
      }

    },
    onPreviewLsDelivery(state, { payload }) {
      return {
        ...state,
        preViewLsDeliveryUrl:payload.preViewLsDeliveryUrl,
        preViewLsDeliveryVisible: true,
      }
    },
    onPreviewCanCel(state,) {
      return {
        ...state,
        preViewLsDeliveryVisible: false,
      }
    },
  },



})
