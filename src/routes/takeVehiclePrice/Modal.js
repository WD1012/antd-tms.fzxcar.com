import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal,Select,Button, } from 'antd'
import AuthButton from "../../components/AuthButton/AuthButton";
const Option = Select.Option
const FormItem = Form.Item
import { message } from 'antd';

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
  takeVehiclePriceList,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getDeclaredFields,

  },
}) => {

  let from = takeVehiclePriceList.map(item => (
    <FormItem  key={item.id} label={item.num} hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
      {getFieldDecorator(''+item.id, {
        initialValue: parseFloat(item.multipleStr),
        rules: [
          {
            required: true,
            type: 'number',
            message: '倍数范围为0.01 ~ 10',
          },
        ],
      })(<InputNumber min={0.01} max={10} precision={2}/> )}
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
      const d = takeVehiclePriceList.map(item => {
          const m = {"id":item.id, "multiple":data[item.id],}
          return m
        }
      )

      const d1 = {}

      d1.list = d
      isDisabled = true;
      onOk(d1,'admin')

      setTimeout(function () {
        isDisabled = false;
      }, 3000);
    })
  }
  return (
      <Form layout="horizontal">
        <FormItem  key={"0000"} label={"数量"} hasFeedback {...formItemLayout}>
        倍数（范围0.01 ~ 10）
        </FormItem>
        {from}
        <AuthButton child={<Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }}  onClick={handleOk}>保存</Button>} resourceId={'RES_2_161'} />
      </Form>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  takeVehiclePriceList:PropTypes.array,
}

export default Form.create()(modal)
