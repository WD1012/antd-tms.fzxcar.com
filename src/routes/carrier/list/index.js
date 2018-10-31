import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './Filter'
import List from './List'
import AddModal from './AddModal'
import EditorModal from './EditorModal'
import RepairPersonModal from './RepairPersonModal'
import RepairRegionModal from './RepairRegionModal'

import { message } from 'antd';

const ManageCarrier = ({ location, dispatch, manageCarrier, loading, }) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination,currentItem, modalVisible,modalEditVisible,childData,modalRepairPersonVisible,personData,modalRepairRegionVisible,regionData,addrsData,transportTypes,linkData,insurances,
  } = manageCarrier
  const { pageSize } = pagination
  const filterProps = {
    filter: {
      ...query,
    },
    addrsData,
    insurances,
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
    onAdd () {
      dispatch({
        type: 'manageCarrier/showModal',
      })
     /*dispatch(routerRedux.push({
        pathname: '/manage-carrier-add',
      }))*/

    },

  }

  const childTable = {
    dataSource:childData,
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['manageCarrier/query'],
    pagination,
    childData,
    childTable,
    location,
    /*onRowDoubleClick (e){
      console.log('32')
      console.log(e)
    },*/
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
    onDeleteItem (id,userPin) {
      dispatch({
        type: 'manageCarrier/del',
        payload: {
          id: id,
          userPin:userPin,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },onOffItem (id,userPin){
      dispatch({
        type: 'manageCarrier/onOff',
        payload: {
          id: id,
          userPin:userPin,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'manageCarrier/showEditModal',
        payload: {
          currentItem: item,
        },
      })
    },loadChild(item) {
      dispatch({
        type: 'manageCarrier/loadChild',
        payload: {
          currentItem: item,
        },
      })
    },onRepairPersonItem(item){
      dispatch({
        type: 'manageCarrier/showRepairPersonModal',
        payload: item,
      })
    },onRepairRegionItem(item){
      dispatch({
        type: 'manageCarrier/showRepairRegionModal',
        payload: item,
      })
    }
  }

  const editorModalProps = {
    item: currentItem ,
    visible: modalEditVisible,
    maskClosable: false,
    insurances,
    title: `编辑承运商`,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading.effects['manageCarrier/update'],
    onOk (data) {
      dispatch({
        type: `manageCarrier/update`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }else if (result === 400){
          message.error('请勿重复提交')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'manageCarrier/hideEditModal',
      })
    },
  }

  const addModalProps = {
    item: {} ,
    visible: modalVisible,
    maskClosable: false,
    insurances,
    title: `增加承运商`,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading.effects['manageCarrier/add'],
    onOk (data) {
      dispatch({
        type: `manageCarrier/add`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }else if (result === 400){
          message.error('请勿重复提交')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'manageCarrier/hideModal',
      })
    },
  }


  const repairPersonModalProps = {
    item: currentItem ,
    visible: modalRepairPersonVisible,
    maskClosable: false,
    persons:personData,
    footer:false,
    confirmLoading:false,
    width:650,
    title: `维护承运商业务联系人`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {

      return dispatch({
        type: `manageCarrier/addPerson`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }else if(result === 400){
          message.error('请勿重复提交')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'manageCarrier/hideRepairPersonModal',
      })
    },
    onEditItem(id,data){
      dispatch({
        type: `manageCarrier/editPerson`,
        payload: {
          id:id,
          data:data
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },onDelItem(id,userPin,carrierId){
      dispatch({
        type: `manageCarrier/delPerson`,
        payload: {
          id:id,
          userPin:userPin,
          carrierId:carrierId,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },onSetMasterItem(id,userPin,carrierId){
      dispatch({
        type: `manageCarrier/setMasterPerson`,
        payload: {
          id:id,
          updateUser:userPin,
          carrierId:carrierId,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
          dispatch({
            type: `manageCarrier/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    }
  }

  const repairRegionModalProps = {
    item: currentItem ,
    visible: modalRepairRegionVisible,
    maskClosable: false,
    regions:regionData,
    addrsData:addrsData,
    transportTypes:transportTypes,
    linkData:linkData,
    footer:false,
    confirmLoading:false,
    width:650,
    title: `维护承运商运输区域`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `manageCarrier/addRegion`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }else if(result === 400){
          message.error('请勿重复提交')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'manageCarrier/hideRepairRegionModal',
      })
    },
    onEditItem(id,data){
      dispatch({
        type: `manageCarrier/editRegion`,
        payload: {
          id:id,
          data:data,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },onDelItem(id,userPin,carrierId){
      dispatch({
        type: `manageCarrier/delRegion`,
        payload: {
          id:id,
          userPin:userPin,
          carrierId:carrierId,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <AddModal {...addModalProps} />}
      {modalEditVisible && <EditorModal {...editorModalProps} />}
      {modalRepairPersonVisible && <RepairPersonModal {...repairPersonModalProps} />}
      {modalRepairRegionVisible && <RepairRegionModal {...repairRegionModalProps} />}

    </Page>
  )
}

ManageCarrier.propTypes = {
  manageCarrier: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ manageCarrier, loading }) => ({ manageCarrier, loading }))(ManageCarrier)
