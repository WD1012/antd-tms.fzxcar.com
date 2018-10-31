import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Modal, List, Card,Avatar,Icon,   } from 'antd'
import Lightbox from 'react-image-lightbox'
import { Page } from 'components'
import queryString from 'query-string'
import VinModal from './Modal'
import { message } from 'antd/lib/index'
import OnWayInfoModal from './OnWayInfoModal'
import ShowNomalPicsModal from './ShowNomalPicsModal'
import ShowGuaranteeSlipModal from './ShowGuaranteeSlipModal'
import ShowDeliveryVehicleSlipModal from './ShowDeliveryVehicleSlipModal'
import ShowExceptionPicsModal from './ShowExceptionPicsModal'
import ShowLSDeliveryVehiclePicsModal from './LSDeliveryVehicleSlipModal'

import ExceptionRemarkModal from './ExceptionRemarkModal'
import accounting from 'utils/accounting'
import AuthButton from '../../components/AuthButton/AuthButton'

const { Meta } = Card;
const VehicleDetail = ({
  location, dispatch, vehicleDetail, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem,
    nomalPicsModalVisible,
    exceptionPicsModalVisible,
    insurancePicsModalVisible,
    referPicsModalVisible,
    showEditCarModalVisible,
    showAddOnwayInfoModalVisible,
    ldsPicsModalVisible,
    modalType,
    isMotion,
    pics,
    nomalPics,
    nomalPicsActiveIndex,
    exceptionPics,
    exceptionPicsActiveIndex,
    insurancePics,
    insurancePicsActiveIndex,
    referPics,
    lsdreferPics,
    ldsReferPicsActiveIndex,
    referPicsActiveIndex,
    images, activeIndex,
    editable,
    regionResultList,
    editShowNomalPicsModalVisible,
    mileagePicFileList,//里程
    vinPicFileList,//车架号
    f45PicFileList,//前45度
    b45PicFileList,//后45度
    fInsidePicFileList,//内饰(前)
    bInsidePicFileList,//内饰（后）
    rightPicFileList,//右侧
    enginePicFileList,//发动机

    guaranteeSlipVisible,//保单
    guaranteeSlipFileList,

    deliveryVehicleSlipVisible,//交车单
    deliveryVehicleSlipFileList,
    pickerInfo,//提车人

    lsDeliveryVehicleSlipVisible,//入物流库交车单
    lsDeliveryVehicleSlipFileList,
    preViewLsDeliveryVisible,
    preViewLsDeliveryUrl,

    exceptionPicsVisible,//异常照片
    exceptionPicsFileList,

    exceptionRemarkVisible,//异常照片描述
    exceptionPicsItem,

    controlDisplay,

  } = vehicleDetail

  const isEditPics = currentItem.status <= 2 && currentItem.passFlag != 1

  console.log(currentItem.storeType)

  const isDeliveryVehicleSlip = currentItem.status === 6
  const deleteOnwayInfo = (e, onwayInfo) => {
    e.preventDefault()
    onwayInfo.userCode = 'zzh'
    Modal.confirm({
      title: '确定删除这条记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'vehicleDetail/delete',
          payload: onwayInfo,
        })
      },
    })
  }
  const renderOnwayInfo = () => {
    if (currentItem.onwayInfo) {
      return (<List dataSource={currentItem.onwayInfo}
        renderItem={item => (
          <List.Item key={item.onwayId} actions={[editable && currentItem.status === 4 ?
            <AuthButton child={<a href="#" onClick={(e) => { deleteOnwayInfo(e, item) }}>删除</a> } resourceId='RES_2_137'/>: null]}>
            {item.nodeTime}   {item.provinceName} {item.cityName}   {item.remark}
          </List.Item>
        )}
      />)
      // return currentItem.onwayInfo.map((value, index) => {
      //   return (<Card.Grid key={index}
      //     style={{
      //     width: '100%',
      //     textAlign: 'left',
      //   }}
      //   > {`${value.nodeTime}  ${value.provinceName}${value.cityName}  ${value.remark}`}<br /></Card.Grid>)
      // })
    }
  }
  const editCarVin = () => {
    dispatch({
      type: 'vehicleDetail/showEditCarModal',
      payload: currentItem,
    })
  }

  const editExceptionPicsRemark = (item) => {
    dispatch({
      type: 'vehicleDetail/showEditExceptionPicsDescModal',
      payload: {
        desc:item.desc,
        pictureId:item.pictureId,
      },
    })
  }

  const editGuaranteeSlip = () => {
    dispatch({
      type: 'vehicleDetail/editShowGuaranteeSlipModal',
      payload: currentItem,
    })
  }
  const editDeliveryVehicleSlip = () => {
    dispatch({
      type: 'vehicleDetail/editShowDeliveryVehicleSlipModal',
      payload: currentItem,
    })
  }

  const editLSDeliveryVehicleSlip = () => {
    dispatch({
      type: 'vehicleDetail/editShowLSDeliveryVehicleSlipModal',
      payload: currentItem,
    })
  }

  const editExceptionPics = () => {
    dispatch({
      type: 'vehicleDetail/editShowExceptionPicsModal',
      payload: currentItem,
    })
  }

  const editNomalPics = () => {
    dispatch({
      type: 'vehicleDetail/editShowNomalPicsModal',
      payload: currentItem,
    })
  }
  const addCarVin = (e) => {
    e.preventDefault()
    dispatch({
      type: 'vehicleDetail/showAddOnwayInfoModal',
      payload: currentItem,
    })
  }
  const editShowNomalPicsProps = {
    item: currentItem,
    visible: editShowNomalPicsModalVisible,
    mileagePicFileList,//里程
    vinPicFileList,//车架号
    f45PicFileList,//前45度
    b45PicFileList,//后45度
    fInsidePicFileList,//内饰(前)
    bInsidePicFileList,//内饰（后）
    rightPicFileList,//右侧
    enginePicFileList,//发动机
    controlDisplay,
    confirmLoading: loading.effects['vehicleDetail/updateNomalPics'],
    title: '编辑验车照片',
    wrapClassName: 'vertical-center-modal',

    onmileagePicFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/mileagePicFileSuccess',
          payload:{
            mileagePicFileList:info,
            onUploadId:onUploadId
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/mileagePicFileDone',
          payload:{
            mileagePicFileList:info,
            onUploadId:onUploadId,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },

    onMileagePicFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/mileagePicFileRemove',
      })
    },


    onvinPicFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/vinPicFileSuccess',
          payload:{
            vinPicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/vinPicFileDone',
          payload:{
            vinPicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onVinPicFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/vinPicFileRemove',
      })
    },

    onf45PicFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/f45PicFileSuccess',
          payload:{
            f45PicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/f45PicFileDone',
          payload:{
            f45PicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onF45PicFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/f45PicFileRemove',
      })
    },

    onb45PicFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/b45PicFileSuccess',
          payload:{
            b45PicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/b45PicFileDone',
          payload:{
            b45PicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onB45PicFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/b45PicFileRemove',
      })
    },

    onfInsideFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/finsidePicFileSuccess',
          payload:{
            fInsidePicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/finsidePicFileDone',
          payload:{
            fInsidePicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onFInsideFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/finsidePicFileRemove',
      })
    },

    onbInsideFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/binsidePicFileSuccess',
          payload:{
            bInsidePicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/binsidePicFileDone',
          payload:{
            bInsidePicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onBInsideFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/binsidePicFileRemove',
      })
    },

    onrightFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/rightPicFileSuccess',
          payload:{
            rightPicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/rightPicFileDone',
          payload:{
            rightPicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onRightFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/rightPicFileRemove',
      })
    },

    onengineFileChange (info,onUploadId) {
      const status = info.file.status
      if (status === 'uploading'){
        dispatch({
          type: 'vehicleDetail/enginePicFileSuccess',
          payload:{
            enginePicFileList:info,
          }
        })
      }
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/enginePicFileDone',
          payload:{
            enginePicFileList:info,
          }
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onEngineFileRemove (file) {
      dispatch({
        type: 'vehicleDetail/enginePicFileRemove',
      })
    },

    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'vehicleDetail/updateNomalPics',
        payload: data,
      }).then((result) => {

        if (result === 200) {
          message.success('操作成功')
        }
        if (result === 401) {
          message.warning('请上传里程照片')
        }
        if (result === 402) {
          message.warning('请上传车架号照片')
        }
        if (result === 403) {
          message.warning('请上传前45度照片')
        }
        if (result === 404) {
          message.warning('请上传后45度照片')
        }
        if (result === 405) {
          message.warning('请上传内饰（前）照片')
        }
        if (result === 406) {
          message.warning('请上传内饰（后）照片')
        }
        if (result === 407) {
          message.warning('请上传右侧照片')
        }
        if (result === 408) {
          message.warning('请上传发动机照片')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/cancelNomalPicsModal',
      })
    },
  }

  //保单
  const showGuaranteeSlipModalProps = {
    item: currentItem,
    visible: guaranteeSlipVisible,
    maskClosable: false,
    guaranteeSlipFileList:guaranteeSlipFileList,
    confirmLoading: loading.effects['vehicleDetail/upLoadGuaranteeSlip'],
    title: '上传保单照片',
    wrapClassName: 'vertical-center-modal',
    onUploadChange (info) {

      const status = info.file.status
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/guaranteeSlipFileDone',
          payload: info,
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onUploadRemove (file) {
      dispatch({
        type: 'vehicleDetail/guaranteeSlipFileRemove',
        payload: file,
      })
    },
    onOk (data) {
      dispatch({
        type: 'vehicleDetail/upLoadGuaranteeSlip',
        payload: data,
      }).then((result) => {
        console.log(result)
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/hideGuaranteeSlipModal',
      })
    },
  }

  //交车单
  const showDeliveryVehicleSlipModalProps = {
    item: currentItem,
    visible: deliveryVehicleSlipVisible,
    maskClosable: false,
    pickerInfo:pickerInfo,
    deliveryVehicleSlipFileList:deliveryVehicleSlipFileList,
    confirmLoading: loading.effects['vehicleDetail/upLoadDeliveryVehicleSlip'],
    title: '上传交车单照片',
    wrapClassName: 'vertical-center-modal',
    onUploadChange (info) {

      const status = info.file.status
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/deliveryVehicleSlipFileDone',
          payload: info,
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onUploadRemove (file) {
      dispatch({
        type: 'vehicleDetail/deliveryVehicleFileRemove',
        payload: file,
      })
    },
    onOk (data) {
      dispatch({
        type: 'vehicleDetail/upLoadDeliveryVehicleSlip',
        payload: data,
      }).then((result) => {
        console.log(result)
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/hideDeliveryVehicleSlipModal',
      })
    },
  }


  //入物流库交车单
  const showLSDeliveryVehicleSlipModalProps = {
    item: currentItem,
    visible: lsDeliveryVehicleSlipVisible,
    maskClosable: false,
    lsDeliveryVehicleSlipFileList:lsDeliveryVehicleSlipFileList,
    confirmLoading: loading.effects['vehicleDetail/upLoadLSDeliveryVehicleSlip'],
    preViewLsDeliveryVisible,
    preViewLsDeliveryUrl,
    title: '上传入物流库交车单照片',
    wrapClassName: 'vertical-center-modal',
    onUploadChange (info) {
      const status = info.file.status
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/lsDeliveryVehicleSlipFileDone',
          payload: info,
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onUploadRemove (file) {
      dispatch({
        type: 'vehicleDetail/lsDeliveryVehicleFileRemove',
        payload: file,
      })
    },
    onOk (data) {
      dispatch({
        type: 'vehicleDetail/upLoadLSDeliveryVehicleSlip',
        payload: data,
      }).then((result) => {
        console.log(result)
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/hideLSDeliveryVehicleSlipModal',
      })
    },
    handlePreview(url){
      dispatch({
        type: 'vehicleDetail/onPreviewLsDelivery',
        payload:{
          preViewLsDeliveryUrl:url,
        }
      })
    },
    handleCancel(){
      dispatch({
        type: 'vehicleDetail/onPreviewCanCel',
      })
    }
  }

  //异常照片
  const showExceptionPicsModalProps = {
    item: currentItem,
    visible: exceptionPicsVisible,
    maskClosable: false,
    exceptionPicsFileList:exceptionPicsFileList,
    confirmLoading: loading.effects['vehicleDetail/upLoadExceptionPics'],
    title: '上传异常照片',
    wrapClassName: 'vertical-center-modal',
    onUploadChange (info) {
//hideExceptionPicsModal
      const status = info.file.status
      if (status === 'done') {
        dispatch({
          type: 'vehicleDetail/exceptionPicsFileDone',
          payload: info,
        })
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onUploadRemove (file) {
      dispatch({
        type: 'vehicleDetail/exceptionPicsFileRemove',
        payload: file,
      })
    },
    onOk (data) {
      dispatch({
        type: 'vehicleDetail/upLoadExceptionPics',
        payload: data,
      }).then((result) => {
        console.log(result)
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/hideExceptionPicsModal',
      })
    },
  }

  const editCarModalProps = {
    item: currentItem,
    visible: showEditCarModalVisible,
    confirmLoading: loading.effects['vehicleDetail/updateVin'],
    title: '编辑车架号',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'vehicleDetail/updateVin',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/cancelEditCarModal',
      })
    },
  }

  const editExceptionPicsRemarkProps = {
    item: exceptionPicsItem,
    visible: exceptionRemarkVisible,
    confirmLoading: loading.effects['vehicleDetail/updateExceptionPicsRemark'],
    title: '编辑异常照片备注',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'vehicleDetail/updateExceptionPicsRemark',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/cancelExceptionRemarkModal',
      })
    },
  }

  const addOnWayInfoModalProps = {
    item: currentItem,
    visible: showAddOnwayInfoModalVisible,
    confirmLoading: loading.effects['vehicleDetail/addOnWayInfo'],
    title: '添加在途信息',
    wrapClassName: 'vertical-center-modal',
    regionResultOption: regionResultList,
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      data.provinceCode = data.location[0]
      data.cityCode = data.location[1]
      data.currentItem = currentItem
      dispatch({
        type: 'vehicleDetail/addOnWayInfo',
        payload: data,
      }).then((result) => {
        if (result.data.code === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'vehicleDetail/cancelAddOnwayInfoModal',
      })
    },
    addrLoadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      dispatch({
        type: 'vehicleDetail/load2Address',
        payload: targetOption,
      })
    },
    saveSelectedOptionsFunc (payload) {
      dispatch({
        type: 'vehicleDetail/saveSelectedOptionsLabel',
        payload,
      })
    },
  }
////header={editable ? <AuthButton child={<Button onClick={editNomalPics}>验车照片编辑</Button>} resourceId='RES_2_138'/> : '验车照片'}}
  return (
    <div style={{ background: '#ECECEC', padding: '5px' }}>
      <Page inner>
        <Row gutter={24} className={{ height: 'auto' }} >
          <Col span={6}>
            <Card title="车辆详情" bordered={true} bodyStyle={{ overflow: 'scroll', height: '365px' }}>
              <p> 车架号：{currentItem.vin} &nbsp;{editable && currentItem.status === 2 && currentItem.passFlag !== 1 ?
              <AuthButton child={<Button onClick={editCarVin}>编辑</Button>} resourceId='RES_2_135'/> : null}<br /></p>
              <p> 车辆属性：{currentItem.typeDesc}</p>
              <p>指导价：{accounting.formatMoney(currentItem.carPrice)} 元</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="承运商费用信息" bordered={true} bodyStyle={{ overflow: 'scroll', height: '365px' }}>
              <p>运费：	{accounting.formatMoney(currentItem.carrierFreightPrice)} 元</p>
              <p>送店费：	{accounting.formatMoney(currentItem.carrierStorePrice)} 元</p>
              {/* 等待费:	{currentItem.carrierWaitPrice}<br /> */}
              {/* 放空费:	{currentItem.carrierEmptyPrice}<br /> */}
              <p>提验车费：{accounting.formatMoney(currentItem.carrierCheckPrice)} 元</p>
              <p>保险费：{accounting.formatMoney(currentItem.carrierInsurancePrice)} 元</p>
              {/* 税费:	{currentItem.carrierTaxation}<br /> */}
              <p>总价：	{accounting.formatMoney(currentItem.carrierTotalPrice)} 元</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="客户费用信息" bordered={true} bodyStyle={{ overflow: 'scroll', height: '365px' }}>
              <p>运费：	{accounting.formatMoney(currentItem.customerFreightPrice)} 元</p>
              <p>送店费：	{accounting.formatMoney(currentItem.customerStorePrice)} 元</p>
              <p>服务费：	{accounting.formatMoney(currentItem.customerServicePrice)} 元</p>
              <p>提验车费：	{accounting.formatMoney(currentItem.customerCheckPrice)} 元</p>
              <p>保险费：	{accounting.formatMoney(currentItem.customerInsurancePrice)} 元</p>
              {/* 税费:	{currentItem.customerTaxation}<br /> */}
              <p>总价：	{accounting.formatMoney(currentItem.customerTotalPrice)} 元</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="在途信息" bodyStyle={{ overflow: 'scroll', height: '365px' }} bordered={true} extra={editable && currentItem.status === 4 ?<AuthButton child={<a href="#" onClick={(e) => { addCarVin(e) }}>添加</a>} resourceId='RES_2_136'/> : null}>
              {renderOnwayInfo()}
            </Card>
          </Col>
        </Row>

        {editable && isEditPics && <Row gutter={8}    style={{paddingLeft:5,paddingTop:5,marginBottom:5}}>
          <AuthButton child={<Button onClick={editNomalPics}>验车照片编辑</Button>} resourceId='RES_2_138'/>
        </Row>}
        {nomalPics.length > 0 && <Row gutter={8}  style={{paddingLeft:0,paddingTop:10,marginBottom:5}}>
          <List
            grid={{ gutter: 64, column: 3 }}
            bordered={false}
            dataSource={nomalPics.map((pic) => { return pic.src })}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Card bordered={true} title={nomalPics[index].picturePositionName} extra={<a href="#"></a>} style={{ width: 300,height:300,overflow:'hidden' }}
                      cover={<img alt="example"src={item} width={300}
                                  onClick={() => {
                                    dispatch({
                                      type: 'vehicleDetail/startNomalPicsImgView',
                                      payload: {
                                        visible: true,
                                        nomalPicsActiveIndex: index,
                                      },
                                    })
                                  }} />}
                >
                </Card>
              </List.Item>
          )}
          />
        </Row>}
        {editable && isEditPics && <Row gutter={8}    style={{paddingLeft:5,paddingTop:5,marginBottom:5}}>
          <AuthButton child={<Button onClick={editExceptionPics}>异常照片编辑</Button>} resourceId='RES_2_140'/>
        </Row>}

        {exceptionPics.length > 0 &&  <Row gutter={8}  style={{paddingLeft:0,paddingTop:10,marginBottom:5}}>
          <List
            grid={{ gutter: 64, column: 3 }}
            bordered={false}
            dataSource={exceptionPics.map((pic) => { return pic.src })}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Card bordered={true}  title= '异常照片' style={{ width: 300,height:300,}}
                      cover={
                        <img src={item} width={300} height={300}
                             onClick={() => {
                               dispatch({
                                 type: 'vehicleDetail/startExceptionPicsImgView',
                                 payload: {
                                   visible: true,
                                   exceptionPicsActiveIndex: index,
                                 },
                               })
                             }}
                        />
                      }
                      actions={[ editable && isEditPics ? <Icon type="edit" onClick={e => editExceptionPicsRemark(exceptionPics[index], e)}/> :  <Icon type="edit"/>, ]}>
                  <Meta
                    description={exceptionPics[index].desc}
                  />
                </Card>
              </List.Item>
          )}
          />
        </Row>}
        {editable && <Row gutter={8}    style={{paddingLeft:5,paddingTop:5,marginBottom:5}}>
          <AuthButton child={<Button onClick={editGuaranteeSlip}>保单信息编辑</Button>} resourceId='RES_2_139'/>
        </Row>}

          {insurancePics.length > 0 &&  <Row gutter={8}  style={{paddingLeft:0,paddingTop:10,marginBottom:5}}>
            <List
              grid={{ gutter: 8, column: 3 }}
              border={false}
              dataSource={insurancePics.map((pic) => { return pic.src })}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Card bordered={true} title= '保单'  style={{ width: 300,height:300,overflow:'hidden' }}
                        cover={
                          <img src={item} width={300}
                               onClick={() => {
                                 dispatch({
                                   type: 'vehicleDetail/startInsurancePicsImgView',
                                   payload: {
                                     visible: true,
                                     insurancePicsActiveIndex: index,
                                   },
                                 })
                               }}
                          />
                        }
                   >
                  </Card>
                </List.Item>
            )}
            />
          </Row>}
        {editable && isDeliveryVehicleSlip  && <Row gutter={8} style={{paddingLeft:5,paddingTop:5,marginBottom:5}}>
          <AuthButton child={<Button onClick={editDeliveryVehicleSlip}>交车单编辑</Button>} resourceId='RES_2_141'/>
        </Row>}

          {referPics.length > 0 &&  <Row gutter={8}  style={{paddingLeft:0,paddingTop:10,marginBottom:5}}>
            <List
              border={false}
              grid={{ gutter: 8, column: 3 }}
              dataSource={referPics.map((pic) => { return pic.src })}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Card bordered={true} title= '交车单' style={{ width: 300,height:300,overflow:'hidden' }}
                        cover={
                          <img src={item}
                               width={300}
                               onClick={() => {
                                 dispatch({
                                   type: 'vehicleDetail/startReferPicsImgView',
                                   payload: {
                                     visible: true,
                                     referPicsActiveIndex: index,
                                   },
                                 })
                               }}
                          />
                        }
                  >
                  </Card>
                </List.Item>
              )}
            />
          </Row>}

        {false && editable && currentItem.status >= 5  && currentItem.storeType && <Row gutter={8} style={{paddingLeft:5,paddingTop:5,marginBottom:5}}>
          <AuthButton child={<Button onClick={editLSDeliveryVehicleSlip}>入物流库交车单</Button>} resourceId='RES_2_141'/>
        </Row>}
        {lsdreferPics.length > 0 &&  <Row gutter={8}  style={{paddingLeft:0,paddingTop:10,marginBottom:5}}>
          <List
            border={false}
            grid={{ gutter: 8, column: 3 }}
            dataSource={lsdreferPics.map((pic) => { return pic.src })}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Card bordered={true} title= '入物流库交车单' style={{ width: 300,height:300,overflow:'hidden' }}
                      cover={
                        <img src={item}
                             width={300}
                             onClick={() => {
                               dispatch({
                                 type: 'vehicleDetail/startLdsReferPicsImgView',
                                 payload: {
                                   visible: true,
                                   ldsReferPicsActiveIndex: index,
                                 },
                               })
                             }}
                        />
                      }
                >
                </Card>
              </List.Item>
            )}
          />
        </Row>}


        {nomalPicsModalVisible && <Lightbox
          mainSrc={nomalPics[nomalPicsActiveIndex].src}
          mainSrcThumbnail={nomalPics[nomalPicsActiveIndex].thumbnail}
          imageTitle={nomalPics[nomalPicsActiveIndex].desc}
          nextSrc={nomalPics[(nomalPicsActiveIndex + 1) % nomalPics.length].src}
          nextSrcThumbnail={nomalPics[(nomalPicsActiveIndex + 1) % nomalPics.length].thumbnail}
          prevSrc={nomalPics[(nomalPicsActiveIndex + nomalPics.length - 1) % nomalPics.length].src}
          prevSrcThumbnail={nomalPics[(nomalPicsActiveIndex + nomalPics.length - 1) % nomalPics.length].thumbnail}
          enableZoom={false}
          nextLabel="下一张"
          prevLabel="上一张"
          onCloseRequest={() => {
          dispatch({
            type: 'vehicleDetail/closeNomalPicsImgViewer',
          })
        }}
          onMovePrevRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateNomalPicsActiveIndex',
            payload: {
              nomalPicsActiveIndex: (nomalPicsActiveIndex + nomalPics.length - 1) % nomalPics.length,
            },
          })
        }
        }
          onMoveNextRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateNomalPicsActiveIndex',
            payload: {
              nomalPicsActiveIndex: (nomalPicsActiveIndex + 1) % nomalPics.length,
            },
          })
        }
        }
        />}
        {exceptionPicsModalVisible && <Lightbox
          mainSrc={exceptionPics[exceptionPicsActiveIndex].src}
          mainSrcThumbnail={exceptionPics[exceptionPicsActiveIndex].thumbnail}
          imageTitle={exceptionPics[exceptionPicsActiveIndex].desc}
          nextSrc={exceptionPics[(exceptionPicsActiveIndex + 1) % exceptionPics.length].src}
          nextSrcThumbnail={exceptionPics[(exceptionPicsActiveIndex + 1) % exceptionPics.length].thumbnail}
          prevSrc={exceptionPics[(exceptionPicsActiveIndex + exceptionPics.length - 1) % exceptionPics.length].src}
          prevSrcThumbnail={exceptionPics[(exceptionPicsActiveIndex + exceptionPics.length - 1) % exceptionPics.length].thumbnail}
          enableZoom={false}
          nextLabel="下一张"
          prevLabel="上一张"
          onCloseRequest={() => {
          dispatch({
            type: 'vehicleDetail/closeExceptionPicsImgViewer',
          })
        }}
          onMovePrevRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateExceptionPicsActiveIndex',
            payload: {
              exceptionPicsActiveIndex: (exceptionPicsActiveIndex + exceptionPics.length - 1) % exceptionPics.length,
            },
          })
        }
        }
          onMoveNextRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateExceptionPicsActiveIndex',
            payload: {
              exceptionPicsActiveIndex: (exceptionPicsActiveIndex + 1) % exceptionPics.length,
            },
          })
        }
        }
        />}
        {insurancePicsModalVisible && <Lightbox
          mainSrc={insurancePics[insurancePicsActiveIndex].src}
          mainSrcThumbnail={insurancePics[insurancePicsActiveIndex].thumbnail}
          imageTitle={insurancePics[insurancePicsActiveIndex].desc}
          nextSrc={insurancePics[(insurancePicsActiveIndex + 1) % insurancePics.length].src}
          nextSrcThumbnail={insurancePics[(insurancePicsActiveIndex + 1) % insurancePics.length].thumbnail}
          prevSrc={insurancePics[(insurancePicsActiveIndex + insurancePics.length - 1) % insurancePics.length].src}
          prevSrcThumbnail={insurancePics[(insurancePicsActiveIndex + insurancePics.length - 1) % insurancePics.length].thumbnail}
          enableZoom={false}
          nextLabel="下一张"
          prevLabel="上一张"
          onCloseRequest={() => {
          dispatch({
            type: 'vehicleDetail/closeInsurancePicsImgViewer',
          })
        }}
          onMovePrevRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateInsurancePicsActiveIndex',
            payload: {
              insurancePicsActiveIndex: (insurancePicsActiveIndex + insurancePics.length - 1) % insurancePics.length,
            },
          })
        }
        }
          onMoveNextRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateInsurancePicsActiveIndex',
            payload: {
              insurancePicsActiveIndex: (insurancePicsActiveIndex + 1) % insurancePics.length,
            },
          })
        }
        }
        />}
        {referPicsModalVisible && <Lightbox
          mainSrc={referPics[referPicsActiveIndex].src}
          mainSrcThumbnail={referPics[referPicsActiveIndex].thumbnail}
          imageTitle={referPics[referPicsActiveIndex].desc}
          nextSrc={referPics[(referPicsActiveIndex + 1) % referPics.length].src}
          nextSrcThumbnail={referPics[(referPicsActiveIndex + 1) % referPics.length].thumbnail}
          prevSrc={referPics[(referPicsActiveIndex + referPics.length - 1) % referPics.length].src}
          prevSrcThumbnail={referPics[(referPicsActiveIndex + referPics.length - 1) % referPics.length].thumbnail}
          enableZoom={false}
          nextLabel="下一张"
          prevLabel="上一张"
          onCloseRequest={() => {
          dispatch({
            type: 'vehicleDetail/closeReferPicsImgViewer',
          })
        }}
          onMovePrevRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateReferPicsActiveIndex',
            payload: {
              referPicsActiveIndex: (referPicsActiveIndex + referPics.length - 1) % referPics.length,
            },
          })
        }
        }
          onMoveNextRequest={() => {
          dispatch({
            type: 'vehicleDetail/updateReferPicsActiveIndex',
            payload: {
              referPicsActiveIndex: (referPicsActiveIndex + 1) % referPics.length,
            },
          })
        }
        }
        />}

        {ldsPicsModalVisible && <Lightbox
          mainSrc={lsdreferPics[ldsReferPicsActiveIndex].src}
          mainSrcThumbnail={lsdreferPics[ldsReferPicsActiveIndex].thumbnail}
          imageTitle={lsdreferPics[ldsReferPicsActiveIndex].desc}
          nextSrc={lsdreferPics[(ldsReferPicsActiveIndex + 1) % lsdreferPics.length].src}
          nextSrcThumbnail={lsdreferPics[(ldsReferPicsActiveIndex + 1) % lsdreferPics.length].thumbnail}
          prevSrc={lsdreferPics[(ldsReferPicsActiveIndex + referPics.length - 1) % lsdreferPics.length].src}
          prevSrcThumbnail={lsdreferPics[(ldsReferPicsActiveIndex + lsdreferPics.length - 1) % lsdreferPics.length].thumbnail}
          enableZoom={false}
          nextLabel="下一张"
          prevLabel="上一张"
          onCloseRequest={() => {
            dispatch({
              type: 'vehicleDetail/closeLdsReferPicsImgViewer',
            })
          }}
          onMovePrevRequest={() => {
            dispatch({
              type: 'vehicleDetail/updateLdsReferPicsActiveIndex',
              payload: {
                ldsReferPicsActiveIndex: (ldsReferPicsActiveIndex + lsdreferPics.length - 1) % referPics.length,
              },
            })
          }
          }
          onMoveNextRequest={() => {
            dispatch({
              type: 'vehicleDetail/updateLdsReferPicsActiveIndex',
              payload: {
                ldsReferPicsActiveIndex: (ldsReferPicsActiveIndex + 1) % lsdreferPics.length,
              },
            })
          }
          }
        />}

        {showEditCarModalVisible && <VinModal {...editCarModalProps} />}
        {showAddOnwayInfoModalVisible && <OnWayInfoModal {...addOnWayInfoModalProps} />}
        {editShowNomalPicsModalVisible && <ShowNomalPicsModal {...editShowNomalPicsProps} />}
        {guaranteeSlipVisible && <ShowGuaranteeSlipModal {...showGuaranteeSlipModalProps} />}
        {deliveryVehicleSlipVisible && <ShowDeliveryVehicleSlipModal {...showDeliveryVehicleSlipModalProps} />}
        {exceptionPicsVisible && <ShowExceptionPicsModal {...showExceptionPicsModalProps} />}
        {exceptionRemarkVisible && <ExceptionRemarkModal {...editExceptionPicsRemarkProps} />}
        {lsDeliveryVehicleSlipVisible && <ShowLSDeliveryVehiclePicsModal {...showLSDeliveryVehicleSlipModalProps }/>}
      </Page>
    </div>
  )
}

VehicleDetail.propTypes = {
  vehicleDetail: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ vehicleDetail, loading }) => ({ vehicleDetail, loading }))(VehicleDetail)
