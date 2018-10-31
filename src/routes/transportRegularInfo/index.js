import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Modal,Popconfirm, Select,message } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import TModal from './Modal'
import UpdateModal from './UpdateModal'
const confirm = Modal.confirm

const TransportRegularInfo = ({
  location, dispatch, transportRegularInfo, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, updateModalVisible, modalType, isMotion, selectedRowKeys, putStateList, tableData,
    regionResultList, updateRegionResultList, startCityOption, endCityOption,regionBaseResultList
  } = transportRegularInfo
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    tableData,
    startCityOption,
    endCityOption,
    maskClosable: false,
    confirmLoading: loading.effects['transportRegularInfo/update'],
    title: `${modalType === 'create' ? '新建规则' : 'Update User'}`,
    wrapClassName: 'vertical-center-modal',
    regionResultList,
    startCityOnChange (value, selectedOptions) {
      dispatch({ type: 'transportRegularInfo/putStartCityOption', payload: selectedOptions })
    },
    endCityOnChange (value, selectedOptions) {
      dispatch({ type: 'transportRegularInfo/putEndCityOption', payload: selectedOptions })
    },
    addrLoadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      dispatch({
        type: 'transportRegularInfo/load3Addr',
        payload: targetOption,
      })
    },
    onOk (data) {
      dispatch({
        type: 'transportRegularInfo/create',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transportRegularInfo/hideModal',
      })
    },

    handleAdd () {
      dispatch({
        type: 'transportRegularInfo/addTableRow',
        payload: { billUnit: 0, unit: 0, edit: true },
      })
    },
    saveRow (record) {
      dispatch({
        type: 'transportRegularInfo/saveTableRow',
        payload: record,
      })
    },
    deleteRow (e, record) {
      confirm({
        title: '删除此条也将删除其后的规则',
        okText:`确定`,
        cancelText:`取消`,
        onOk () {
          dispatch({
            type: 'transportRegularInfo/deleteTableRow',
            payload: record,
          })
        },
      })
    },
    onChangeUnit (e, record) {

      if(e.target.value === undefined || e.target.value.length === 0){
        message.error('最低计费单位数不可为空')
        return false
      }

      if (!isFinite(e.target.value)) {
        message.error('请输入正确的数字')
        return false
      }
      record.billUnit = e.target.value
      dispatch({
        type: 'transportRegularInfo/changUnit',
        payload: record,
      })
    },
    onBlurUnit (e, record) {
     /* if(record.billUnit <= record.beforUnit){
        message.error('最大公里数不应该小于等于最小公里数')
        return false
      }*/
    },
    onChangeRate (e, record) {
      if(e.target.value === undefined || e.target.value.length === 0){
        message.error('货币不可为空')
        return false
      }
      if (!isFinite(e.target.value)) {
        message.error('请输入正确的数字')
        return false
      }
      record.unit = e.target.value
      dispatch({
        type: 'transportRegularInfo/changRate',
        payload: record,
      })
    },
  }
  const updateModalProps = {
    item: currentItem,
    visible: updateModalVisible,
    tableData,
    maskClosable: false,
    title:  '编辑规则',
    wrapClassName: 'vertical-center-modal',
    updateRegionResultOptions: updateRegionResultList,
    addrLoadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      dispatch({
        type: 'transportRegularInfo/load2Addr',
        payload: targetOption,
      })
    },
    onOk (data,id) {
      dispatch({
        type: `transportRegularInfo/update`,
        payload: {
          data:data,
          id:id,
        },
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transportRegularInfo/hideUpdateModal',
      })
    },

    handleAdd () {
      dispatch({
        type: 'transportRegularInfo/addTableRow',
        payload: { billUnit: 0, unit: 0, edit: true },
      })
    },
    saveRow (record) {
      dispatch({
        type: 'transportRegularInfo/saveTableRow',
        payload: record,
      })
    },
    deleteRow (e, record) {
      confirm({
        title: '删除此条也将删除其后的规则',
        okText:`确定`,
        cancelText:`取消`,
        onOk () {
          dispatch({
            type: 'transportRegularInfo/deleteTableRow',
            payload: record,
          })
        },
      })

    },
    onChangeUnit (e, record) {

      if(e.target.value === undefined || e.target.value.length === 0){
        message.error('最低计费单位数不可为空')
        return false
      }

      if (!isFinite(e.target.value)) {
        message.error('请输入正确的数字')
        return false
      }
      record.billUnit = e.target.value
      dispatch({
        type: 'transportRegularInfo/changUnit',
        payload: record,
      })
    },
    onChangeRate (v, record) {

      if(v === undefined || v.length === 0){
        message.error('货币不可为空')
        return false
      }
      if (!isFinite(v)) {
        message.error('请输入正确的数字')
        return false
      }
      record.unit = v
      dispatch({
        type: 'transportRegularInfo/changRate',
        payload: record,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['transportRegularInfo/query'],
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
    updateRecordState (item) {
      item.updateUser = 'nocookie'
      dispatch({
        type: 'transportRegularInfo/updateRecordState',
        payload: item,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `transportRegularInfo/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    deleteRecord (item) {
      item.updateUser = 'nocookie'
      dispatch({
        type: 'transportRegularInfo/deleteRecord',
        payload: item,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `transportRegularInfo/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    editRecord (item) {
      dispatch({
        type: 'transportRegularInfo/editRecord',
        payload: item,
      })
    },
  }

  const filterProps = {
    isMotion,
    stateOptions: putStateList.map(state => <Select.Option key={state.code}>{state.value}</Select.Option>),
    filter: {
      ...query,
    },
    regionBaseResultList,
    addrLoadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      dispatch({
        type: 'transportRegularInfo/load3Addr',
        payload: targetOption,
      })
    },
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
        type: 'transportRegularInfo/prepareShowModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'user/switchIsMotion' })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <TModal {...modalProps} />}
      {updateModalVisible && <UpdateModal {...updateModalProps} />}
    </Page>
  )
}

TransportRegularInfo.propTypes = {
  transportRegularInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ transportRegularInfo, loading }) => ({ transportRegularInfo, loading }))(TransportRegularInfo)
