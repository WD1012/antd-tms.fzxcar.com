import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Select, Modal } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import SelfModal from './Modal'
import UpdateModal from './UpdateModal'


const ManageLocation = ({
  location, dispatch, manageLocation, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType, isMotion,
    provinceListOption, accountListOption, updateModalVisible,
  } = manageLocation
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['manageLocation/create'],
    provinceListOption: provinceListOption.map(item =>
      (<Select.Option value={item.id} key={item.id}> {item.desc} </Select.Option>)),
    accountListOption: accountListOption.map(item =>
      (<Select.Option value={item.accountUuid} key={item.accountUuid}> {item.realName} </Select.Option>)),
    title: `${modalType === 'create' ? '新建区域管理' : 'Update User'}`,
    wrapClassName: 'vertical-center-modal',
    okText: '保存',
    cancelText: '取消',
    onOk (data) {
      dispatch({
        type: `manageLocation/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'manageLocation/hideModal',
      })
    },
  }
  const updateModalProps = {
    visible: updateModalVisible,
    maskClosable: false,
    item: currentItem,
    confirmLoading: loading.effects['manageLocation/update'],
    provinceListOption: provinceListOption.map(item =>
      (<Select.Option label={`${item.desc}`} key={`${item.id}`}> {item.desc} </Select.Option>)),
    accountListOption: accountListOption.map(item =>
      (<Select.Option label={`${item.account}`} key={`${item.accountUuid}`}> {item.realName} </Select.Option>)),
    title: `${modalType === 'create' ? '更新区域管理' : '更新区域管理'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'manageLocation/update',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'manageLocation/hideUpdateModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['manageLocation/query'],
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
    onDeleteItem (e, item) {
      e.preventDefault()
      Modal.confirm({
        title: '确认删除 ？',
        okText: '确定',
        cancelText: '取消',
        onOk () {
          dispatch({
            type: 'manageLocation/delete',
            payload: item,
          })
        },
      })
    },
    onEditItem (e, item) {
      e.preventDefault()
      console.log(item)
      dispatch({
        type: 'manageLocation/prepareShowUpdateModal',
        payload: {
          modalType: 'update',
          regionId: item.regionId,
        },
      })
    },
  }

  const filterProps = {
    isMotion,
    filter: {
      ...query,
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
        type: 'manageLocation/prepareShowModal',
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
      {modalVisible && <SelfModal {...modalProps} />}
      {updateModalVisible && <UpdateModal {...updateModalProps} />}
    </Page>
  )
}

ManageLocation.propTypes = {
  manageLocation: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ manageLocation, loading }) => ({ manageLocation, loading }))(ManageLocation)
