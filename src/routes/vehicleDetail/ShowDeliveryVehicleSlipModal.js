import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Upload, Icon,message, Modal, Cascader } from 'antd'
import Lightbox from 'react-image-lightbox'
import city from '../../utils/city'
import { api } from '../../utils/config'
import { Select } from 'antd';
const Option = Select.Option;
//交车单
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
  deliveryVehicleSlipFileList,
  onUploadRemove,
  pickerInfo,
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


  const validatorpickerInfo = (rule, value, callback) => {

    if (pickerInfo && pickerInfo.length > 0) {
      if (!value || value.length <= 0) {
        callback('提车人必选')
      }
      callback()
    } else {
      callback()
    }
  }

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
        pictureType:6,
        vehicleId:item.vehicleId,
        idcard:fields.pickerInfo?fields.pickerInfo:'',
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
  const fileList = deliveryVehicleSlipFileList.fileList?deliveryVehicleSlipFileList.fileList:[]

  let disabled = false,onRemove = true
  /*if(item.status === 4 || item.status === 5){
    disabled = true
    onRemove = false
  }*/

  const pickerInfos = (<FormItem label="提车人" hasFeedback {...formItemLayout}>
    {getFieldDecorator('pickerInfo', {
      rules: [
        {
          required: true,
          validator: validatorpickerInfo,
        },
      ],
    })(
      <Select
        showSearch
        placeholder="选择提车人"
        optionFilterProp="children"
        dropdownMatchSelectWidth={false}
      >
        {
          pickerInfo.map((item) =>{
            return  <Select.Option key={item.idCard}>{item.name} {item.idCard} {item.phone}</Select.Option>
          })
        }
      </Select>

    )}
  </FormItem>)

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">

        {pickerInfo && pickerInfo.length > 0 && pickerInfos}

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
  deliveryVehicleSlipFileList:PropTypes.object,
  pickerInfo:PropTypes.array,

}

export default Form.create()(modal)
