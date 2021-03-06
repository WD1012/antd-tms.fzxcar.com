import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber,Radio, Modal, Cascader } from 'antd'
import { Select } from 'antd'

const Option = Select.Option
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import { DatePicker } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 14,
  },
}

const addModeal = ({
                 onOk,
                 form: {
                   getFieldDecorator,
                   validateFields,
                   getFieldsValue,
                 },insurances,
                 ...addModalProps
               }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        createUser:'admin',
      }

      data.businessLicenceLifeStr = data.businessLicenceLifeStr.format('YYYY-MM-DD')
      data.contractLifeStr = data.contractLifeStr.format('YYYY-MM-DD')
      data.transportLicenceLifeStr = data.transportLicenceLifeStr.format('YYYY-MM-DD')
      //console.log(data)
      onOk(data)
    })
  }

  const modalOpts = {
    ...addModalProps,
    onOk: handleOk,
  }

  const children = [];
  children.push(<Select.Option key={1}>{'大板'}</Select.Option>);
  children.push(<Select.Option key={2}>{'救援'}</Select.Option>);
  children.push(<Select.Option key={3}>{'代驾'}</Select.Option>);

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">

        <FormItem label="承运商名称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('carrierName', {
            rules: [
              {
                required: true,
                message: '承运商名称必填',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="承运商简称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('carrierShortName', {
          })(<Input />)}
        </FormItem>
        <FormItem label="运输类型" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('transportTypes', {
            rules: [
              {
                required: true,
                message: '业务类型必选择',
              },
            ],
          })(
            <Select
              mode="tags"
              style={{ width: '100%' }}
            >
              {children}
            </Select>

          )}
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

        <FormItem label="法人" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('legalPerson', {
            rules: [
              {
                required: true,
                message: '法人必填',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="法人联系方式" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('legalTel', {
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: '法人联系方式必填且合法手机号',
              },
            ],
          })(<Input />)}
        </FormItem>


        <FormItem label="注册资金" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('registeredCapital', {
            rules: [
              {
                required: true,
                type: 'number',
                message: '注册资金必填',
              },
            ],
          })(<InputNumber min={1} precision={2}/> )}元
        </FormItem>

        <FormItem label="开票税率" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('taxRate', {
            initialValue: 100,
            rules: [
              {
                required: true,
                type: 'number',
                message: '开票税率必填',
              },
            ],
          })(<InputNumber precision={0} min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}/> )}
        </FormItem>

        <FormItem label="保险费" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('insuranceId', {
            rules: [
              {
                required: true,
                message: '保险费必选',
              },
            ],
          })(<Select placeholder="选择保险费">
            { insurances.map(json => (<Option key={json.id}> {json.templateName} </Option>))}
          </Select> )}
        </FormItem>

        <FormItem label="营业执照有效期" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('businessLicenceLifeStr', {
            rules: [
              {
                required: true,
                message: '营业执照有效期必填',
              },
            ],
          })(<DatePicker showToday={false} placeholder="选择到期时间"/> )}
        </FormItem>
        <FormItem label="合同有效期" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
            {getFieldDecorator('contractLifeStr', {
              rules: [
                {
                  required: true,
                  message: '合同有效期必填',
                },
              ],
            })(<DatePicker showToday={false}  placeholder="选择到期时间"/> )}
        </FormItem>
        <FormItem label="道路运输许可证有效期" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
              {getFieldDecorator('transportLicenceLifeStr', {
                rules: [
                  {
                    required: true,
                    message: '道路运输许可证有效期必填',
                  },
                ],
              })(<DatePicker showToday={false} placeholder="选择到期时间"/> )}

        </FormItem>

        <FormItem style={{"marginBottom": "8px"}}
          {...formItemLayout}
          label="备注">
          {getFieldDecorator('remark', {
          })(
            <TextArea rows={4} maxLength={200} style={{ width: 300 }}/>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

addModeal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  insurances:PropTypes.array,
}

export default Form.create()(addModeal)
