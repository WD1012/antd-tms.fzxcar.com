import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, InputNumber, Select, Modal, Cascader } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item
const map = new Map();
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
  statusOptions,
  selectStartAddressLabel,
  selectEndAddressLabel,
  startAddressLabel,
  endAddressLabel,
  addrOptions,
  addrLoadData,
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
      }

      console.log(data)
      const destinationCityCode = data.destination[1];
      const destinationProvinceCode = data.destination[0];
      const startPlaceCityCode = data.origin[1];
      const startPlaceProvinceCode = data.origin[0];
      const destinationCity = map.get(destinationCityCode)
      const destinationProvince = map.get(destinationProvinceCode)
      const startPlaceCity = map.get(startPlaceCityCode)
      const startPlaceProvince = map.get(startPlaceProvinceCode)

      const m = {
        "fixedRate":data.fixedRate,
        "createUser":"admin",
        "status":data.status,
        "startProvinceCode":startPlaceProvinceCode,
        "startProvince":startPlaceProvince,
        "startCityCode":startPlaceCityCode,
        "startCity":startPlaceCity,
        "destinationProvinceCode":destinationProvinceCode,
        "destinationProvince":destinationProvince,
        "destinationCityCode":destinationCityCode,
        "destinationCity":destinationCity,
        "transportTypeId":data.transportTypes,
        "priorityLevel":data.priorityLevel,
      }
      if(data.destination[2]){
        m.destinationRegionCode  = data.destination[2]
        m.destinationRegion = map.get(m.destinationRegionCode)
      }

      if(data.origin[2]){
        m.startRegionCode  = data.origin[2]
        m.startRegion = map.get(m.startRegionCode)
      }

      onOk(m)
    })
  }

  const onChange = (value, selectedOptions) =>{
    selectedOptions.map((item) => {
      map.set(item.value,item.label)
    })

  }

  const validatorAddr = (rule, value, callback) => {

    if (value) {
      if (value.length < 2) {
        callback('必须选择到市级或区级地址')
      }
      callback()
    } else {
      callback('必须选择到市级或区级地址')
    }
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const children = [];
  children.push(<Select.Option key={1}>{'大板'}</Select.Option>);
  children.push(<Select.Option key={2}>{'救援'}</Select.Option>);
  children.push(<Select.Option key={3}>{'代驾'}</Select.Option>);


  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="起始地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('origin', {

            rules: [
              {
                required: true,
                validator: validatorAddr,
              },
            ],
          })(<Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            onChange={onChange}
            placeholder="选择起始地"
          />)}
        </FormItem>
        <FormItem label="目的地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('destination', {
            rules: [
              {
                required: true,
                validator: validatorAddr,
              },
            ],
          })(<Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            onChange={onChange}
            placeholder="选择目的地"

          />)}
        </FormItem>
        <FormItem label="运输类型" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('transportTypes', {
            rules: [
              {
                required: true,
                message: '运输类型不能为空',
              },
            ],
          })(<Select>
            {children}
          </Select>)}
        </FormItem>
        <FormItem label="运价" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('fixedRate', {
            rules: [
              {
                required: true,
                type: 'number',
              message: '运价必填，且为整数',
          },
            ],
          })(<InputNumber min={0} max={99999999} precision={0} />)}元
        </FormItem>
        <FormItem label="状态" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('status', {
            rules: [
              {
                required: true,
                message: '状态必选',
              },
            ],
          })(<Select>{statusOptions}</Select>)}
        </FormItem>
      </Form>

      <FormItem label="优先级" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
        {getFieldDecorator('priorityLevel', {
          rules: [
            {
              required: true,
              type: 'number',
              message: '优先级不能为空且为0-100有效数字',
            },
          ],
        })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0-100有效数字,0 代表最高优先级"/>)}
      </FormItem>

    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  statusOptions: PropTypes.array,
  startAddressLabel: PropTypes.array,
  endAddressLabel: PropTypes.array,
  onOk: PropTypes.func,
  selectStartAddressLabel: PropTypes.func,
  selectEndAddressLabel: PropTypes.func,
  addrOptions: PropTypes.array,
  addrLoadData: PropTypes.func,
}

export default Form.create()(modal)
