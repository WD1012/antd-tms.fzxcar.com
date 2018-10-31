import React from 'react'
import PropTypes from 'prop-types'
import { Table,  } from 'antd'
import { Badge, Button, Row, Col, } from 'antd';
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import styles from './index.less'

const DoSthIBar = ({
                     badgeNum,buttonId,classifyDosthQuery,dosthBarId
              }) => {

  return (
    <div>
      <Row  gutter={24} align={"middle"}>
        <Col  xs={{span: 3}}
              sm={{span: 3}}
              xl={{ span: 3 }}
              md={{ span: 3 }}
              style={{paddingLeft:25,paddingTop:0,marginBottom:5,paddingRight:0}}>

          <Badge count={badgeNum.allNum} overflowCount={999}  className="margin-right">
            <Button  onClick={e => classifyDosthQuery(5)} className={dosthBarId === 5?styles.buttonon:styles.buttonoff} >全部</Button>
          </Badge>
        </Col>

        <Col  xs={{span: 3}}
              sm={{span: 3}}
              xl={{ span: 3 }}
              md={{ span: 3 }}
              style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Badge count={badgeNum.bjz}  overflowCount={999}>
            <Button  onClick={e => classifyDosthQuery(0)} className={dosthBarId === 0?styles.buttonon:styles.buttonoff}  >报价中</Button>
          </Badge>
        </Col>

        <Col  xs={{span: 3}}
                    sm={{span: 3}}
                    xl={{ span: 3 }}
                    md={{ span: 3 }}
                    style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Badge count={badgeNum.dfp}  overflowCount={999} >
            <Button  onClick={e => classifyDosthQuery(1)} className={dosthBarId === 1?styles.buttonon:styles.buttonoff}  >待分配</Button>
          </Badge>
        </Col>

        <Col  xs={{span: 3}}
              sm={{span: 3}}
              xl={{ span: 3 }}
              md={{ span: 3 }}
              style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Badge count={badgeNum.wbj}  overflowCount={999} >
            <Button  onClick={e => classifyDosthQuery(6)} className={dosthBarId === 6?styles.buttonon:styles.buttonoff}  >无报价</Button>
          </Badge>
        </Col>
        {
          buttonId == 1 &&
          <Col  xs={{span: 3}}
                                       sm={{span: 3}}
                                       xl={{ span: 3 }}
                                       md={{ span: 3 }}
                                       style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
            <Badge count={badgeNum.tcfy}  overflowCount={999} >
              <Button  onClick={e => classifyDosthQuery(2)} className={dosthBarId === 2?styles.buttonon:styles.buttonoff}  >通知发运</Button>
            </Badge>
          </Col>
        }
       {
          buttonId == 1 &&
          <Col  xs={{span: 3}}
                sm={{span: 3}}
                xl={{ span: 3 }}
                md={{ span: 3 }}
                style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
            <Badge count={badgeNum.dfc}  overflowCount={999} >
              <Button  onClick={e => classifyDosthQuery(3)} className={dosthBarId === 3?styles.buttonon:styles.buttonoff}  >待放车</Button>
            </Badge>
          </Col>
        }
       {
          buttonId == 1 &&
          <Col  xs={{span: 3}}
                sm={{span: 3}}
                xl={{ span: 3 }}
                md={{ span: 3 }}
                style={{paddingLeft:0,paddingTop:0,marginBottom:5,paddingRight:0}}>
            <Badge count={badgeNum.yczwtg}  overflowCount={999} >
              <Button  onClick={e => classifyDosthQuery(4)} className={dosthBarId === 4?styles.buttonon:styles.buttonoff}  >验车照未通过审核</Button>
            </Badge>
          </Col>
        }

    </Row>

      {
        buttonId == 1 && <Row  gutter={24} align={"middle"}>
          <Col  xs={{span: 3}}
                sm={{span: 3}}
                xl={{ span: 3 }}
                md={{ span: 3 }}
                style={{paddingLeft:25,paddingTop:10,marginBottom:5,paddingRight:0}}>
            <Badge count={badgeNum.wtc}  overflowCount={999} >
              <Button  onClick={e => classifyDosthQuery(7)} className={dosthBarId === 7?styles.buttonon:styles.buttonoff}  >无提车人</Button>
            </Badge>
          </Col>

          <Col  xs={{span: 3}}
                sm={{span: 3}}
                xl={{ span: 3 }}
                md={{ span: 3 }}
                style={{paddingLeft:0,paddingTop:10,marginBottom:5,paddingRight:0}}>
            <Badge count={badgeNum.wzdc}  overflowCount={999} >
              <Button  onClick={e => classifyDosthQuery(8)} className={dosthBarId === 8?styles.buttonon:styles.buttonoff}  >无转单车操作人</Button>
            </Badge>
          </Col>

        </Row>
      }
    </div>
  )
}

DoSthIBar.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  badgeNum:PropTypes.object,
  buttonId:PropTypes.any,
  classifyDosthQuery:PropTypes.func,
  dosthBarId:PropTypes.any,
}

export default DoSthIBar
