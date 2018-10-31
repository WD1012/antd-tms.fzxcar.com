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
  addrOptions,
  addrLoadData,
  carrierList,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      const destinationCityCode = data.destination[1];
      const destinationProvinceCode = data.destination[0];
      const startPlaceCityCode = data.origin[1];
      const startPlaceProvinceCode = data.origin[0];
      const destinationCity = map.get(destinationCityCode)
      const destinationProvince = map.get(destinationProvinceCode)
      const startPlaceCity = map.get(startPlaceCityCode)
      const startPlaceProvince = map.get(startPlaceProvinceCode)

      const m = {
        "price":data.freightRrates,
        "status":data.status,
        "createUser":"admin",
        "destinationCityCode":destinationCityCode,
        "destinationProvinceCode":destinationProvinceCode,
        "startPlaceCityCode":startPlaceCityCode,
        "startPlaceProvinceCode":startPlaceProvinceCode,
        "destinationCity":destinationCity,
        "destinationProvince":destinationProvince,
        "startPlaceCity":startPlaceCity,
        "startPlaceProvince":startPlaceProvince,
        "carrierId":data.carrier,
      }

      onOk(m)
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
    selectedOptions.map((item) => {
      map.set(item.value,item.label)
    })

  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="起始地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('origin',
            {
              rules: [
                {
                  required: true,
                  validator: validatorAddr,
                },
              ],
            }
          )(<Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            onChange={onChange}
            placeholder="选择起始地"
          />)}
        </FormItem>

        <FormItem label="目的地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('destination',
            {
              rules: [
                {
                  required: true,
                  validator: validatorAddr,
                },
              ],
            }
          )(<Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            onChange={onChange}
            placeholder="选择目的地"
          />)}
        </FormItem>
        <FormItem label="承运商" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('carrier', {

            rules: [
              {
                required: true,
                message: '承运商必选',
              },
            ],
          })(<Select placeholder="选择承运商">
            { carrierList.map(json => (<Option key={json.id}> {json.label} </Option>))}
          </Select>)}
        </FormItem>
        <FormItem label="运价" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('freightRrates', {
            rules: [
              {
                required: true,
                type: 'number',
                message: '运价必填，且为整数',
              },
            ],
          })(<InputNumber min={1} max={9999999} precision={0}/>)}元
        </FormItem>
        <FormItem label="状态" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('status', {
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
  addrOptions: PropTypes.array,
  addrLoadData: PropTypes.func,
  carrierList: PropTypes.array,
}

export default Form.create()(modal)
