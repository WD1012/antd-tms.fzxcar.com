import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './Filter'
import List from './List'
import AddModal from './AddModal'
import EditModal from './EditModal'
import ImportResultModal from './ImportResultModal'
import { message, } from 'antd';
import { config } from 'utils'
import * as cookie from 'services/cookie'
const ManageCarrierLine = ({ location, dispatch, manageCarrierLine, loading, }) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location

  const {
    list, pagination,currentItem, addModalVisible,editModalVisible,addrOptions,carrierList,modalImportResultVisible,importResultInfo,
  } = manageCarrierLine
  const {pageSize} = pagination

  const addrLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'manageCarrierLine/lazilyAddr',
      payload:targetOption
    })
  }

  const local_cookie = cookie.getCookie('token')
  const local_cookie_string = local_cookie === '' ? '{}' : local_cookie
  const { accountUuid, account } = JSON.parse(local_cookie_string)
  const user = { accountUuid, account }

  const importLineProps = {
    name: 'file',
    accept:'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    action: `//`+config.import_on+config.apiPrefix+`/carrier-contract-line-info/import?createUser=admin`,
    headers: {
      authorization: 'authorization-text',
      user: JSON.stringify(user)
    },
    onChange(info) {

      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {

        const successRow = info.file.response.data.successRow
        const failedRow = info.file.response.data.failedRow
        const details = info.file.response.data.details

        let errormess = ''
        details.map((item) =>{
          errormess = errormess + '【' + item + '】'
        })

        const i = {'success':successRow,'error':failedRow,'errormess':errormess}
        dispatch({
          type: 'manageCarrierLine/showImportResult',
          payload:{
            importResultInfo:i,
          }
        })
        message.success(`${info.file.name}操作成功`);

        if(failedRow === 0){
          dispatch({
            type: 'manageCarrierLine/query',
          })
        }


      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 操作失败.`);
      }
    },
  };

  const importResultModalProps = {
    item: importResultInfo ,
    visible: modalImportResultVisible,
    maskClosable: false,
    footer:false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'manageCarrierLine/hideImportResult',
      })
    },
  }

  const filterProps = {
    addrOptions:addrOptions,
    carrierList:carrierList,
    importLineProps:{...importLineProps},
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
        pathname: '/manageCarrierLine',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/manageCarrierLine',
      }))
    },
    onAdd () {
      dispatch({
        type: 'manageCarrierLine/showAddModal',
      })

    },addrLoadData,
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['manageCarrierLine/query'],
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
        type: 'manageCarrierLine/del',
        payload: {
          id:id,
          userPin:userPin,
        },
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `manageCarrierLine/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },onOffItem (id,userPin) {
      dispatch({
        type: 'manageCarrierLine/onOff',
        payload: {
          id:id,
          userPin:userPin,
        },
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `manageCarrierLine/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    onEditItem (item,e) {
      e.preventDefault()
      dispatch({
        type: 'manageCarrierLine/showEditModal',
        payload: item,
      })
    },
  }

  const addModalProps = {
    item: {} ,
    addrOptions:addrOptions,
    visible: addModalVisible,
    carrierList:carrierList,
    maskClosable: false,
    confirmLoading: loading.effects['user/update'],
    okText:`确定`,
    cancelText:`取消`,
    title: `路线管理-路线增加`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `manageCarrierLine/add`,
        payload: data,
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'manageCarrierLine/hideAddModal',
      })
    },addrLoadData,
  }

  const editModalProps = {
    item: currentItem,
    visible: editModalVisible,
    maskClosable: false,
    okText:`确定`,
    cancelText:`取消`,
    title: `路线管理-编辑`,
    wrapClassName: 'vertical-center-modal',
    onOk (id,data) {
      dispatch({
        type: `manageCarrierLine/update`,
        payload: {
          id:id,
          data:data
        },
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `manageCarrierLine/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'manageCarrierLine/hideEditModal',
      })
    },
  }

  return (

    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {addModalVisible && <AddModal {...addModalProps} />}
      {editModalVisible && <EditModal {...editModalProps} />}
      {modalImportResultVisible && <ImportResultModal {...importResultModalProps} />}


    </Page>
  )
}

ManageCarrierLine.propTypes = {
  manageCarrierLine: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ manageCarrierLine, loading }) => ({ manageCarrierLine, loading }))(ManageCarrierLine)
