import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Select } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import UpdateModal from './UpdateModal'
import { message, } from 'antd';
const CityLogisticsHub = ({
  location, dispatch, cityLogisticsHub, loading,
                          }) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    modalVisible,addrOptions,lon,lat,address,markerVisible,center,list, pagination,updateModalVisible,item,
  } = cityLogisticsHub


  const addrLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'cityLogisticsHub/lazilyAddr3',
      payload:targetOption
    })
  }
  const { pageSize } = pagination

  const modalProps = {
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cityLogisticsHub/save'],
    title: '新增枢纽',
    wrapClassName: 'vertical-center-modal',
    addrOptions:addrOptions,
    lon,lat,address,markerVisible,center,
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
    onOk () {
      dispatch({
        type: `cityLogisticsHub/save`,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'cityLogisticsHub/hideModal',
      })
    },addrLoadData,
    local(addr,addrs){
      dispatch({
        type: 'cityLogisticsHub/local',
        payload:{
          center:addr,
          addrs:addrs
        }
      })
    },
    dot(lon,lat,address){
      dispatch({
        type: 'cityLogisticsHub/dot',
        payload:{
          lon:lon,
          lat:lat,
          address:address,
        }
      })

    }
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
        pathname: '/cityLogisticsHub',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/cityLogisticsHub',
      }))
    },

    onAdd () {
      dispatch({
        type: 'cityLogisticsHub/prepareShowModal',
      })
    },

  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['cityLogisticsHub/query'],
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
    onEditItem (item) {
      dispatch({
        type: 'cityLogisticsHub/prepareShowUpdateModal',
        payload: {
          currentItem: item,
        },
      })
    },
    deleteClick (item) {
      item.updateUser = 'nocookie'
      dispatch({
        type: 'cityLogisticsHub/del',
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

  const modalUpdateProps = {
    item:item,
    visible: updateModalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['cityLogisticsHub/update'],
    title: '编辑枢纽',
    wrapClassName: 'vertical-center-modal',
    addrOptions:addrOptions,
    lon,lat,address,markerVisible,center,
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
    onOk () {
      dispatch({
        type: `cityLogisticsHub/update`,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
          dispatch({
            type: `cityLogisticsHub/query`,
            payload:  queryString.parse(location.search),
          })
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'cityLogisticsHub/hideUpdateModal',
      })
    },addrLoadData,
    local(addr,addrs){
      dispatch({
        type: 'cityLogisticsHub/local',
        payload:{
          center:addr,
          addrs:addrs
        }
      })
    },
    dot(lon,lat,address){
      dispatch({
        type: 'cityLogisticsHub/dot',
        payload:{
          lon:lon,
          lat:lat,
          address:address,
        }
      })

    }
  }


  return (
    <Page inner>
      <Filter {...filterProps} />
      {modalVisible && <Modal {...modalProps} />}
      {updateModalVisible  && <UpdateModal {...modalUpdateProps} />}
      <List {...listProps} />
    </Page>
  )
}

CityLogisticsHub.propTypes = {
  cityLogisticsHub: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ cityLogisticsHub, loading }) => ({ cityLogisticsHub, loading }))(CityLogisticsHub)
