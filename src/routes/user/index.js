import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import EditModal from './EditModal'
import { message } from 'antd';

const User = ({
  location, dispatch, user, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType,roles,modalEditVisible
  } = user
  const { pageSize } = pagination

  const modalProps = {
    item: {},
    roles,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['user/create'],
    title: `创建用户`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'user/create',
        payload: {
          type:0,
          data:data,
        }
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'user/hideModal',
      })
    },
  }

  const modalEditProps = {
    item: currentItem,
    roles,
    visible: modalEditVisible,
    title: `编辑用户`,
    wrapClassName: 'vertical-center-modal',
    onOk (account,reqType,data) {
      if(reqType === 1){
        dispatch({
          type: 'user/create',
          payload: {
            type:1,
            data:data,
          },
        }).then((result) =>{
          if(result === 200){
            message.success('操作成功')
          }
        })
      }else{
        dispatch({
          type: 'user/update',
          payload: {
            account:account,
            data:data,
          },
        }).then((result) =>{
          if(result === 200){
            message.success('操作成功')
          }
        })

      }

    },
    onCancel () {
      dispatch({
        type: 'user/hideEditModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['user/query'],
    pagination,
    location,
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
        type: 'user/delete',
        payload: {
          id:id,
          userPin:userPin,
        },
      })
    },
    onEditItem (item,e) {
      e.preventDefault()
      dispatch({
        type: 'user/showEditModal',
        payload: {
          currentItem: item,
        },
      })
    },onResetPassWord (userName) {
      dispatch({
        type: 'user/resetPassWord',
        payload: {
          userName: userName,
        },
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },
  }

  const filterProps = {
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
        type: 'user/showModal',
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
      {modalVisible && <Modal {...modalProps} />}
      {modalEditVisible && <EditModal {...modalEditProps} />}
    </Page>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ user, loading }) => ({ user, loading }))(User)
