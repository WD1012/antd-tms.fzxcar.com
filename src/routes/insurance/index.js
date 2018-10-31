import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Button, Col, Row } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Modal from './Modal'
import { message } from 'antd/lib/index'
import AuthButton from "../../components/AuthButton/AuthButton";

const Insurance = ({
  location, dispatch, insurance, loading,
}) => {
  location.query = queryString.parse(location.search)

  const { query, pathname } = location
  const {
    list, currentItem, modalVisible, modalType, isMotion, tableData,
  } = insurance
  const showCreateModal = () => {
    dispatch({
      type: 'insurance/prepareShowModal',
      payload: {
        modalType: 'create',
      },
    })
  }
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    tableData,
    confirmLoading: loading.effects['insurance/create'],
    title: `${modalType === 'create' ? '创建' : 'Update User'}`,

    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      let _tableData = tableData.map((item) => {
        item.chargingUnit = item.unit
        return item
      })
      data.insuranceRateDtoList = _tableData
      data.createUser = 'nocookie'
      data.updateUser = 'nocookie'
      dispatch({
        type: `insurance/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'insurance/hideModal',
      })
    },

    handleAdd () {
      dispatch({
        type: 'insurance/addTableRow',
        payload: { unit: 0, rate: 0, edit: true },
      })
    },
    saveRow (record) {
      dispatch({
        type: 'insurance/saveTableRow',
        payload: record,
      })
    },
    deleteRow (record) {
      dispatch({
        type: 'insurance/deleteTableRow',
        payload: record,
      })
    },
    onChangeUnit (e, record) {
      record.unit = e.target.value
      dispatch({
        type: 'insurance/changUnit',
        payload: record,
      })
    },
    onChangeRate (e, record) {
      record.rate = e
      dispatch({
        type: 'insurance/changRate',
        payload: record,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['insurance/query'],
    // pagination,
    location,
    isMotion,
    onChange () {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
        }),
      }))
    },
    onDeleteItem (id) {
      let data = {}
      data.id = id
      data.updateUser = 'nocookie'
      dispatch({
        type: 'insurance/delete',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'insurance/prepareShowModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }


  return (
    <Page inner>
      <Row style={{
        marginBottom: 24,
        textAlign: 'right',
        fontSize: 13,
      }}
      >
        <Col>
          <AuthButton child={[ <Button type="primary" onClick={showCreateModal} icon="plus" className="margin-right" style={{ background: 'rgb(89, 205, 33)', color: 'rgb(255, 255, 255)' }}>增加</Button>]} resourceId={'RES_2_172'} />

        </Col>
      </Row>
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Insurance.propTypes = {
  insurance: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ insurance, loading }) => ({
  insurance,
  loading,
}))(Insurance)
