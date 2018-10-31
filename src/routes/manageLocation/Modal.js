import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Select } from 'antd'
import city from '../../utils/city'

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
  provinceListOption,
  accountListOption,
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
      data.createUser = 'nocookie'
      data.provinceName = data.provinceNames.map(item => ({ provinceCode: item.key, provinceName: item.label.join('') }))
      data.userName = data.userNames.map(item => ({ uuid: item.key, account: item.label.join('') }))
      data.status=0
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
        <FormItem label="大区名称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('regionName', {
            rules: [
              {
                required: true,
                message: '大区名称不能为空',
              },
            ],
          })(<Input placeholder="大区名称" />)}
        </FormItem>
        <FormItem label="省份" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('provinceNames', {
            rules: [
              {
                required: true,
                message: '省份不能为空',
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择省份"
            labelInValue
            allowClear
          >{provinceListOption}</Select>)}
        </FormItem>
        <FormItem label="负责人" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('userNames', {
            rules: [
              {
                required: true,
                message: '负责人不能为空',
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择负责人"
            labelInValue
            allowClear
          >{accountListOption}</Select>)}
        </FormItem>
        <FormItem label="备注" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('remark', {
            rules: [
              {
                required: true,
                message: '备注不能为空或备注超长',
                max: 200,
              },
            ],
          })(<Input placeholder="请输入备注" />)}
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
  provinceListOption: PropTypes.array,
  accountListOption: PropTypes.array,
}

export default Form.create()(modal)
