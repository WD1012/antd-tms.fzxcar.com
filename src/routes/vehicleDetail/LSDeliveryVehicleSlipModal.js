import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Upload, Icon,message, Modal, Cascader } from 'antd'
import Lightbox from 'react-image-lightbox'
import city from '../../utils/city'
import { api } from '../../utils/config'
import { Select } from 'antd';
const Option = Select.Option;
//入物流库交车单
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
  onUploadChange,
 lsDeliveryVehicleSlipFileList,handlePreview,preViewLsDeliveryVisible,preViewLsDeliveryUrl,handleCancel,
  onUploadRemove,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };


  const handleOk = () => {
    validateFields((errors) => {
      //
      console.log(errors)
      if (errors) {
        return
      }

      const fields = {
        ...getFieldsValue(),
      }

      const data = {
        orderBaseId:item.orderBaseId,
        pictureType:7,
        vehicleId:item.vehicleId,
        idcard:fields.pickerInfo?fields.pickerInfo:'',
      }
      onOk(data)

    })
  }

  const preview = (file) => {
    handlePreview( file.response?file.response.data.url:file.url,)
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const fileList = lsDeliveryVehicleSlipFileList.fileList?lsDeliveryVehicleSlipFileList.fileList:[]
  fileList.map((file) => {
    console.log(file)
  })
  let disabled = false,onRemove = true

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">

        <FormItem label="交车单" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fileList', {
            rules: [
              {
                required: true,
                message: '照片必传',
              },
            ],
          })(<Upload
            action={uploadUrl}
            onPreview={preview}
            defaultFileList={fileList.map((file) => {
              console.log(file.response)
              return {
                uid: file.response?file.response.data.pictureId:file.key,
                name: file.response?file.response.data.ossPictureId:file.uid,
                status: 'done',
                url: file.response?file.response.data.url:file.url,
                }
            })}
            listType="picture-card"
            multiple
            onChange={onUploadChange}

            disabled={disabled}//控制是否允许上传
            onRemove={onUploadRemove}//控制是否允许移除
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          </Upload>)}

          <Modal width={1000} visible={preViewLsDeliveryVisible} footer={null} onCancel={handleCancel}>
            <img style={{ width: '100%' }} src={preViewLsDeliveryUrl} />
          </Modal>

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
  onUploadChange: PropTypes.func,
  onUploadRemove:PropTypes.func,
  lsDeliveryVehicleSlipFileList:PropTypes.object,
  handlePreview:PropTypes.func,
  preViewLsDeliveryViible:PropTypes.bool,
  preViewLsDeliveryUrl:PropTypes.string,
  handleCancel:PropTypes.func,


}

export default Form.create()(modal)
