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

  const validatorPass = (rule, value, callback) => {

    const p = /^[a-zA-Z0-9]{6,16}$/;
    if (value) {
      if (!value.match(p)) {
        callback('密码由 6 ~ 16 位数字或字母组成')
      }
      callback()
    } else {
      callback('密码不能为空')
    }
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                validator: validatorPass,
              },
            ],
          })(<Input/>)}
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
