import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, Select } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import UpdateModal from './UpdateModal'
import { message, } from 'antd';
const TransportInfo = ({
  location, dispatch, transportInfo, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible,modalUpdateVisible, modalType, isMotion,
    allStates, startAddressLabel, endAddressLabel,regionResultList,addrFilterOptions,
    yesNoStates,addrOptions,
  } = transportInfo
  const { pageSize } = pagination

  const addrLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'transportInfo/lazilyAddr3',
      payload:targetOption
    })
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    addrOptions:addrOptions,
    statusOptions: yesNoStates.map(item =>
      (<Select.Option key={item.code}> {item.value} </Select.Option>)),
    startAddressLabel,
    endAddressLabel,
    maskClosable: false,
    confirmLoading: loading.effects['transportInfo/create'],
    title: '增加固定运价',
    wrapClassName: 'vertical-center-modal',
    selectStartAddressLabel (selectedOptions) {
      dispatch({
        type: 'transportInfo/selectStartAddressLabel',
        payload: selectedOptions,
      })
    },
    selectEndAddressLabel (selectedOptions) {
      dispatch({
        type: 'transportInfo/selectEndAddressLabel',
        payload: selectedOptions,
      })
    },
    onOk (data) {
      dispatch({
        type: `transportInfo/create`,
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transportInfo/hideModal',
      })
    },addrLoadData,
  }

  const modalUpdateProps = {
    item: currentItem,
    visible: modalUpdateVisible,
    statusOptions: yesNoStates.map(item =>
      (<Select.Option key={item.code}> {item.value} </Select.Option>)),
    startAddressLabel,
    endAddressLabel,
    maskClosable: false,
    confirmLoading: loading.effects['transportInfo/update'],
    title: '编辑固定运价',
    wrapClassName: 'vertical-center-modal',
    onOk (data,id) {
      dispatch({
        type: `transportInfo/update`,
        payload: {
          data:data,
          id:id,
        },
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `transportInfo/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transportInfo/hideUpdateModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['transportInfo/query'],
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
        type: 'transportInfo/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'transportInfo/prepareShowUpdateModal',
        payload: {
          currentItem: item,
        },
      })
    },
    editClick (item) {

    },
    pauseClick (item) {
      item.updateUser = 'nocookie'
      dispatch({
        type: 'transportInfo/pauseStatus',
        payload: item,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `transportInfo/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    startClick (item) {
      item.updateUser = 'nocookie'
      dispatch({
        type: 'transportInfo/startStatus',
        payload: item,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `transportInfo/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    deleteClick (item) {
      item.updateUser = 'nocookie'
      dispatch({
        type: 'transportInfo/deleteStatus',
        payload: item,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `transportInfo/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
  }

  const filterProps = {
    isMotion,
    addrOptions:addrFilterOptions,
    statusOptions: yesNoStates.map(item =>
      (<Select.Option key={item.code}> {item.value} </Select.Option>)),
    regionResultOptions:regionResultList.map(state => <Select.Option key={state.code}>{state.value}</Select.Option>),
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
        pathname: '/transportInfo',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/transportInfo',
      }))
    },
    onAdd () {
      dispatch({
        type: 'transportInfo/prepareShowModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'transportInfo/switchIsMotion' })
    },addrLoadData,
  }


  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}

      {modalUpdateVisible  && <UpdateModal {...modalUpdateProps} />}
    </Page>
  )
}

TransportInfo.propTypes = {
  transportInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ transportInfo, loading }) => ({ transportInfo, loading }))(TransportInfo)
