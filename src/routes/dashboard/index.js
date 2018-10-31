import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import DoSthIList from './DoSthIList'
import DoSthIBar from './DoSthIBar'
import WarningList from './WarningList'
import DoWarningBar from './DoWarningBar'
import styles from './index.less'
import { Page ,Iconfont,} from 'components'
import {  Row,Card , Icon,Button,} from 'antd';
import { Divider } from 'antd';
const ButtonGroup = Button.Group;
import queryString from 'query-string'

const dosth =  require('../../svg/cute/dosth.svg');
const warning =  require('../../svg/cute/warning.svg');

let scheduletFun

setInterval(() =>{
  scheduletFun()

}, 1000 * 60 );

const Dashboard = ({ location, dispatch, dashboard, loading, }) => {

  const {
    dosthlistI,dosthlistIOF,buttonId,earlyList,earlyListOF,dosthIsOnOff,warningIsOnOff,badgeNum,warningButtonId,warningBadgeNum,dosthBarId,warningBarId
  } = dashboard

  scheduletFun = () =>{
     dispatch({
       type: 'dashboard/getBadgeNum',
     })

    dispatch({
      type: 'dashboard/getWarningBadgeNum',
    })
  }

  const doSthlistProps = {
    dataSource: dosthlistI,
    loading: loading.effects['dashboard/query'],
    location,
  }

  const doSthbarProps = {
    loading: loading.effects['dashboard/classifyDosthQuery'],
    location,
    buttonId,
    badgeNum,
    dosthBarId,
    classifyDosthQuery (type) {

   /*   dispatch(routerRedux.push({
        pathname: location.pathname,
        search: queryString.stringify({
          type: type,
        }),
      }))*/

      dispatch({
        type: 'dashboard/classifyDosthQuery',
        payload:{
          type:type
        }
      })
    },
  }

  const warninglistProps = {
    dataSource: earlyList,
    loading: loading.effects['dashboard/query'],
    location,
  }

  const warningbarProps = {
    location,
    warningBadgeNum,
    warningButtonId,
    warningBarId,
    classifyWarningQuery (type) {
      dispatch({
        type: 'dashboard/classifyWarningQuery',
        payload:{
          type:type
        }
      })
    },
  }

  const onOff = (type,e) => {
    if(type === 1){
      on(type,e);
    }else if(type === 2){
      off(type,e);
    }
  }

  const on = (type,e) => {
    e.preventDefault()
    dispatch({
      type: 'dashboard/spread',
      payload: {
        type: type,
      },
    })
  }

  const off = (type,e) => {
    e.preventDefault()
    dispatch({
      type: 'dashboard/shrink',
      payload: {
        type: type,
      },
    })
  }

  const onOffWarning = (type,e) => {
    if(type === 1){
      onWarning(type,e);
    }else if(type === 2){
      offWarning(type,e);
    }
  }

  const onWarning = (type,e) => {
    e.preventDefault()
    dispatch({
      type: 'dashboard/spreadWarning',
      payload: {
        type: type,
      },
    })
  }

  const offWarning = (type,e) => {
    e.preventDefault()
    dispatch({
      type: 'dashboard/shrinkWarning',
      payload: {
        type: type,
      },
    })
  }

  const switchDoSth = (type,e) => {
    dispatch({
      type: 'dashboard/dosthQuery',
      loading: loading.effects['dashboard/dosthQuery'],
      payload: {
        type: type,
        buttonId:type,
        pagereq:true,
      },
    })

  }

  const switchWarning = (type,e) => {
    dispatch({
      type: 'dashboard/warningQuery',
      payload: {
        type: type,
        warningButtonId:type,
        pagereq:true,
      },
    })

  }

  return (
    <Page>
        <div>
          <Row  gutter={24} align={"middle"} style={{marginBottom:10}}>
            <Card

              style={{ width: '100%' }}
              title={<li><Iconfont  colorful type={dosth.default.id} />  代办事项</li>}
              extra={
                <div >
                    <Button onClick={e => switchDoSth(1, e)} className={buttonId === 1?styles.buttonon:styles.buttonoff}  >金融物流</Button>
                    <Button onClick={e => switchDoSth(0, e)} className={buttonId === 0?styles.buttonon:styles.buttonoff} >业外物流</Button>
                </div>
              }
              onTabChange={(key) => { this.onTabChange(key, 'key'); }}
            >

              {<Row  gutter={24} align={"middle"} style={{marginBottom:10}}>
                <DoSthIBar {...doSthbarProps} />
              </Row>}


              <Row  gutter={24} align={"middle"} style={{marginBottom:10}}>
                <DoSthIList {...doSthlistProps} />
              </Row>

              <Row  gutter={24} align={"middle"}  type={'flex'} justify={"center"} style={{marginBottom:1,visibility:dosthIsOnOff?"":"hidden"}}>
                <a href="#" onClick={e => onOff(dosthlistIOF?2:1, e)}> {dosthlistIOF?'收起':'展开全部'} <Icon type={dosthlistIOF?'caret-up':'caret-down'} /></a>
              </Row>

            </Card>

          </Row>

          <Row  gutter={24} align={"middle"} style={{marginBottom:10}}>
            <Card
              style={{ width: '100%' }}
              title={<li><Iconfont  colorful type={warning.default.id} />  预警</li>}

             extra={
                <div >
                  <Button onClick={e => switchWarning(1, e)} className={warningButtonId === 1?styles.buttonon:styles.buttonoff} >金融物流</Button>
                  <Button onClick={e => switchWarning(0, e)} className={warningButtonId === 0?styles.buttonon:styles.buttonoff} >业外物流</Button>

                </div>
              }

              onTabChange={(key) => { this.onTabChange(key, 'key'); }}
            >
              {<Row  gutter={24} align={"middle"} style={{marginBottom:10}}>
                <DoWarningBar {...warningbarProps} />
              </Row>}

              <Row  gutter={24} align={"middle"} style={{marginBottom:10}}>
                <WarningList {...warninglistProps} />
              </Row>

              <Row  gutter={24} align={"middle"}  type={'flex'} justify={"center"} style={{marginBottom:1,visibility:warningIsOnOff?"":"hidden"}}>
                <a href="#" onClick={e => onOffWarning(earlyListOF?2:1, e)}> {earlyListOF?'收起':'展开全部'} <Icon type={earlyListOF?'caret-up':'caret-down'} /></a>
              </Row>
            </Card>
          </Row>

        </div>
    </Page>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
