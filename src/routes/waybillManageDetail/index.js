import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, List, Card, Table, Button, message, Modal, Select, Divider } from 'antd'
import Lightbox from 'react-image-lightbox'
import { Link } from 'react-router-dom'
import { Page } from 'components'
import SelfModal from './Modal'
import UpdateModal from './UpdateModal'
import ShowOnWayInfoModal from './ShowOnWayInfoModal'
import EditCarrierFeeModal from './EditCarrierFeeModal'
import EditClientFeeModal from './EditClientFeeModal'
import EditSenderManModal from './EditSenderManModal'
import EditDriverModal from './EditDriverModal'
import EditPlatOperatorModal from './EditPlatOperatorModal'
import EditStoreModal from './EditStoreModal'
import styles from './index.less'
import AuthButton from '../../components/AuthButton/AuthButton'
import accounting from 'utils/accounting'
import OnWayInfoModal from './OnWayInfoModal'
let vehicleRows
const WaybillManageDetail = ({
  waybillDetail, dispatch, loading, location,
}) => {
  const {
    currentItem, modalVisible, previewVisible, previewImage, onWayInfoModalVisible, onWayInfo,
    picsModalVisible,
    activeIndex,
    pics,
    noPic,
    fileList,
    fileListActiveIndex,
    updatePicsModalVisible,
    showEditCarrierFeeModalVisible,
    showEditSenderManModalVisible,
    showEditDriverModalVisible,
    showEditPlatOperatorModalVisible,
    editStoreModalVisible,
    updateFileList,
    updateFileListActiveIndex,
    editable,
    storeList,
    showAddOnwayInfoModalVisible,
    regionResultList,
    batchVehicleRows,
    showEditClientFeeModalVisible,
  } = waybillDetail
  const clickTransport = (e) => {
    e.preventDefault()
    dispatch({
      type: 'waybillDetail/showModal',
      payload: currentItem,
    }).then((data) => {
      if (data === 404) {
        message.warn('没有图片可查看')
      }
    })
  }

  const vehicleEdit = currentItem.status > 2

  const onClickNoticeReleaseVehicle = (e, record) => {
    e.preventDefault()
    Modal.confirm({
      title: '确认通知放车',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'waybillDetail/noticeReleaseVehicle',
          payload: record,
        })
      },
    })
  }

  //到达
  const onClickArrive= (e, record) => {
    e.preventDefault()
    Modal.confirm({
      title: '确认车辆到达',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'waybillDetail/arrive',
          payload: record,
        })
      },
    })
  }

  const onClickNoticeSendVehicle = (e, record) => {
    e.preventDefault()
    Modal.confirm({
      title: '确认通知发运',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'waybillDetail/noticeSendVehicle',
          payload: record,
        })
      },
    })
  }
  const editStore = (e, currentItem) => {
    e.preventDefault()
    dispatch({
      type: 'waybillDetail/editStoreModal',
      payload: currentItem,
    })
  }
  const deletePlatOperator = (e, item) => {
    e.preventDefault()
    Modal.confirm({
      title: `确认删除转单车操作人员${item.personName}`,
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'waybillDetail/deletePlatOperator',
          payload: { currentItem, platOperator: item },
        })
      },
    })
  }
  const editCarrierFee = (e) => {
    e.preventDefault()
    dispatch({
      type: 'waybillDetail/showEditCarrierFeeModal',
      payload: currentItem,
    })
  }

  const editClientFee = (e) => {
    e.preventDefault()
    dispatch({
      type: 'waybillDetail/showEditClientFeeModal',
      payload: currentItem,
    })
  }

  const editDriver = () => {
    dispatch({
      type: 'waybillDetail/showEditDriverModal',
      payload: currentItem,
    })
  }
  const editSenderMan = () => {
    dispatch({
      type: 'waybillDetail/showEditSenderManModal',
      payload: currentItem,
    })
  }
  const editPlatOperator = () => {
    dispatch({
      type: 'waybillDetail/editPlatOperatorModal',
      payload: currentItem,
    })
  }
  const clickOnWayInfo = (e, record) => {
    e.preventDefault()
    dispatch({
      type: 'waybillDetail/showOnWayInfoModal',
      payload: record,
    })
  }
  const clickShowPic = (e, record, picType) => {

    e.preventDefault()
    record.picType = picType
    dispatch({
      type: 'waybillDetail/showPicModal',
      payload: record,
    }).then((data) => {
      if (data.length === 0) {
        message.warn('没有图片可查看')
      }
    })
  }
  const onCancel = () => {
    dispatch({
      type: 'waybillDetail/hideModal',
    })
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'passFlag',
      key: 'passFlag',
      fixed: 'left',
      width: 50,
      render: (text, record, index) => {
        return <div>{index + 1}</div>
      },
    }, {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      fixed: 'left',
      width: 150,
      render: (text, record) => {
        return (<Link to={`/vehicle-detail/${record.orderBaseId}/${record.vehicleId}`}>{text}</Link>)
      },
    }, {
      title: '车辆属性',
      dataIndex: 'typeDesc',
      key: 'typeDesc',
      width: 150,
    }, {
      title: '指导价',
      dataIndex: 'carPrice',
      key: 'carPrice',
      width: 150,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '提验车费',
      dataIndex: 'customerCheckPrice',
      key: 'customerCheckPrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '运费',
      dataIndex: 'customerFreightPrice',
      key: 'customerFreightPrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '送店费',
      dataIndex: 'customerStorePrice',
      key: 'customerStorePrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text )}元`
      },
    }, {
      title: '服务费',
      dataIndex: 'customerServicePrice',
      key: 'customerServicePrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '保险费',
      dataIndex: 'customerInsurancePrice',
      key: 'customerInsurancePrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '合计费用',
      dataIndex: 'customerTotalPrice',
      key: 'customerTotalPrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '验车照片',
      dataIndex: '',
      key: 'a',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 1)}>点击查看</a>)
      },
    }, {
      title: '保单照片',
      dataIndex: '',
      key: 'b',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 4)}>点击查看</a>)
      },
    }, {
      title: '在途信息',
      dataIndex: '',
      key: 'c',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickOnWayInfo(e, record)}>点击查看</a>)
      },
    }, {
      title: '交车单',
      dataIndex: '',
      key: 'e',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 6)}>点击查看</a>)
      },
    },/*{
      title: '入物流库交车单',
      dataIndex: '',
      key: 'e',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 7)}>点击查看</a>)
      },
    },*/  {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 100,
      fixed: 'right',
    },
  ]
  const editColumns = [
    {
      title: '序号',
      dataIndex: 'passFlag',
      key: 'passFlag',
      fixed: 'left',
      width: 50,
      render: (text, record, index) => {
        return <div>{index + 1}</div>
      },
    }, {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      fixed: 'left',
      width: 150,
      render: (text, record) => {
        return (<Link to={`/vehicle-detail/${record.orderBaseId}/${record.vehicleId}`}>{text}</Link>)
      },
    }, {
      title: '车辆属性',
      dataIndex: 'typeDesc',
      key: 'typeDesc',
      width: 150,
    }, {
      title: '指导价',
      dataIndex: 'carPrice',
      key: 'carPrice',
      width: 150,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '提验车费',
      dataIndex: 'customerCheckPrice',
      key: 'customerCheckPrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '运费',
      dataIndex: 'customerFreightPrice',
      key: 'customerFreightPrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '送店费',
      dataIndex: 'customerStorePrice',
      key: 'customerStorePrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '服务费',
      dataIndex: 'customerServicePrice',
      key: 'customerServicePrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '保险费',
      dataIndex: 'customerInsurancePrice',
      key: 'customerInsurancePrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '合计费用',
      dataIndex: 'customerTotalPrice',
      key: 'customerTotalPrice',
      width: 100,
      render: (text, record) => {
        return `${ accounting.formatMoney(text) }元`
      },
    }, {
      title: '验车照片',
      dataIndex: '',
      key: 'a',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 1)}>点击查看</a>)
      },
    }, {
      title: '保单照片',
      dataIndex: '',
      key: 'b',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 4)}>点击查看</a>)
      },
    }, {
      title: '在途信息',
      dataIndex: '',
      key: 'c',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickOnWayInfo(e, record)}>点击查看</a>)
      },
    }, {
      title: '交车单',
      dataIndex: '',
      key: 'e',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 6)}>点击查看</a>)
      },
    }, /*{
      title: '入物流库交车单',
      dataIndex: '',
      key: 'e',
      width: 100,
      render: (text, record) => {
        return (<a href="#" onClick={e => clickShowPic(e, record, 7)}>点击查看</a>)
      },
    },*/ {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 100,
      fixed: 'right',
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 250,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div className={styles.operation}>
            {vehicleEdit && <AuthButton child={<Link to={`/vehicle-detail/edit/${record.orderBaseId}/${record.vehicleId}`}>编辑</Link>} resourceId="RES_2_132" />}
            {record.status === 2 && record.passFlag === 1 && currentItem.finaceStatus === 1 ?
              <AuthButton child={<div><Divider type="vertical" /> <a onClick={(e) => { onClickNoticeSendVehicle(e, record) }}>通知发运</a> </div>} resourceId="RES_2_133" /> : null}
            {record.status === 5 && record.riskStatus === 1 ?
              <AuthButton child={<div><Divider type="vertical" /> <a onClick={(e) => { onClickNoticeReleaseVehicle(e, record) }}>通知放车</a></div>} resourceId="RES_2_134" /> : null}
            {record.status === 4 ?
              <AuthButton child={<div><Divider type="vertical" /> <a onClick={(e) => { onClickArrive(e, record) }}>到达</a></div>} resourceId="RES_2_134" /> : null}
          </div>
        )
      },
    },
  ]

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    previewVisible,
    previewImage,
    fileList,
    fileListActiveIndex,
    confirmLoading: loading.effects['waybillDetail/create'],
    title: '运输合同',
    footer:editable?editable:<div><button type="button" onClick={onCancel} class="ant-btn"><span>取 消</span></button></div>,
    wrapClassName: 'vertical-center-modal',
    onUploadChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        dispatch({
          type: 'waybillDetail/updateFileList',
          payload: info.fileList,
        })
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },
    onUploadRemove (file) {
      dispatch({
        type: 'waybillDetail/onUploadRemove',
        payload: file,
      })
    },
    onOk (data) {
      dispatch({
        type: 'waybillDetail/create',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/hideModal',
      })
    },
    handlePreview (file) {
      dispatch({
        type: 'waybillDetail/handlePreview',
        payload: file,
      })
    },
    handleCancelPreview () {
      dispatch({
        type: 'waybillDetail/handleCancelPreview',
      })
    },
    beforeUpload (file) {
      dispatch({
        type: 'waybillDetail/uploadFile',
        payload: file,
      })
    },
    onCloseRequest () {
      dispatch({
        type: 'waybillDetail/closeUploadPicsImgViewer',
      })
    },
    onMovePrevRequest () {
      dispatch({
        type: 'waybillDetail/onMovePrevRequest',
        payload: {
          fileListActiveIndex: (fileListActiveIndex + fileList.length - 1) % fileList.length,
        },
      })
    },
    onMoveNextRequest () {
      dispatch({
        type: 'waybillDetail/onMoveNextRequest',
        payload: {
          fileListActiveIndex: (fileListActiveIndex + 1) % fileList.length,
        },
      })
    },
  }
  const updateModalProps = {
    title: '运输合同',
    item: currentItem,
    visible: updatePicsModalVisible,
    maskClosable: false,
    previewVisible,
    previewImage,
    updateFileList,
    fileListActiveIndex,
    confirmLoading: loading.effects['waybillDetail/updateUpdate'],

    wrapClassName: 'vertical-center-modal',
    onUploadChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        dispatch({
          type: 'waybillDetail/updateUploadFileList',
          payload: { fileList: info.fileList, file: info.file },
        })
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    },

    onUploadRemove (file) {
      dispatch({
        type: 'waybillDetail/onUploadUploadRemove',
        payload: file,
      })
    },
    onOk (data) {
      dispatch({
        type: 'waybillDetail/updateUpdate',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/hideUpdateModal',
      })
    },
    handlePreview (file) {
      dispatch({
        type: 'waybillDetail/handleUpdatePreview',
        payload: file,
      })
    },
    handleCancelPreview () {
      dispatch({
        type: 'waybillDetail/handleCancelPreview',
      })
    },
    beforeUpload (file) {
      dispatch({
        type: 'waybillDetail/uploadFile',
        payload: file,
      })
    },
    onCloseRequest () {
      dispatch({
        type: 'waybillDetail/closeUploadPicsImgViewer',
      })
    },
    onMovePrevRequest (fileList) {
      dispatch({
        type: 'waybillDetail/onMovePrevRequest',
        payload: {
          fileListActiveIndex: (fileListActiveIndex + fileList.length - 1) % fileList.length,
        },
      })
    },
    onMoveNextRequest (fileList) {

      dispatch({
        type: 'waybillDetail/onMoveNextRequest',
        payload: {
          fileListActiveIndex: (fileListActiveIndex + 1) % fileList.length,
        },
      })
    },
  }
  const onWayInfoModalProps = {
    item: onWayInfo,
    visible: onWayInfoModalVisible,
    confirmLoading: loading.effects['waybillDetail/update'],
    title: '在途信息',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'waybillDetail/onWayInfoModalOk',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/onWayInfoModalCancel',
      })
    },
  }
  const editCarrierFeeModalProps = {
    item: currentItem,
    visible: showEditCarrierFeeModalVisible,
    confirmLoading: loading.effects['waybillDetail/updateCarrierPrice'],
    title: '编辑承运商费用信息',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'waybillDetail/updateCarrierPrice',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelEditCarrierFeeModal',
      })
    },
  }
  const editClientFeeModalProps = {
    item: currentItem,
    visible: showEditClientFeeModalVisible,
    confirmLoading: loading.effects['waybillDetail/updateClientPrice'],
    title: '编辑客户费用信息',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'waybillDetail/updateClientPrice',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelEditClientFeeModal',
      })
    },
  }
  const editSenderManModalProps = {
    item: currentItem,
    visible: showEditSenderManModalVisible,
    confirmLoading: loading.effects['waybillDetail/updateSenderMan'],
    title: '编辑提验车联系人信息',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'waybillDetail/updateSenderMan',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelEditSenderManModal',
      })
    },
  }
  const editDriverModalProps = {
    item: currentItem,
    visible: showEditDriverModalVisible,
    confirmLoading: loading.effects['waybillDetail/updateDriver'],
    title: '编辑司机信息',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'waybillDetail/updateDriver',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelEditDriverModal',
      })
    },
  }
  const showEditPlatOperatorModalProps = {
    item: currentItem,
    visible: showEditPlatOperatorModalVisible,
    confirmLoading: loading.effects['waybillDetail/updatePlatOperator'],
    title: '添加转单车操作人',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'waybillDetail/updatePlatOperator',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelPlatOperatorModal',
      })
    },
  }
  const showEditStoreModalProps = {
    item: currentItem,
    storeOptions: storeList.map((d) => {
      return <Select.Option key={d.code}>{d.value}</Select.Option>
    }),
    visible: editStoreModalVisible,
    confirmLoading: loading.effects['waybillDetail/updateStore'],
    title: '选择停放仓库',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      dispatch({
        type: 'waybillDetail/updateStore',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelEditStoreModal',
      })
    },
  }
  const renderBaseInfo = (arrayBaseInfo) => {
    let result = ''
    for (let baseInfo in arrayBaseInfo) {
      result += `客户:	${baseInfo.personName}<br />` +
        `联系人:	${baseInfo.personTel}<br />`
          + `身份证号:	${baseInfo.personId}<br />`
      result += '<br/>'
    }
    return result
  }

  const batchFY = (e) => {
    e.preventDefault()

    if(!vehicleRows || vehicleRows.length === 0){
      message.warning('批量操作请先选择待操作数据')
      return
    }

    Modal.confirm({
      title: '确认批量通知发运',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        let vehicleIds = ''
        vehicleRows.map((item) =>{
          vehicleIds = vehicleIds + item.vehicleId + ','
        })
        dispatch({
          type: 'waybillDetail/noticeSendVehicleBatch',
          payload: {
            vehicleId:vehicleIds,
            orderBaseId:vehicleRows[0].orderBaseId
          },
        }).then((result) => {
          if (result === 200) {
            message.success('操作成功')
          }
        })
      },
    })

  }

  const batchFC = (e) => {
    e.preventDefault()

    if(!vehicleRows || vehicleRows.length === 0){
      message.warning('批量操作请先选择待操作数据')
      return
    }

    Modal.confirm({
      title: '确认批量通知放车',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        let vehicleIds = ''
        vehicleRows.map((item) =>{
          vehicleIds = vehicleIds + item.vehicleId + ','
        })
        dispatch({
          type: 'waybillDetail/noticeReleaseVehicleBatch',
          payload: {
            vehicleId:vehicleIds,
            orderBaseId:vehicleRows[0].orderBaseId
          },
        }).then((result) => {
          if (result === 200) {
            message.success('操作成功')
          }
        })
      },
    })
  }

  const batcOnPassage = (e) => {
    e.preventDefault()

    if(!vehicleRows || vehicleRows.length === 0){
      message.warning('批量操作请先选择待操作数据')
      return
    }

    dispatch({
      type: 'waybillDetail/showAddOnwayInfoModal',
      payload:{
        vehicleRows:vehicleRows,
      }
    })

    /*Modal.confirm({
      title: '确认批量通知放车',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        let vehicleIds = ''
        vehicleRows.map((item) =>{
          vehicleIds = vehicleIds + item.vehicleId + ','
        })
        dispatch({
          type: 'waybillDetail/noticeReleaseVehicleBatch',
          payload: {
            vehicleId:vehicleIds,
            orderBaseId:vehicleRows[0].orderBaseId
          },
        }).then((result) => {
          if (result === 200) {
            message.success('操作成功')
          }
        })
      },
    })*/
  }

  const batchArrive = (e) => {
    e.preventDefault()

    if(!vehicleRows || vehicleRows.length === 0){
      message.warning('批量操作请先选择待操作数据')
      return
    }

    Modal.confirm({
      title: '确认批量到达',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        let vehicleIds = ''
        vehicleRows.map((item) =>{
          vehicleIds = vehicleIds + item.vehicleId + ','
        })
        dispatch({
          type: 'waybillDetail/arriveBatch',
          payload: {
            vehicleId:vehicleIds,
            orderBaseId:vehicleRows[0].orderBaseId
          },
        }).then((result) => {
          if (result === 200) {
            message.success('操作成功')
          }
        })
      },
    })
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    vehicleRows = selectedRows
  }

  const rowSelection = {
      onChange: onSelectChange,
  }

  const addOnWayInfoModalProps = {
    item: currentItem,
    visible: showAddOnwayInfoModalVisible,
    confirmLoading: loading.effects['waybillDetail/addOnWayInfo'],
    title: '批量添加在途信息',
    wrapClassName: 'vertical-center-modal',
    regionResultOption: regionResultList,
    batchVehicleRows,
    onOk (data) {
      data.userCode = 'nocookie'
      data.currentUser = 'nocookie'
      data.provinceCode = data.location[0]
      data.cityCode = data.location[1]
      data.currentItem = currentItem

      dispatch({
        type: 'waybillDetail/addOnWayInfo',
        payload: data,
      }).then((result) => {
        if (result === 200) {
          message.success('操作成功')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'waybillDetail/cancelAddOnwayInfoModal',
      })
    },
    addrLoadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      dispatch({
        type: 'waybillDetail/load2Address',
        payload: targetOption,
      })
    },
    saveSelectedOptionsFunc (payload) {
      dispatch({
        type: 'waybillDetail/saveSelectedOptionsLabel',
        payload,
      })
    },
  }


  return (
    <div style={{ padding: '5px' }}>
      <Row gutter={24} className={{ height: 'auto' }}>
        <Col span={6}>
          <Card title={'运单基本信息'} bordered bodyStyle={{ overflow: 'scroll', height: '400px' }}>
            <p>运单状态：{currentItem.statusName}</p>
            <p>运单编号：{currentItem.waybillNo} </p>
            <p>始发地：{currentItem.startCityName}</p>
            <p>目的地：{currentItem.destinationCityName}</p>
            <p>运输类型：{currentItem.transportTypeName}</p>
            <p>发票状态：{currentItem.needInvoiceName}</p>
            <p>预计发运时间：{currentItem.expectSendtime}</p>
            <p>预计到达时间：{currentItem.expectArriveTime}</p>
            <p>停放仓库：{currentItem.storeName} &nbsp;{editable && currentItem.status === 3 && currentItem.isStore === 0 ?
              <AuthButton child={<a onClick={e => editStore(e, currentItem)}>选择</a>} resourceId="RES_2_131" /> : null}</p>
            <p>调度员备注：{currentItem.controlRemark}</p>
            <p><a href="#" onClick={(e) => { clickTransport(e) }}>运输合同</a> </p>
            <p style={{ fontSize: '20px' }}>订单信息</p>
            <p>订单编号：{currentItem.dmsOrderNo }</p>
            <p>订单时间：{currentItem.orderTime }</p>
            <p>订单类型：{currentItem.waybillTypeName}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title={'客户信息'} bordered bodyStyle={{ overflow: 'scroll', height: '400px' }}>
            <p>客户：{currentItem.customerName}</p>
            <p>联系人：{currentItem.customerlinkMan}</p>
            <p>联系电话：{currentItem.customerlinkTel}</p>

            <p style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignContent: 'space-between',
            }}
            >
            <font-face style={{
              fontSize: '20px',
            }}>客户费用信息</font-face>
            {editable && (currentItem.status === 3 || currentItem.status === 0) &&<AuthButton child={<a onClick={e => { editClientFee(e) }}>编辑</a>} resourceId="RES_2_125" /> }
          </p>
            <p>运费：{accounting.formatMoney(currentItem.customerFreightPrice)} 元</p>
            <p>送店费：{accounting.formatMoney(currentItem.customerStorePrice)} 元</p>
            <p>服务费：{accounting.formatMoney(currentItem.customerServicePrice)} 元</p>
            <p>提验车费：{accounting.formatMoney(currentItem.customerCheckPrice)} 元</p>
            <p>保险费：{accounting.formatMoney(currentItem.customerInsurancePrice)} 元</p>
            <p>税费：{accounting.formatMoney(currentItem.customerTaxation)} 元</p>
            <p>等待费：{accounting.formatMoney(currentItem.customerWaitPrice)} 元</p>
            <p>放空费：{accounting.formatMoney(currentItem.customerEmptyPrice)} 元</p>
            <p>总价：{accounting.formatMoney(currentItem.customerTotalPrice)} 元</p>

            <p style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignContent: 'space-between',
            }}
            > <font-face style={{
              fontSize: '20px',
            }}>提验车联系人</font-face>
              {editable && currentItem.status === 3 && <AuthButton child={<a onClick={e => { editSenderMan(e) }}>编辑</a>} resourceId="RES_2_124" /> }
            </p>

            <p>姓名：{currentItem.customerSenderMan}</p>
            <p>联系电话：{currentItem.customerSenderTel}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title={'承运商信息'} bordered bodyStyle={{ overflow: 'scroll', height: '400px' }}>
            <p>承运商：{currentItem.carrierName}</p>
            <p>联系人：{currentItem.carrierlinkMan}</p>
            <p>联系电话：{currentItem.carrierlinkTel}</p>
            <p style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignContent: 'space-between',
            }}
            > <font-face style={{
              fontSize: '20px',
            }}>承运商费用信息</font-face>
              {editable && currentItem.status === 3 &&<AuthButton child={<a onClick={e => { editCarrierFee(e) }}>编辑</a>} resourceId="RES_2_125" /> }
            </p>

            <p>运费：{accounting.formatMoney(currentItem.carrierFreightPrice)} 元</p>
            <p>送店费：{accounting.formatMoney(currentItem.carrierStorePrice)} 元</p>
            <p>等待费：{accounting.formatMoney(currentItem.carrierWaitPrice)} 元</p>
            <p>放空费：{accounting.formatMoney(currentItem.carrierEmptyPrice)} 元</p>
            <p>提验车费：{accounting.formatMoney(currentItem.carrierCheckPrice)} 元</p>
            <p>保险费：{accounting.formatMoney(currentItem.carrierInsurancePrice)} 元</p>
            <p>税费：{accounting.formatMoney(currentItem.carrierTaxation)} 元</p>
            <p>总价：{accounting.formatMoney(currentItem.carrierTotalPrice)} 元</p>
          </Card>
        </Col>
        <Col span={6} >
          <Card title={'操作信息'} bordered bodyStyle={{ overflow: 'scroll', height: '400px' }}>
            <p style={{ fontSize: '20px' }}>收车人</p>
            <List dataSource={currentItem.customerPicker}
              renderItem={item => (
                <List.Item key={item.idcard} style={{ lineHeight: '32px',    marginTop: "-26px" }}>
                  姓名：{item.personName}   <br />
                  收车人电话：{item.personTel}   <br />
                  身份证号：{item.idcard} <br />
                </List.Item>
                    )}
            />

            <p style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignContent: 'space-between',
            }}
            > <font-face style={{
              fontSize: '20px',
            }}>转单车操作人</font-face>
              {editable && currentItem.status === 3 && <AuthButton child={<a onClick={e => { editPlatOperator(e) }}>添加</a>} resourceId="RES_2_127" /> }
            </p>

            <List dataSource={currentItem.platOperator}
              renderItem={item => (
                <List.Item key={item.idcard}  style={{ lineHeight: '32px',    marginTop: "-12px" }}
                  actions={[editable && currentItem.status === 3 ?
                    <AuthButton child={<a onClick={(e) => { deletePlatOperator(e, item) }}>删除</a>} resourceId="RES_2_128" /> : null]}
                >
                  姓名：{item.personName}  <br />
                        联系电话：{item.personTel}  <br />
                        身份证号：{item.idcard}
                </List.Item>
                    )}
            />

            <p style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignContent: 'space-between',
            }}
            > <font-face style={{
              fontSize: '20px',
            }}>司机</font-face>
              {editable && currentItem.status === 3 && <AuthButton child={<a onClick={e => { editDriver(e) }}>编辑</a>} resourceId="RES_2_126" /> }
            </p>

            <p>姓名：{currentItem.carrierDriverName} </p>
            <p> 联系电话：{currentItem.carrierDriverTel}</p>
            <p>身份证号：{currentItem.carrierDriverIdcard}</p>

          </Card>
        </Col>

      </Row>

      <Row gutter={24}  style={{paddingLeft:0,paddingTop:10}}>
        <Col span={24} >
          <Card title="车辆信息" bordered={false}>
            <List
              bordered={false}
              dataSource={currentItem.vehicleDescList}
              renderItem={item => (<List.Item>{item}</List.Item>)}
            />
          </Card>
        </Col>

      </Row>
      <Row gutter={24}  style={{paddingTop:10}}>
        <Col span={24} >
          <Card title="车辆详情" bordered={false}
                extra={editable && [
                  <a href="#" onClick={e => batchFY(e)} className="margin-right">批量通知发运</a>,
                  <a href="#" onClick={e => batcOnPassage(e)} className="margin-right" >批量编辑在途信息</a>,
                  <a href="#" onClick={e => batchArrive(e)} className="margin-right">批量到达</a>,
                  <a href="#" onClick={e => batchFC(e)} >批量通知放车</a>,
                  ]
                } >
            <Table bordered rowSelection={rowSelection }
              pagination={false}
              itemLayout="horizontal"
              dataSource={currentItem.vehicleInfo}
              scroll={editable ?{ x: 1910,}:{ x: 1660,}}
              columns={editable ? editColumns : columns}
            />
          </Card>
        </Col>
      </Row>
      {modalVisible && <SelfModal {...modalProps} />}
      {updatePicsModalVisible && <UpdateModal {...updateModalProps} />}
      {onWayInfoModalVisible && <ShowOnWayInfoModal {...onWayInfoModalProps} />}
      {showEditCarrierFeeModalVisible && <EditCarrierFeeModal {...editCarrierFeeModalProps} />}
      {showEditClientFeeModalVisible && <EditClientFeeModal {...editClientFeeModalProps} />}
      {showEditSenderManModalVisible && <EditSenderManModal {...editSenderManModalProps} />}
      {showEditDriverModalVisible && <EditDriverModal {...editDriverModalProps} />}
      {showEditPlatOperatorModalVisible && <EditPlatOperatorModal {...showEditPlatOperatorModalProps} />}
      {editStoreModalVisible && <EditStoreModal {...showEditStoreModalProps} />}

      {showAddOnwayInfoModalVisible && <OnWayInfoModal {...addOnWayInfoModalProps} />}
      {picsModalVisible && <Lightbox
        mainSrc={pics[activeIndex].ossPictureUrl}
        mainSrcThumbnail={pics[activeIndex].ossThumbnailUrl}
        imageTitle={pics[activeIndex].desc}
        nextSrc={pics[(activeIndex + 1) % pics.length].ossPictureUrl}
        nextSrcThumbnail={pics[(activeIndex + 1) % pics.length].ossThumbnailUrl}
        prevSrc={pics[(activeIndex + pics.length - 1) % pics.length].ossPictureUrl}
        prevSrcThumbnail={pics[(activeIndex + pics.length - 1) % pics.length].ossThumbnailUrl}
        enableZoom={false}
        nextLabel="下一张"
        prevLabel="上一张"
        onCloseRequest={() => {
          dispatch({
            type: 'waybillDetail/closePicsImgViewer',
          })
        }}
        onMovePrevRequest={() => {
          dispatch({
            type: 'waybillDetail/updatePicsActiveIndex',
            payload: {
              activeIndex: (activeIndex + pics.length - 1) % pics.length,
            },
          })
        }
        }
        onMoveNextRequest={() => {
          dispatch({
            type: 'waybillDetail/updatePicsActiveIndex',
            payload: {
              activeIndex: (activeIndex + 1) % pics.length,
            },
          })
        }
        }
      />}
    </div>)
}

WaybillManageDetail.propTypes = {
  waybillDetail: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ waybillDetail, loading }) => ({ waybillDetail, loading }))(WaybillManageDetail)
