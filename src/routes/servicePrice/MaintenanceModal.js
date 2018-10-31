import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal,Select,Button, } from 'antd'
import { message } from 'antd';
import AuthButton from "../../components/AuthButton/AuthButton";
const Option = Select.Option
const FormItem = Form.Item

let isDisabled = false;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  servicePriceList,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getDeclaredFields,

  },
}) => {

  let from = servicePriceList.map(item => (
    <FormItem key={item.id} label={item.orderTypeName} hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
      {getFieldDecorator(''+item.id, {
        initialValue: item.servicePrice,
        rules: [
          {
            required: true,
            type: 'number',
            message: '货币最小单位0',
          },
        ],
      })(<InputNumber min={0} max={100000} precision={2}/> )}元/台
    </FormItem>))

  const handleOk = (e) => {

    if(isDisabled){
      message.error('请勿频繁提交')
      return
    }

    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      const d = servicePriceList.map(item => {
          const m = {"id":item.id, "price":data[item.id],}
          return m
        }
      )

      isDisabled = true;
      onOk(d,'admin')

      setTimeout(function () {
        isDisabled = false;
      }, 3000);

    })
  }

  return (
      <Form layout="horizontal">
        {from}
        <AuthButton child={ <Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }}  onClick={e => handleOk( e)}>保存</Button>} resourceId={'RES_2_152'} />

      </Form>

  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  servicePriceList:PropTypes.array,
}

export default Form.create()(modal)
