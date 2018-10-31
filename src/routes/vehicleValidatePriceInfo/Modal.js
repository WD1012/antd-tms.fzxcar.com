import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal,Select,Button, } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
import { message } from 'antd';
import AuthButton from "../../components/AuthButton/AuthButton";
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
                 vehicleValidatePriceInfoList,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getDeclaredFields,

  },
}) => {

  let from = vehicleValidatePriceInfoList.map(item => (
    <FormItem  key={item.id} label={item.priceName} hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
      {getFieldDecorator(''+item.id, {
        initialValue: item.price,
        rules: [
          {
            required: true,
            type: 'number',
            message: '货币最小单位0',
          },
        ],
      })(<InputNumber min={0} max={100000} precision={2}/> )}元/台
    </FormItem>))

  const handleOk = () => {

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
      const d = vehicleValidatePriceInfoList.map(item => {
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
        <AuthButton child={ <Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }}  onClick={handleOk}>保存</Button>} resourceId={'RES_2_158'} />

      </Form>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  vehicleValidatePriceInfoList:PropTypes.array,
}

export default Form.create()(modal)
