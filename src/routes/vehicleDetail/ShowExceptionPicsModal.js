import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Upload, Icon,message, Modal, Cascader } from 'antd'
import Lightbox from 'react-image-lightbox'
import city from '../../utils/city'
import { api } from '../../utils/config'

//异常照片
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
  exceptionPicsFileList,
  onUploadRemove,
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
        pictureType:5,
        vehicleId:item.vehicleId,
      }
      onOk(data)
     /* if(item.status === 4 || item.status === 5){
        const mes = item.status === 4?'运单已完成':'运单已失效'
        message.warn(mes+'，数据不允许修改！')
      }else{
        onOk(data)
      }*/
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const fileList = exceptionPicsFileList.fileList?exceptionPicsFileList.fileList:[]

  let disabled = false,onRemove = true
  /*if(item.status === 4 || item.status === 5){
    disabled = true
    onRemove = false
  }*/

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="异常照片" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fileList', {
            rules: [
              {
                required: true,
                message: '照片必传',
              },
            ],
          })(<Upload
            action={uploadUrl}
            defaultFileList={fileList.map((file) => {
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
  exceptionPicsFileList:PropTypes.object,

}

export default Form.create()(modal)
