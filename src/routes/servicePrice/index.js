import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './Filter'
import List from './List'
import Modal from './Modal'
import EditModal from './EditModal'
import MaintenanceModal from './MaintenanceModal'
import { message,Card  } from 'antd';
import { config } from 'utils'

const ServicePrice = ({ location, dispatch, servicePrice, loading, }) => {
  location.query = queryString.parse(location.search)
  const {
    list, addModalVisible,editModalVisible,currentItem,servicePriceList,
  } = servicePrice


  const filterProps = {
    onAdd () {
      dispatch({
        type: 'servicePrice/showAddModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    location,
    pagination:false,
    onDeleteItem (id,userpin) {
      dispatch({
        type: 'servicePrice/delete',
        payload: {
          id:id,
          userpin:userpin,
        }
      })
    },
    onEditItem (item,e) {
      console.log(item)
      e.preventDefault()
      dispatch({
        type: 'servicePrice/showEditModal',
        payload: {
          currentItem: item,
        },
      })
    },
  }

  const modalProps = {
    item: {} ,
    visible: addModalVisible,
    maskClosable: false,
    okText:`确定`,
    cancelText:`取消`,
    title: `增加服务费`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `servicePrice/add`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'servicePrice/hideAddModal',
      })
    },
  }

  const modalEditProps = {
    item: currentItem ,
    visible: editModalVisible,
    maskClosable: false,
    okText:`确定`,
    cancelText:`取消`,
    title: `编辑服务费`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `servicePrice/update`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'servicePrice/hideEditModal',
      })
    },
  }

  const maintenanceModalProps = {
    servicePriceList,
    location,
    onOk (data,userpin) {
      console.log(data)
      dispatch({
        type: 'servicePrice/update',
        payload: {
          data:data,
          userpin:userpin,
        }
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },

  }
  return (
    <Page inner>
      <Card bordered={false} style={{ width: 500 }}>
        <MaintenanceModal { ...maintenanceModalProps }/>
      </Card>
    </Page>
  )
}

ServicePrice.propTypes = {
  servicePrice: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ servicePrice, loading }) => ({ servicePrice, loading }))(ServicePrice)
/*

<Filter {...filterProps} />
<List {...listProps} />
{addModalVisible && <Modal {...modalProps} />}
{editModalVisible && <EditModal {...modalEditProps} />}*/
