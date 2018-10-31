import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, InputNumber, Upload, Modal, Icon } from 'antd'
import _map from 'lodash/map'
import { api } from '../../utils/config'

const { uploadUrl } = api
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}

const modal = ({
  item = {},
  onOk,
                 mileagePicFileList,//里程
                 vinPicFileList,//车架号
                 f45PicFileList,//前45度
                 b45PicFileList,//后45度
                 fInsidePicFileList,//内饰(前)
                 bInsidePicFileList,//内饰（后）
                 rightPicFileList,//右侧
                 enginePicFileList,//发动机

                 onMileagePicFileRemove,
                 onmileagePicFileChange,
                 onvinPicFileChange,
                 onVinPicFileRemove,

                 onf45PicFileChange,
                 onF45PicFileRemove,

                 onb45PicFileChange,
                 onB45PicFileRemove,

                 onfInsideFileChange,
                 onFInsideFileRemove,

                 onbInsideFileChange,
                 onBInsideFileRemove,

                 onrightFileChange,
                 onRightFileRemove,

                 onengineFileChange,
                 onEngineFileRemove,

                 controlDisplay,

  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        orderBaseId:item.orderBaseId,
        pictureType:1,
        vehicleId:item.vehicleId,
        newVehicle:item.newVehicle
      }

      /*orderBaseId (integer): 运单id ,
        pictureType (integer): 图片类型id ,
        vehicleId (integer): 车辆id*/
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  let mileagePicUploadButtonUrl
  let vinPicUploadButtonUrl
  let onUploadId
  const uploadButton = (text) =>{
    return <div>
    <Icon type={'plus'} />
    <div className="ant-upload-text">{text}</div>
  </div>
  }

  const mileagePicUploadButton = (
    <FormItem label="里程"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('mileagePic')(<Upload
        onChange={onmileagePicFileChange}
        action={uploadUrl}
        fileList={mileagePicFileList}
        onRemove={onMileagePicFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {mileagePicFileList && mileagePicFileList.length > 0 ? '': uploadButton('里程')}
      </Upload>)}
    </FormItem>
  )

  const vinPicUploadButton = (
    <FormItem label="车架号"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('vinPic')(<Upload
        onChange={onvinPicFileChange}
        action={uploadUrl}
        fileList={vinPicFileList}
        onRemove={onVinPicFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {vinPicFileList && vinPicFileList.length > 0 ? '': uploadButton('车架号')}
      </Upload>)}
    </FormItem>
  )

  const f45PicUploadButton = (
    <FormItem label="前45度"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('f45Pic')(<Upload
        onChange={onf45PicFileChange}
        action={uploadUrl}
        fileList={f45PicFileList}
        onRemove={onF45PicFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {f45PicFileList && f45PicFileList.length > 0 ? '': uploadButton('前45度')}
      </Upload>)}
    </FormItem>
  )

  const b45PicUploadButton = (
    <FormItem label="后45度"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('b45Pic')(<Upload
        onChange={onb45PicFileChange}
        action={uploadUrl}
        fileList={b45PicFileList}
        onRemove={onB45PicFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {b45PicFileList && b45PicFileList.length > 0 ? '': uploadButton('后45度')}
      </Upload>)}
    </FormItem>
  )

  const fInsidePicUploadButton = (
    <FormItem label="内饰（前）"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('fInside')(<Upload
        onChange={onfInsideFileChange}
        action={uploadUrl}
        fileList={fInsidePicFileList}
        onRemove={onFInsideFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {fInsidePicFileList && fInsidePicFileList.length > 0 ? '': uploadButton('内饰（前）')}
      </Upload>)}
    </FormItem>
  )

  const bInsidePicUploadButton = (
    <FormItem label="内饰（后）"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('bInside')(<Upload
        onChange={onbInsideFileChange}
        action={uploadUrl}
        fileList={bInsidePicFileList}
        onRemove={onBInsideFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {bInsidePicFileList && bInsidePicFileList.length > 0 ? '': uploadButton('内饰（后）')}
      </Upload>)}
    </FormItem>
  )

  const rightPicUploadButton = (
    <FormItem label="右侧"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('rightPic')(<Upload
        onChange={onrightFileChange}
        action={uploadUrl}
        fileList={rightPicFileList}
        onRemove={onRightFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {rightPicFileList && rightPicFileList.length > 0 ? '': uploadButton('右侧')}
      </Upload>)}
    </FormItem>
  )

  const enginePicUploadButton = (
    <FormItem label="发动机"  hasFeedback {...formItemLayout}>
      {getFieldDecorator('enginePic')(<Upload
        onChange={onengineFileChange}
        action={uploadUrl}
        fileList={enginePicFileList}
        onRemove={onEngineFileRemove}
        accept="jpg"
        listType="picture-card"
        multiple={false}
      >
        {enginePicFileList && enginePicFileList.length > 0 ? '': uploadButton('发动机')}
      </Upload>)}
    </FormItem>
  )


  return (
    <Modal {...modalOpts}>
      <Form layout="inline">
        <Row  gutter={24} align={"middle"}>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preMileagePicCondition && mileagePicUploadButton}
          </Col>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preVinPicCondition && vinPicUploadButton}
          </Col>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preF45PicCondition && f45PicUploadButton}
          </Col>
        </Row>

        <Row  gutter={24} align={"middle"}>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preB45PicCondition && b45PicUploadButton}
          </Col>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preFInsidePicCondition && fInsidePicUploadButton}
          </Col>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preBInsidePicCondition && bInsidePicUploadButton}
          </Col>
        </Row>


        <Row  gutter={24} align={"middle"}>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preRightPicCondition && rightPicUploadButton}
          </Col>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >
            {controlDisplay.preEnginePicCondition && enginePicUploadButton}
          </Col>
          <Col xs={{span: 8}}
               sm={{span: 8}}
               xl={{ span: 8 }}
               md={{ span: 8 }}
          >

          </Col>
        </Row>







      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  mileagePicFileList:PropTypes.array,
  vinPicFileList:PropTypes.array,//车架号
  f45PicFileList:PropTypes.array,//前45度
  b45PicFileList:PropTypes.array,//后45度
  fInsidePicFileList:PropTypes.array,//内饰(前)
  bInsidePicFileList:PropTypes.array,//内饰（后）
  rightPicFileList:PropTypes.array,//右侧
  enginePicFileList:PropTypes.array,//发动机

  onMileagePicFileRemove: PropTypes.func,
  onmileagePicFileChange:PropTypes.func,

  onvinPicFileChange: PropTypes.func,
  onVinPicFileRemove:PropTypes.func,

  onf45PicFileChange: PropTypes.func,
  onF45PicFileRemove:PropTypes.func,

  onb45PicFileChange: PropTypes.func,
  onB45PicFileRemove:PropTypes.func,

  onfInsideFileChange: PropTypes.func,
  onFInsideFileRemove:PropTypes.func,

  onbInsideFileChange: PropTypes.func,
  onBInsideFileRemove:PropTypes.func,

  onrightFileChange: PropTypes.func,
  onRightFileRemove:PropTypes.func,

  onengineFileChange: PropTypes.func,
  onEngineFileRemove:PropTypes.func,

  controlDisplay:PropTypes.object,
}

export default Form.create()(modal)
