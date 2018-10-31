import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal,Select, } from 'antd'
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
        <FormItem label="运单类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('waybillType', {
            initialValue: item.waybillType,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select placeholder="选择运单类型" disabled>
           <Option key="1">一车订单融资运单</Option>
            <Option key="2">一车普通运单</Option>
          </Select>)}
        </FormItem>

        <FormItem label="服务费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('singleServicePrice', {
            initialValue: Number(item.singleServicePrice),
            rules: [
              {
                required: true,
                type: 'number',
                message: '服务费必须有数字',
              },
            ],
          })(<InputNumber /> )}元/台
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
