import React from 'react'
import PropTypes from 'prop-types'
import { Table,  } from 'antd'
import { Badge, Button, Row, Col, } from 'antd';
import { DropOption } from 'components'
import { Link } from 'react-router-dom'

import styles from './index.less'

const DoWarningBar = ({
                     warningBadgeNum,warningButtonId,classifyWarningQuery,warningBarId
              }) => {

  return (
    <div>
      <Row  gutter={24} align={"middle"}>
        <Col  xs={{span: 3}}
              sm={{span: 3}}
              xl={{ span: 3 }}
              md={{ span: 3 }}
              style={{paddingLeft:25,paddingTop:0,marginBottom:5,paddingRight:0}}>

          <Badge count={warningBadgeNum.allNum} overflowCount={999}  className="margin-right">
            <Button  onClick={e => classifyWarningQuery(6)} className={warningBarId === 6?styles.buttonon:styles.buttonoff} >全部</Button>
          </Badge>
        </Col>

        {
        <Col  xs={{span: 3}}
              sm={{span: 3}}
              xl={{ span: 3 }}
              md={{ span: 3 }}
              style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Badge count={warningBadgeNum.wyz}  overflowCount={999}>
            <Button  onClick={e => classifyWarningQuery(0)}  className={warningBarId === 0?styles.buttonon:styles.buttonoff} >未验车</Button>
          </Badge>
        </Col>
        }


        <Col  xs={{span: 3}}
                    sm={{span: 3}}
                    xl={{ span: 3 }}
                    md={{ span: 3 }}
                    style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Badge count={warningBadgeNum.wfy}  overflowCount={999} >
            <Button  onClick={e => classifyWarningQuery(1)}  className={warningBarId === 1?styles.buttonon:styles.buttonoff}>未发运</Button>
          </Badge>
        </Col>

        {warningButtonId === 1 &&
          <Col  xs={{span: 3}}
                                       sm={{span: 3}}
                                       xl={{ span: 3 }}
                                       md={{ span: 3 }}
                                       style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
            <Badge count={warningBadgeNum.wjc}  overflowCount={999} >
              <Button  onClick={e => classifyWarningQuery(2)}  className={warningBarId === 2?styles.buttonon:styles.buttonoff} >未交车</Button>
            </Badge>
          </Col>
        }
       {
          <Col  xs={{span: 4}}
                sm={{span: 4}}
                xl={{ span: 4 }}
                md={{ span: 4 }}
                style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
            <Badge count={warningBadgeNum.wupzt}  overflowCount={999} >
              <Button  onClick={e => classifyWarningQuery(3)} className={warningBarId === 3?styles.buttonon:styles.buttonoff}>未上传在途信息</Button>
            </Badge>
          </Col>
        }
       {
        <Col  xs={{span: 3}}
              sm={{span: 3}}
              xl={{ span: 3 }}
              md={{ span: 3 }}
              style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Badge count={warningBadgeNum.wdd}  overflowCount={999} >
            <Button  onClick={e => classifyWarningQuery(4)} className={warningBarId === 4?styles.buttonon:styles.buttonoff}>未到达</Button>
          </Badge>
        </Col>
      }
      {
          <Col  xs={{span: 3}}
                sm={{span: 3}}
                xl={{ span: 3 }}
                md={{ span: 3}}
                style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
            <Badge count={warningBadgeNum.wupbd}  overflowCount={999} >
              <Button  onClick={e => classifyWarningQuery(5)} className={warningBarId === 5?styles.buttonon:styles.buttonoff}>未上传保单</Button>
            </Badge>
          </Col>
        }
      </Row>
    </div>
  )
}

DoWarningBar.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  warningBadgeNum:PropTypes.object,
  warningButtonId:PropTypes.any,
  classifyWarningQuery:PropTypes.func,
  warningBarId:PropTypes.any,
}

export default DoWarningBar
