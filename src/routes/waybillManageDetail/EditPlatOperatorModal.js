import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import city from '../../utils/city'
import { Select } from 'antd'

const Option = Select.Option
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
      data.waybillNo = item.orderBaseId
      data.orderBaseId = item.orderBaseId
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
        <FormItem label="姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('personName', {
            rules: [
              {
                message: '输入姓名',
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="联系电话" hasFeedback {...formItemLayout}>
          {getFieldDecorator('personTel', {
            rules: [
              {
                pattern: /^1[34578]\d{9}$/,
                message: '输入合法联系方式',
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="身份证号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('idcard', {
            rules: [
              {
                pattern: '/(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)/',
                message: '输入合法身份证号',
                required: true,
              },
            ],
          })(<Input />)}
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
