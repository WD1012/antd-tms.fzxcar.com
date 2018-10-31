import modelExtend from 'dva-model-extend'
import { pageModel } from './common'
import * as dashboardSerivce from '../services/dashboard'
import queryString from 'query-string'

const initItem = 20;

export default modelExtend( pageModel,{
  namespace: 'dashboard',
  state: {
    dosthlistIOF:false, // false 合 / true 开
    earlyListOF:false,// false 合 / true 开
    dosthlistIF:[],
    dosthlistI:[],//代办金融物流
    warninglist: [],//预警列表
    buttonId:1,
    warningButtonId:1,
    earlyList:[],
    earlyListF:[],
    dosthIsOnOff:false,
    warningIsOnOff:false,
    badgeNum:{}, //徽章
    warningBadgeNum:{}, //预警徽章
    schedule:false,//定时控制
    dosthBarId:5,
    warningBarId:6,
  },

  reducers: {
    unfoldAllSuccess (state, { payload }) {
      return { ...state,  ...payload,}
    },

    dosthBarTab (state, { payload }) {
      return { ...state,  dosthBarId:payload.dosthBarId,}
    },

    doWarningBarTab (state, { payload }) {
      return { ...state,  warningBarId:payload.warningBarId,}
    },

    putBadgeNum (state, { payload }) {
      return { ...state, badgeNum:payload.badgeNum,}
    },
    putWarningBadgeNum (state, { payload }) {
      return { ...state, warningBadgeNum:payload.warningBadgeNum,}
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/dashboard' || pathname === '/') {

          const payload = queryString.parse(location.search)

          dispatch({ type: 'query' ,payload:{
            buttonId:1,
            warningButtonId:1,
          }})
         // dispatch({ type: 'queryWeather' })
        }
      })
    },
  },

  effects: {
    * query ({payload,}, { call, put,select }) {

      const dosthConut = yield call(dashboardSerivce.dosthConut,{isFinace:payload.buttonId} )

      const badgeNum = {
        allNum:0,
        bjz:0,
        dfp:0,
        tcfy:0,
        dfc:0,
        yczwtg:0,
        wbj:0,
        wtc:0,
        wzdc:0,
      }

      if(dosthConut){

        const d = dosthConut.data.data

        badgeNum.allNum = d.all
        badgeNum.bjz = d.quotation
        badgeNum.dfp = d.allocated
        badgeNum.tcfy = d.shipment
        badgeNum.dfc = d.put
        badgeNum.yczwtg = d.fail
        badgeNum.wbj = d.notOffer
        badgeNum.wtc = d.libToStore
        badgeNum.wzdc = d.libToStoreTransfer
      }

      yield put({
        type: 'putBadgeNum',
        payload: {
          badgeNum:badgeNum,
          schedule:true,
        },
      })

      const warningConut = yield call(dashboardSerivce.warningConut,{isFinace:payload.warningButtonId} )

      const warningBadgeNum = {
        allNum:0,
        wyz:0,
        wfy:0,
        wjc:0,
        wupzt:0,
        wdd:0,
        wupbd:0
      }

      if(warningConut){
        const d = warningConut.data.data
        warningBadgeNum.allNum = d.all
        warningBadgeNum.wyz = d.noInspection
        warningBadgeNum.wfy = d.unshipped
        warningBadgeNum.wjc = d.unpaidCar
        warningBadgeNum.wupzt = d.notWay
        warningBadgeNum.wdd = d.notArriving
        warningBadgeNum.wupbd = d.warrant
      }


      yield put({
        type: 'putWarningBadgeNum',
        payload: {
          warningBadgeNum:warningBadgeNum,
        },
      })


      let dosthIsOnOff = false
      const buttonId = payload.buttonId;

      const dosthParam = {
        isFinace:1,
        type:5,
      }

      const needFinanceListData = yield call(dashboardSerivce.dosthList,dosthParam )

      const needFinanceList = needFinanceListData.data.data

      let dosthlistI = [];
      if(needFinanceList.length > initItem){
        for(let i=0;i<initItem;i++){
          dosthlistI.push(needFinanceList[i])
        }
        dosthIsOnOff = true;
      }else{
        dosthlistI = needFinanceList
      }

      let warningIsOnOff = false
      let earlyList = [];

      const warningButtonId = payload.warningButtonId
      const earlyParam = {
        isFinace:warningButtonId,
        type:6,
      }

      const earlyListData = yield call(dashboardSerivce.earlyList,earlyParam);
      let earlyListT =  earlyListData.data.data

      if(earlyListT.length > initItem){
        for(let i=0;i<initItem;i++){
          earlyList.push(earlyListT[i])
        }
        warningIsOnOff = true
      }else{
        earlyList = earlyListT
      }
      let a = 0
      let b = 0
      let c = 0
      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          dosthlistI:dosthlistI.map((item) =>{
            const m = {key:item.id+item.time,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),

          dosthlistIF:needFinanceList.map((item) =>{
            const m = {key:item.id+item.time + a++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),

          earlyList:earlyList.map((item) =>{
            const m = {key:item.id+item.time + b++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          earlyListF:earlyListT.map((item) =>{
            const m = {key:item.id+item.time + c++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          buttonId:payload.buttonId,
          warningButtonId:warningButtonId,
          dosthIsOnOff:dosthIsOnOff,
          warningIsOnOff:warningIsOnOff,
          dosthlistIOF:false ,
          earlyListOF:false,
          dosthBarId:5,
          warningBarId:6,
        },
      })

    },

    * dosthQuery ({payload,}, { call, put,select }) {

      const buttonId = payload.buttonId

      const dosthConut = yield call(dashboardSerivce.dosthConut,{isFinace:buttonId} )

      const badgeNum = {
        allNum:0,
        bjz:0,
        dfp:0,
        tcfy:0,
        dfc:0,
        yczwtg:0,
        wbj:0,
        wtc:0,
        wzdc:0,
      }

      if(dosthConut){

        console.log(d)
        const d = dosthConut.data.data
        badgeNum.allNum = d.all
        badgeNum.bjz = d.quotation
        badgeNum.dfp = d.allocated
        badgeNum.tcfy = d.shipment
        badgeNum.dfc = d.put
        badgeNum.yczwtg = d.fail
        badgeNum.wbj = d.notOffer
        badgeNum.wtc = d.libToStore
        badgeNum.wzdc = d.libToStoreTransfer
      }

      yield put({
        type: 'putBadgeNum',
        payload: {
          badgeNum:badgeNum,
          schedule:true
        },
      })
      const dosthParam = {
        isFinace:buttonId,
        type:5,
      }

      let dosthIsOnOff = false

      const needFinanceData = yield call(dashboardSerivce.dosthList, dosthParam);

      const needFinanceList = needFinanceData.data.data

      console.log('代办：' + needFinanceList.length)

      let dosthlistI = [];
      if(needFinanceList.length > initItem){
        for(let i=0;i<initItem;i++){
          dosthlistI.push(needFinanceList[i])
        }
        dosthIsOnOff = true;
      }else{
        dosthlistI = needFinanceList
      }

      let e = 0
      let f = 0
      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          dosthlistI:dosthlistI.map((item) =>{
            const m = {key:item.id+item.time + e ++ ,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          dosthlistIF:needFinanceList.map((item) =>{
            const m = {key:item.id+item.time + f ++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          buttonId:payload.buttonId,
          dosthIsOnOff:dosthIsOnOff,
          dosthlistIOF:false ,
          dosthBarId:5,
        },
      })

    },

    //展开代办
    * spread ({payload,}, { call, put, select }) {

      const dosthlistI = yield select(({ dashboard }) => dashboard.dosthlistIF)
      const dosthlistIF = yield select(({ dashboard }) => dashboard.dosthlistI)

      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          dosthlistI:dosthlistI,
          dosthlistIF:dosthlistIF,
          dosthlistIOF:true ,
        },
      })

    },

    //收缩代办
    * shrink ({payload,}, { call, put, select }) {

      const dosthlistI = yield select(({ dashboard }) => dashboard.dosthlistIF)
      const dosthlistIF = yield select(({ dashboard }) => dashboard.dosthlistI)

      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          dosthlistI:dosthlistI,
          dosthlistIF:dosthlistIF,
          dosthlistIOF:false ,
        },
      })
    },

    //展开预警
    * spreadWarning ({payload,}, { call, put, select }) {

      const earlyList = yield select(({ dashboard }) => dashboard.earlyListF)
      const earlyListF = yield select(({ dashboard }) => dashboard.earlyList)

      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          earlyList:earlyList,
          earlyListF:earlyListF,
          earlyListOF:true ,
        },
      })

    },

    //收缩预警
    * shrinkWarning ({payload,}, { call, put, select }) {

      const earlyList = yield select(({ dashboard }) => dashboard.earlyListF)
      const earlyListF = yield select(({ dashboard }) => dashboard.earlyList)

      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          earlyList:earlyList,
          earlyListF:earlyListF,
          earlyListOF:false ,
        },
      })
    },

    //预警tab切换
    * warningQuery ({payload,}, { call, put,select }) {
      let warningIsOnOff = false
      const buttonId = payload.warningButtonId;

      const warningConut = yield call(dashboardSerivce.warningConut,{isFinace:buttonId} )

      const warningBadgeNum = {
        allNum:0,
        wyz:0,
        wfy:0,
        wjc:0,
        wupzt:0,
        wdd:0,
        wupbd:0
      }

      if(warningConut){
        const d = warningConut.data.data
        warningBadgeNum.allNum = d.all
        warningBadgeNum.wyz = d.noInspection
        warningBadgeNum.wfy = d.unshipped
        warningBadgeNum.wjc = d.unpaidCar
        warningBadgeNum.wupzt = d.notWay
        warningBadgeNum.wdd = d.notArriving
        warningBadgeNum.wupbd = d.warrant
      }

      yield put({
        type: 'putWarningBadgeNum',
        payload: {
          warningBadgeNum:warningBadgeNum,
        },
      })


      const earlyParam = {
        isFinace:buttonId,
        type:6,
      }

      const earlyListData = yield call(dashboardSerivce.earlyList,earlyParam);

      //const needFinanceData = yield call(buttonId === 0?dashboardSerivce.needFinanceList:dashboardSerivce.needNonFinanceList, );
      const needFinanceList = earlyListData.data.data
      console.log('预警：' + needFinanceList.length)

      let dosthlistI = [];
      if(needFinanceList.length > initItem){
        for(let i=0;i<initItem;i++){
          dosthlistI.push(needFinanceList[i])
        }
        warningIsOnOff = true;
      }else{
        dosthlistI = needFinanceList
      }

      let e = 0
      let f = 0
      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          earlyList:dosthlistI.map((item) =>{
            const m = {key:item.id+item.time + e ++ ,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          earlyListF:needFinanceList.map((item) =>{
            const m = {key:item.id+item.time + f ++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          warningButtonId:payload.warningButtonId,
          warningIsOnOff:warningIsOnOff,
          earlyListOF:false,
          warningBarId:6,
        },
      })

    },

    //获取徽章数
    * getBadgeNum ({payload,}, { call, put, select }) {

      const buttonId = yield select(({ dashboard }) => dashboard.buttonId)

      const dosthConut = yield call(dashboardSerivce.dosthConut,{isFinace:buttonId} )

      const badgeNum = {
        allNum:0,
        bjz:0,
        dfp:0,
        tcfy:0,
        dfc:0,
        yczwtg:0,
        wbj:0,
        wtc:0,
        wzdc:0,
      }

      if(dosthConut){

        const d = dosthConut.data.data
        console.log(d)
        badgeNum.allNum = d.all
        badgeNum.bjz = d.quotation
        badgeNum.dfp = d.allocated
        badgeNum.tcfy = d.shipment
        badgeNum.dfc = d.put
        badgeNum.yczwtg = d.fail
        badgeNum.wbj = d.notOffer
        badgeNum.wtc = d.libToStore
        badgeNum.wzdc = d.libToStoreTransfer
      }

      yield put({
        type: 'putBadgeNum',
        payload: {
          badgeNum:badgeNum,
          schedule:true
        },
      })
    },

    //获取预警徽章数
    * getWarningBadgeNum ({payload,}, { call, put, select }) {

      const buttonId = yield select(({ dashboard }) => dashboard.warningButtonId)

      const warningConut = yield call(dashboardSerivce.warningConut,{isFinace:buttonId} )

      const warningBadgeNum = {
        allNum:0,
        wyz:0,
        wfy:0,
        wjc:0,
        wupzt:0,
        wdd:0,
        wupbd:0
      }

      if(warningConut){
        const d = warningConut.data.data
        warningBadgeNum.allNum = d.all
        warningBadgeNum.wyz = d.noInspection
        warningBadgeNum.wfy = d.unshipped
        warningBadgeNum.wjc = d.unpaidCar
        warningBadgeNum.wupzt = d.notWay
        warningBadgeNum.wdd = d.notArriving
        warningBadgeNum.wupbd = d.warrant
        console.log(d)
      }

      yield put({
        type: 'putWarningBadgeNum',
        payload: {
          warningBadgeNum:warningBadgeNum,
        },
      })
    },



    * classifyDosthQuery ({payload,}, { call, put,select }) {

      const buttonId = yield select(({ dashboard }) => dashboard.buttonId)

      let dosthIsOnOff = false

      const dosthParam = {
        isFinace:buttonId,
        type:payload.type,
      }

      yield put({
        type: 'dosthBarTab',
        payload: {
          dosthBarId:payload.type,
        },
      })

      const needFinanceListData = yield call(dashboardSerivce.dosthList,dosthParam )

      const needFinanceList = needFinanceListData.data.data

      console.log('代办：' + needFinanceList.length)
      let dosthlistI = [];
      if(needFinanceList.length > initItem){
        for(let i=0;i<initItem;i++){
          dosthlistI.push(needFinanceList[i])
        }
        dosthIsOnOff = true;
      }else{
        dosthlistI = needFinanceList
      }

      let a = 0
      let b = 0
      let c = 0
      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          dosthlistI:dosthlistI.map((item) =>{
            const m = {key:item.id+item.time+ a++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),

          dosthlistIF:needFinanceList.map((item) =>{
            const m = {key:item.id+item.time + a++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          dosthIsOnOff:dosthIsOnOff,
          dosthlistIOF:false ,
        },
      })

    },

    * classifyWarningQuery ({payload,}, { call, put,select }) {

      let warningIsOnOff = false
      let earlyList = [];
      const warningButtonId = yield select(({ dashboard }) => dashboard.warningButtonId)

      const earlyParam = {
        isFinace:warningButtonId,
        type:payload.type,
      }

      yield put({
        type: 'doWarningBarTab',
        payload: {
          warningBarId:payload.type,
        },
      })

      const earlyListData = yield call(dashboardSerivce.earlyList,earlyParam);
      let earlyListT =  earlyListData.data.data
      console.log('预警：' + earlyListT.length)
      if(earlyListT.length > initItem){
        for(let i=0;i<initItem;i++){
          earlyList.push(earlyListT[i])
        }
        warningIsOnOff = true
      }else{
        earlyList = earlyListT
      }

      let a = 0
      let b = 0
      let c = 0
      yield put({
        type: 'unfoldAllSuccess',
        payload: {
          earlyList:earlyList.map((item) =>{
            const m = {key:item.id+item.time + b++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          earlyListF:earlyListT.map((item) =>{
            const m = {key:item.id+item.time + c++,
              remindTime:item.time,
              no: item.id,
              describe: item.message,
              type:0,
              url:item.routeUrl,
              vin:item.vin,
            }
            return m
          }),
          warningIsOnOff:warningIsOnOff,
          earlyListOF:false
        },
      })

    },


  },
})
