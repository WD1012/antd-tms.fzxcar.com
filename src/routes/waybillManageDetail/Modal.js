import React from 'react'
import PropTypes from 'prop-types'
import Gallery from 'react-grid-gallery'
import { Form, Input, Upload, Icon, Modal, List, Card } from 'antd'
import Lightbox from 'react-image-lightbox'
import city from '../../utils/city'
import { api } from '../../utils/config'

const { uploadUrl } = api
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  beforeUpload,
  onUploadChange,
  previewVisible,
  handleCancelPreview,
  handlePreview,
  editable,
  onCloseRequest,
  onMovePrevRequest,
  onMoveNextRequest,
  previewImage,
  fileList,
  fileListActiveIndex,
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
        ...getFieldsValue(),
        key: item.key,
      }
      console.log(data)

      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="调度员备注" hasFeedback {...formItemLayout}>
          {getFieldDecorator('controlRemark', {
            initialValue: item.controlRemark,
          })(<Input disabled />)}
        </FormItem>
        {editable && <FormItem label="运输合同" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fileList', {})(<Upload
            action={uploadUrl}
            listType="picture-card"
            multiple
            onPreview={handlePreview}
            onChange={onUploadChange}
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          </Upload>)}
        </FormItem>}
        <FormItem label="运输合同" hasFeedback {...formItemLayout}>
          <Gallery images={fileList.map((fi) => {
 return {
          src: fi.ossPictureUrl,
          thumbnail: fi.ossPictureUrl,
          thumbnailWidth: 120,
          thumbnailHeight: 100,
        }
})}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  beforeUpload: PropTypes.func,
  onUploadChange: PropTypes.func,
  handleCancelPreview: PropTypes.func,
  handlePreview: PropTypes.func,
  onCloseRequest: PropTypes.func,
  onMovePrevRequest: PropTypes.func,
  onMoveNextRequest: PropTypes.func,
  previewVisible: PropTypes.bool,
  editable: PropTypes.bool,
  previewImage: PropTypes.string,
  fileList: PropTypes.array,
  fileListActiveIndex: PropTypes.number,
}

export default Form.create()(modal)
