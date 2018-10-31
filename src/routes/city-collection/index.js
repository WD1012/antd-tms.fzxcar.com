import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Select, Modal } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import ModalSelf from './Modal'
import UpdateModal from './UpdateModal'
import { message, } from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import AuthButton from "../../components/AuthButton/AuthButton";

import ModalProvinceSelf from './ProvinceModal'
import ModalRegionSelf from './RegionModal'

import UpdateProvinceModal from './UpdateProvinceModal'
import UpdateRegionModal from './UpdateRegionModal'

let tab ;
const CityCollection = ({
  location, dispatch, cityCollection, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location

  const {
    list, pagination, currentItem, modalVisible, modalType,
    isMotion, provinceListOption, cityListOption,selectedList, targetKeys, targetCheckboxs,
    updateModalVisible,updateCheckBoxDefault,

    modalProvinceVisible,
    candidateProvinceList,//候选省列表
    selectedProvinceList,//已选省列表
    updateProvinceModalVisible,

    modalRegionVisible,//区
    candidateRegionList, //候选区列表
    selectedRegionList,//已选区列表
    updateRegionModalVisible,
    addrOptions,
    collectionType,

  } = cityCollection
  const { pageSize } = pagination
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    provinceListOption: provinceListOption.map((item) => {
      return (<Select.Option key={item.id}> {item.desc} </Select.Option>)
    }),
    cityListOption: cityListOption.map((item) => {
      return {
        key: item.id,
        title: item.desc,
        description: item.desc,
        disabled: false,
      }
    }),
    checkboxGroup: cityListOption.map((item) => {
      return {
        value: `${item.id},` + `${item.desc}`,
        label: item.desc,
      }
    }),
    targetCheckboxs,
    checkBoxOnChange (e) {
      dispatch({
        type: 'cityCollection/updateSelectCheckBox',
        payload: e,
      })
    },
    removeCity (e) {
      dispatch({
        type: 'cityCollection/removeSelectCheckBox',
        payload: e,
      })
    },
    addToCity () {

    },
    targetKeys,
    selectedList,
    maskClosable: false,
    confirmLoading: loading.effects['cityCollection/create'],
    title: '创建城市集合',
    wrapClassName: 'vertical-center-modal',
    onTransferChange (nextTargetKeys, direction, moveKeys) {
      dispatch({
        type: 'cityCollection/changeTransferChange',
        payload: { nextTargetKeys, direction, moveKeys },
      })
    },onSelected(e){
      dispatch({
        type: 'cityCollection/onSelected',
        payload: e,
      })
    },
    onSearchCity (data) {
      dispatch({
        type: 'cityCollection/selectCityByProvince',
        payload: data.key,
      })
    },
    onOk (data) {
      dispatch({
        type: 'cityCollection/create',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'cityCollection/hideModal',
      })
    },
  }
  const updateModalVisibleProps = {
    item: currentItem,
    visible: updateModalVisible,
    provinceListOption: provinceListOption.map((item) => {
      return (<Select.Option key={item.id}> {item.desc} </Select.Option>)
    }),
    cityListOption: cityListOption.map((item) => {
      return {
        key: item.id,
        title: item.desc,
        description: item.desc,
        disabled: false,
      }
    }),
    checkboxGroup: cityListOption.map((item) => {
      return {
        value: `${item.id},` + `${item.desc}`,
        label: item.desc,
      }
    }),
    targetCheckboxs,
    updateCheckBoxDefault,
    checkBoxOnChange (e) {
      dispatch({
        type: 'cityCollection/updateUpdateSelectCheckBox',
        payload: e,
      })
    },
    removeCity (e) {
      dispatch({
        type: 'cityCollection/removeUpdateSelectCheckBox',
        payload: e,
      })
    },onSelected(e){
      dispatch({
        type: 'cityCollection/onSelected',
        payload: e,
      })
    },
    addToCity () {

    },
    targetKeys,
    maskClosable: false,
    confirmLoading: loading.effects['cityCollection/update'],
    title: '编辑城市集合',
    wrapClassName: 'vertical-center-modal',
    onTransferChange (nextTargetKeys, direction, moveKeys) {
      dispatch({
        type: 'cityCollection/changeTransferChange',
        payload: { nextTargetKeys, direction, moveKeys },
      })
    },
    onSearchCity (data) {
      dispatch({
        type: 'cityCollection/selectCityByProvince',
        payload: data.key,
      })
    },
    onOk (data) {
      dispatch({
        type: 'cityCollection/update',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'cityCollection/hideUpdateModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['cityCollection/query'],
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
    onDeleteItem (e, id) {
      e.preventDefault()
      Modal.confirm({
        title: '确定删除这条记录?',
        onOk () {
          dispatch({
            type: 'cityCollection/delete',
            payload: id,
          })
        },
      })
    },
    onHrefEdit (e, item) {

      e.preventDefault()
      tab = collectionType?collectionType:queryString.parse(location.search).queryType

      if(tab.toString() === '3'){
        dispatch({
          type: 'cityCollection/showProvinceEidtModal',
          payload: item,
        })
      }else if(tab.toString() === '0'){
        dispatch({
          type: 'cityCollection/showEidtModal',
          payload: item,
        })
      }else if(tab.toString() === '2'){
        dispatch({
          type: 'cityCollection/showRegionEidtModal',
          payload: item,
        })
      }
    },
  }

  const modalProvinceProps = {
    visible: modalProvinceVisible,
    checkboxGroup: candidateProvinceList.map((item) => {
      return {
        value: `${item.id},` + `${item.desc}`,
        label: item.desc,
      }
    }),
    targetCheckboxs,
    targetKeys,
    selectedProvinceList,
    maskClosable: false,
    confirmLoading: loading.effects['cityCollection/createProvince'],
    title: '创建省份集合',
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cityCollection/hideProvinceModal',
      })
    },onSelected(e){
      dispatch({
        type: 'cityCollection/onSelectedProvince',
        payload: e,
      })
    }, removeCity (e) {
      dispatch({
        type: 'cityCollection/removeSelectProvinceCheckBox',
        payload: e,
      })
    },onOk (data) {
      dispatch({
        type: 'cityCollection/createProvince',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
  }

  const callback =(key) => {
    tab = key
    dispatch(routerRedux.push({
      pathname: location.pathname,
      search: queryString.stringify({
        page: 1,
        pageSize,
        queryType:key
      }),
    }))
  }
  const createCollection = () => {

    tab = collectionType?collectionType:queryString.parse(location.search).queryType

    if(tab.toString() === '3'){
      dispatch({
        type: 'cityCollection/showProvinceCreate',
      })
    }else if(tab.toString() === '0'){
      dispatch({
        type: 'cityCollection/showCreate',
      })
    }else if(tab.toString() === '2'){
      dispatch({
        type: 'cityCollection/showRegionCreate',
      })
    }
  }

  const addrLoadData = (selectedOptions) => {

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'cityCollection/lazilyAddr',
      payload:targetOption
    })
  }

  const modalRegionProps = {
    visible: modalRegionVisible,
    addrOptions:addrOptions,
    checkboxGroup: candidateRegionList.map((item) => {
      return {
        value: `${item.id},` + `${item.desc}`,
        label: item.desc,
      }
    }),
    targetCheckboxs,
    targetKeys,
    selectedRegionList,
    maskClosable: false,
    confirmLoading: loading.effects['cityCollection/createRegion'],
    title: '创建区集合',
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'cityCollection/hideRegionModal',
      })
    },onSelectedProvinceCity(e){
      dispatch({
        type: 'cityCollection/onSelectedProvinceCity',
        payload: e,
      })
    }, onSelected(e){
      dispatch({
        type: 'cityCollection/onSelectedRegion',
        payload: e,
      })
    },removeCity (e) {
      dispatch({
        type: 'cityCollection/removeSelectRegionCheckBox',
        payload: e,
      })
    },onOk (data) {
      dispatch({
        type: 'cityCollection/createRegion',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },addrLoadData,
  }

  const updateProvinceModalVisibleProps = {
    item: currentItem,
    visible: updateProvinceModalVisible,

    candidateProvinceList: candidateProvinceList.map((item) => {
      return {
        value: `${item.id},` + `${item.desc}`,
        label: item.desc,
      }
    }),
    selectedProvinceList,
    removeCity (e) {
      dispatch({
        type: 'cityCollection/removeSelectProvinceCheckBox',
        payload: e,
      })
    },onSelected(e){
      dispatch({
        type: 'cityCollection/onSelectedProvince',
        payload: e,
      })
    },
    maskClosable: false,
    confirmLoading: loading.effects['cityCollection/updateProvince'],
    title: '编辑省份集合',
    wrapClassName: 'vertical-center-modal',
    onTransferChange (nextTargetKeys, direction, moveKeys) {
      dispatch({
        type: 'cityCollection/changeTransferChange',
        payload: { nextTargetKeys, direction, moveKeys },
      })
    },
    onOk (data) {
      dispatch({
        type: 'cityCollection/updateProvince',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'cityCollection/hideUpdateProvinceModal',
      })
    },
  }

  const updateRegionModalVisibleProps = {
    item: currentItem,
    visible: updateRegionModalVisible,

    candidateRegionList: candidateRegionList.map((item) => {
      return {
        value: `${item.id},` + `${item.desc}`,
        label: item.desc,
      }
    }),
    selectedRegionList,
    removeCity (e) {
      dispatch({
        type: 'cityCollection/removeSelectRegionCheckBox',
        payload: e,
      })
    },onSelected(e){
      dispatch({
        type: 'cityCollection/onSelectedRegion',
        payload: e,
      })
    },
    maskClosable: false,
    confirmLoading: loading.effects['cityCollection/updateRegion'],
    title: '编辑区集合',
    wrapClassName: 'vertical-center-modal',
    onTransferChange (nextTargetKeys, direction, moveKeys) {
      dispatch({
        type: 'cityCollection/changeTransferChange',
        payload: { nextTargetKeys, direction, moveKeys },
      })
    },
    onOk (data) {
      dispatch({
        type: 'cityCollection/updateRegion',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'cityCollection/hideUpdateRegionModal',
      })
    },
  }

  return (
    <Page inner>
      <Tabs defaultActiveKey={collectionType?collectionType:queryString.parse(location.search).queryType}  onChange={callback} tabBarExtraContent={
        <AuthButton child={[ <Button style={{ background: 'rgb(89, 205, 33)', color: 'rgb(255, 255, 255)', marginLeft: 8 }} icon="plus" onClick={createCollection}>增加</Button>]} resourceId={'RES_2_174'} />}
      >
        <TabPane tab="省集合" key="3">
          {modalProvinceVisible && <ModalProvinceSelf {...modalProvinceProps} />}
          <List {...listProps} />
          {updateProvinceModalVisible && <UpdateProvinceModal {...updateProvinceModalVisibleProps} />}
        </TabPane>
        <TabPane tab="市集合" key="0">
          <List {...listProps} />
          {modalVisible && <ModalSelf {...modalProps} />}
          {updateModalVisible && <UpdateModal {...updateModalVisibleProps} />}
        </TabPane>
        <TabPane tab="区集合" key="2">
          {modalRegionVisible && <ModalRegionSelf {...modalRegionProps} />}

          {updateRegionModalVisible && <UpdateRegionModal {...updateRegionModalVisibleProps} />}
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </Page>
  )
}

CityCollection.propTypes = {
  cityCollection: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ cityCollection, loading }) => ({ cityCollection, loading }))(CityCollection)
