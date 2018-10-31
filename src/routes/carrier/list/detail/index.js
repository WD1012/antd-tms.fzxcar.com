import React from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Form, Row, Col, Badge, Table,Card, } from 'antd';
import { Divider } from 'antd';
import { connect } from 'dva'
import accounting from 'utils/accounting'
import styles from './List.less'
const ManageCarrierDetail = ({ location, dispatch, manageCarrierDetail, loading, }) => {

  const {
    carrierDetail, employees,regionDatas,
  } = manageCarrierDetail


  const employeesColumns = [
    { title: '', key: 'isMaster',dataIndex: 'isMaster', render: (text, record) => <span><Badge status={text === 0 ? 'success' : 'error'} />{text === 0 ? '主' : '非主'}</span> },
    { title: '姓名', dataIndex: 'name', key: 'name', },
    { title: '联系电话', dataIndex: 'tel', key: 'tel',},
  ];

  const regionDatasColumns = [
    { title: '起始地', dataIndex: 'origin', key: 'name' },
    { title: '目的地', dataIndex: 'destination', key: 'tel' },
    { title: '运输类型', dataIndex: 'transportType', key: 'transportType'   ,
      render: (text) => <span>{parseInt(text) === 1 ? '大板' :parseInt(text) === 2 ?'救援':parseInt(text) === 3 ?'代驾':''}</span>},
    { title: '联系人/电话', dataIndex: 'link', key: 'link' ,},
  ];

  const coverBtype = (text) =>{


    let m = ''
    if(text){
      text.map((item)=>{
        if(item === '1'){
          m = m + '大板 '
        }
        if(item === '2'){
          m = m + '救援 '
        }
        if(item === '3'){
          m = m + '代驾 '
        }
      })
    }
    return m

  }

  return (
    <Page inner>
      <Form>
        <div>
          <Row  gutter={24} align={"middle"}>
            <h1>承运商详细信息</h1>
            <Divider />
          </Row>
          <Row  gutter={24} align={"middle"} className={styles.card}>
            <Col span={8} >
              <Card>
                <p>承运商名称：{carrierDetail.carrierName}</p>
                <p>承运商简称：{carrierDetail.carrierShortName}</p>
                <p>运 输 类 型 ：{coverBtype(carrierDetail.transportTypes)}</p>
                <p>承运商状态：{carrierDetail.status===0?'正常':'暂停'}</p>
                </Card>
            </Col>
            <Col span={8}>
              <Card>
                <p>法人：{carrierDetail.legalPerson} / {carrierDetail.legalTel}</p>
                <p>注册资金：{accounting.formatMoney(carrierDetail.registeredCapital)}元</p>
                <p>开票税率：{carrierDetail.taxRate}%</p>
                <p>保 险 费 ：{carrierDetail.templateName}</p>

              </Card>
            </Col>
            <Col span={8}>

              <Card>
                <p>营业执照有效期：{carrierDetail.businessLicenceLife}</p>
                <p>合同有效期：{carrierDetail.contractLife}</p>
                <p>道路运输许可证有效期：{carrierDetail.transportLicenceLife}</p>
                <p>备注：{carrierDetail.remark}</p>
              </Card>
            </Col>

          </Row>

          <Row  gutter={24} align={"middle"}>
            <Col xs={{span: 12}}
                 sm={{span: 12}}
                 xl={{ span: 12 }}
                 md={{ span: 12 }}
                 style={{paddingLeft:1,paddingTop:5,marginBottom:5}}>
              <Row  gutter={12} align={"middle"}>
                <h2>业务联系人信息</h2>
                <Divider />
              </Row>
              <Row  gutter={12} align={"middle"}>
                <Table
                  dataSource={employees}
                  className={styles.table}
                  bordered
                  columns={employeesColumns}
                  simple
                  size="small"
                  rowKey={record => record.id}
                  pagination={false}
                />
              </Row>
            </Col>

            <Col xs={{span: 12}}
                 sm={{span: 12}}
                 xl={{ span: 12 }}
                 md={{ span: 12 }}
                 style={{paddingLeft:1,paddingTop:5,marginBottom:5}}>

              <Row gutter={12} align={"middle"}>
                <h2>运输区域管理</h2>
                <Divider />
              </Row>
              <Row gutter={12} align={"middle"} >
                <Table
                  dataSource={regionDatas}
                  className={styles.table}
                  bordered
                  columns={regionDatasColumns}
                  simple
                  size="small"
                  rowKey={record => record.id}
                  pagination={false}
                />
              </Row>
            </Col>
          </Row>

        </div>
      </Form>
    </Page>

  )
}

ManageCarrierDetail.propTypes = {
  manageCarrierDetail: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ manageCarrierDetail, loading }) => ({ manageCarrierDetail, loading }))(ManageCarrierDetail)
