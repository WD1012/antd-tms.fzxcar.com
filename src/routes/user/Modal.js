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

  const {roles} = modalProps

  const map = new Map();

  roles.map((item) =>{
    map.set(item.id,item.roleName)
  })

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      const roleName = map.get(parseInt(data.roleId))
      data.roleName = roleName
      data.createUser = 'admin'
      onOk(data)
    })
  }

  const validatorName = (rule, value, callback) => {

    let ch = true
    let en = true

    const _ch = /^[\u4E00-\u9FA5]{2,32}$/;

    if(value){
      if(!_ch.test(value)){
        ch = false
      }

      const _en = /^[a-zA-Z]{1,64}$/;
      if(!_en.test(value)){
        en = false
      }

      if(!(ch || en)){
        callback('姓名必须由全汉字或全英文组成')
      }

      callback()
    } else {
      callback('姓名不能为空')
    }
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="手机号" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('username', {
            rules: [
              {
                pattern: /^1[34578]\d{9}$/,
                message: '输入合法手机号',
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="姓名" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('realName', {
            rules: [
              {
                required: true,
                validator: validatorName,
              },
            ],
          })(<Input maxLength={'64'}/>)}
        </FormItem>

        <FormItem label="角色" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('roleId', {
            rules: [
              {
                required: true,
                message: '角色必选',
              },
            ],
          })(<Select placeholder="选择角色">
            { roles.map(json => (<Option key={json.id}> {json.roleName} </Option>))}
          </Select>)}
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
