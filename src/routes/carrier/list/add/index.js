import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import { Divider } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const InputGroup = Input.Group;

let uuid = 0;

const ManageCarrierAdd = ({ location, dispatch, manageCarrierAdd, loading, form: {
  getFieldDecorator,
  getFieldValue,
  setFieldsValue,
  validateFields,
  getFieldsValue,
} }) => {

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const servicepPersonFormItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      xl: { span: 3 },
      md: { span: 3 },
      style:{paddingLeft:1,paddingTop:5,marginBottom:5}
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      xl: { span: 21 },
      md: { span: 17 },
      style:{paddingLeft:1,paddingTop:5,marginBottom:5}
    },
  }

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      xl: { span: 21 },
      md: { span: 17 },
      style:{paddingLeft:200,paddingTop:5,marginBottom:5}
    },
  };

  const handleOk = (e) => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log(data)
    })
  }

  getFieldDecorator('keys', { initialValue: [] });

  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => {
    return (
      <FormItem
        {...(servicepPersonFormItemLayout)}
        label={'业务员'+(index+1)}
        required={false}
        key={k}
      >
        {getFieldDecorator(`serviceperson[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input passenger's name or delete this field.",
          }],
        })(

          <InputGroup size="large">
            <Col span={2}>
              <Input placeholder="姓名"/>
            </Col>
            <Col span={3}>
              <Input placeholder="电话"/>
            </Col>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => remove(k)}
              />
            ) : null}
          </InputGroup>
        )}

      </FormItem>
    );
  });


  const remove = (k) => {

    const keys = getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  const add = () => {
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    setFieldsValue({
      keys: nextKeys,
    });
  }

  return (
    <Page inner>
      <Form>
      <div>
        <Row  gutter={24} align={"middle"}>
          <h1>编辑承运商信息</h1>
          <Divider />
        </Row>
        <Row  gutter={24} align={"middle"}>
          <Col xs={{span: 10}}
               sm={{span: 10}}
               xl={{ span: 10 }}
               md={{ span: 10 }}
               style={{paddingLeft:1,paddingTop:5,marginBottom:5}}>

              <FormItem
                {...formItemLayout}
                label="承运商名称">
                {getFieldDecorator('email', {
                })(
                  <Input style={{ width: 200 }}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="承运商简称">
                {getFieldDecorator('password', {

                })(
                  <Input style={{ width: 200 }} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="承运商法人">
                {getFieldDecorator('confirm', {

                })(
                  <Input style={{ width: 200 }}/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="联系方式">
                {getFieldDecorator('confirm', {

                })(
                  <Input style={{ width: 200 }}/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="保险费">
                {getFieldDecorator('confirm', {

                })(
                  <Input style={{ width: 200 }}/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="承运商状态">
                {getFieldDecorator('confirm', {

                })(
                  <Input style={{ width: 200 }}/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="备注">
                {getFieldDecorator('confirm', {
                })(
                  <TextArea rows={4} style={{ width: 300 }}/>
                )}
              </FormItem>

          </Col>
        </Row>

        <Row  gutter={24} align={"middle"}>
          <h2>业务联系人信息   <Divider  type="vertical"/>
          <Button type="dashed" onClick={add} style={{ width: '10%' }}>
          <Icon type="plus" /> 增 加
          </Button></h2>
          <Divider />
        </Row>
        <Row  gutter={24} align={"middle"}>
          {formItems}
        </Row>

        <Row gutter={24} align={"middle"}>
          <h2>运输区域管理</h2>
          <Divider />
        </Row>
        <Row gutter={24} align={"middle"}>

        </Row>

      </div>
      </Form>
    </Page>

  )
}

ManageCarrierAdd.propTypes = {
  manageCarrierAdd: PropTypes.object,
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Form.create()(ManageCarrierAdd)
