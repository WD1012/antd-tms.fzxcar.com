import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import { Select } from 'antd'

const Option = Select.Option
const FormItem = Form.Item
const RadioButton = Radio.Button

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const map = new Map();

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps,
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      const m = {
        "price":data.freightRrates,
        "status":data.status,
        "createUser":"admin",
        "destinationCityCode":item.destinationCityCode,
        "destinationProvinceCode":item.destinationProvinceCode,
        "startPlaceCityCode":item.startPlaceCityCode,
        "startPlaceProvinceCode":item.startPlaceProvinceCode,
        "destinationCity":item.destinationCity,
        "destinationProvince":item.destinationProvince,
        "startPlaceCity":item.startPlaceCity,
        "startPlaceProvince":item.startPlaceProvince,
        "carrierId":item.carrierId,
      }

      onOk(item.id,m)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const validatorAddr = (rule, value, callback) => {

    if (value) {
      if (value.length != 2) {
        callback('必须选择到市级地址')
      }
      callback()
    } else {
      callback('必须选择到市级地址')
    }
  }

  const onChange = (value, selectedOptions) =>{
    console.log(value)
    selectedOptions.map((item) => {
      map.set(item.value,item.label)
    })

  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="起始地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.startPlaceProvince + "/" + item.startPlaceCity}
        </FormItem>

        <FormItem label="目的地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.destinationProvince + "/" + item.destinationCity}
        </FormItem>
        <FormItem label="承运商" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.carrierName}
        </FormItem>
        <FormItem label="运价" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('freightRrates', {
            initialValue: item.price,
            rules: [
              {
                required: true,
                type: 'number',
                message: '状态必填，且为数字',
              },
            ],
          })(<InputNumber min={1} max={9999999} precision={0}/>)}元
        </FormItem>
        <FormItem label="状态" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('status', {
            initialValue: item.status,
            rules: [
              {
                required: true,
                message: '状态必选项',
              },
            ],
          })(<Radio.Group>
            <RadioButton value={0} checked>开启</RadioButton >
            <RadioButton value={1}>暂停</RadioButton >
          </Radio.Group>)}
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
}

export default Form.create()(modal)
