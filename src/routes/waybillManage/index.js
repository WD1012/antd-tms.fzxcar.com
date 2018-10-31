import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Select, Modal,message } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import SlefModal from './Modal'
import QuotePriceModal from './QuotedPriceModal'
import DistributionCarriersModal from './DistributionCarriersModal'
import PayAuditModal from './PayAuditModal'
import { Button,} from 'antd';
const confirm = Modal.confirm

const WayBillManage = ({
  location, dispatch, waybillManage, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType, isMotion,
    dictOrderStatusArray,
    dictOrderTypeArray,
    dictTransportTypeArray,
    dictvehicleStatusArray,
    regionResultList,
    quotedPriceModalVisible,
    quotedPriceList,
    distributionCarriersModalVisible,
    distributionCarriersList,
    tmsOrder,payAuditModalVisible,
    payautpics,
    referPicsModalVisible,
    referPics,
    referPicsActiveIndex,

  } = waybillManage
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['user/update'],
    title: `${modalType === 'create' ? 'Create User' : 'Update User'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `user/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'user/hideModal',
      })
    },
  }
  const quotedPriceModalProps = {
    itemList: quotedPriceList,
    visible: quotedPriceModalVisible,
    maskClosable: false,
    tmsOrder,
    filter: {
      ...query,
    },
    confirmLoading: loading.effects['user/update'],
    title: '报价记录',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'waybillManage/cancelQuotedPriceModalVisible',
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillManage/cancelQuotedPriceModalVisible',
      })
    },
    clickDistributionCarriers (e, record) {
      e.preventDefault()
      if (record.freightPrice === 0) {
        message.error('报价为0,请重新选择')
      } else {
        const distributionCarriers = {
          carrierId: record.carrierId,
          freightPrice: record.freightPrice,
          offerPriceInfoId: record.id,
          operatorId: 1,
          tmsOrderId: record.orderId,
          filter: {
            ...query,
          },
        }
        dispatch({
          type: 'waybillManage/distributionCarriers',
          payload: distributionCarriers,
        })
      }
    },
    clickSelectDistributionCarriers (e) {
      e.preventDefault()
      dispatch({
        type: 'waybillManage/prepareShowdistributionCarriersModal',
        payload: {
          modalType: 'watch',
        },
      })
    },
  }
  const distributionCarriersModalProps = {
    itemList: distributionCarriersList.length > 0 ? distributionCarriersList.map(it => (<Select.Option value={it.id}>{it.desc}</Select.Option>)) : null,
    visible: distributionCarriersModalVisible,
    currentItem:tmsOrder,
    maskClosable: false,
    filter: {
      ...query,
    },
    confirmLoading: loading.effects['waybillManage/distributionCarriersSelector'],
    title: '分配其他承运商',
    wrapClassName: 'vertical-center-modal',
    onOkDistributionCarriers (data) {
      dispatch({
        type: 'waybillManage/distributionCarriersSelector',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillManage/canceldistributionCarriersModalVisible',
      })
    },

  }

  const onPayAuditCancel = () => {
    dispatch({
      type: 'waybillManage/hidePayAuditModal',
    })
  }

  const onPayAudit = (e,result) => {
    e.preventDefault()
    const test = result === 2?'【通过】':'【不通过】';
    confirm({
      title: '确认支付审批操作' + test ,
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        dispatch({
          type: 'waybillManage/payAudit',
          payload: {
            currentItem:currentItem,
            result:result
          },
        }).then((result) =>{
          if(result === 200){
            message.success('操作成功')
            dispatch({
              type: `waybillManage/query`,
              payload:  queryString.parse(location.search),
            })
          }
        })
      },
    })




  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['waybillManage/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'user/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'user/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    editQuotedPriceClick (e, record) {
      e.preventDefault()
      dispatch({
        type: 'waybillManage/showQuotedPriceModal',
        payload: {
          modalType: 'edit',
          currentItem: record,
        },
      })
    },
    watchQuotedPriceClick (e, record) {
      e.preventDefault()
      dispatch({
        type: 'waybillManage/showQuotedPriceModal',
        payload: {
          modalType: 'watch',
          currentItem: record,
        },
      })
    },

    onPayAuditShow (e, record) {
      e.preventDefault()
      dispatch({
        type: 'waybillManage/showPayAuditModal',
        payload: record,
      })
    },

  }

  const filterProps = {
    isMotion,
    filter: {
      ...query,
    },
    regionResultOption: regionResultList,
    dictOrderStatusOption: dictOrderStatusArray.map(item =>
      (<Select.Option key={item.code} value={item.code}> {item.value} </Select.Option>)),
    dictOrderTypeOption: dictOrderTypeArray.map(item =>
      (<Select.Option key={item.code} value={item.code}> {item.value} </Select.Option>)),
    dictTransportTypeOption: dictTransportTypeArray.map(item =>
      (<Select.Option key={item.code} value={item.code}> {item.value} </Select.Option>)),
    dictvehicleStatusOption: dictvehicleStatusArray.map(item =>
      (<Select.Option key={item.code} value={item.code}> {item.value} </Select.Option>)),
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        search: queryString.stringify({
          ...value,
          page: 1,
          pageSize,
        }),
      }))
    },
    onExport (value) {
      dispatch({
        type: 'waybillManage/putExportOn',
      })

      dispatch(routerRedux.push({
        pathname: location.pathname,
        search: queryString.stringify({
          ...value,
          page: 1,
          pageSize,
          //onExport: true,
        }),
      }))
    },
    addrLoadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      dispatch({
        type: 'waybillManage/load2Addr',
        payload: targetOption,

      })
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/user',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/user',
      }))
    },
    onAdd () {
      dispatch({
        type: 'user/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'user/switchIsMotion' })
    },
  }


  const payAuditModalModalProps = {

    visible: payAuditModalVisible,
    maskClosable: false,
    filter: {
      ...query,
    },

    payautpics,
    referPicsModalVisible,
    referPics,
    referPicsActiveIndex,
    confirmLoading: loading.effects['waybillManage/distributionCarriersSelector'],
    title: '支付审核',
    wrapClassName: 'vertical-center-modal',
    footer:<div><Button type="primary" onClick={e => onPayAudit(e,2)} >通过</Button> <Button type="danger"  onClick={e => onPayAudit(e,3)}>不通过</Button><Button onClick={onPayAuditCancel} >取消</Button></div>,
    onOkDistributionCarriers (data) {

    },
    onCancel () {
      onPayAuditCancel()
    },

  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <SlefModal {...modalProps} />}
      {quotedPriceModalVisible && <QuotePriceModal {...quotedPriceModalProps} />}
      {distributionCarriersModalVisible && <DistributionCarriersModal {...distributionCarriersModalProps} />}
      {payAuditModalVisible && <PayAuditModal {...payAuditModalModalProps} />}
    </Page>
  )
}

WayBillManage.propTypes = {
  waybillManage: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ waybillManage, loading }) => ({ waybillManage, loading }))(WayBillManage)
