import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'
import city from '../../utils/city'

const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onAdd,
  switchIsMotion,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    validateFields,
  },
}) => {
  const handleFields = (fields) => {


    const { qusername,qrealName } = fields

    let query ={}
    if(qusername){
      Object.assign(query, {username :qusername});
    }
    if(qrealName){
      Object.assign(query, {realName:qrealName});
    }

    return query

  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }


  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { name } = filter

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('qusername', { initialValue: name, rules: [
          {
            required: true,
            pattern: /^1[34578]\d{9}$/,
            message: '法人联系方式必填且合法手机号',
          },
        ], })(<Search placeholder="手机号" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('qrealName', { initialValue: name })(<Search placeholder="姓名" onSearch={handleSubmit} />)}
      </Col>

      <Col  xs={{span: 2}}
            sm={{span: 2}}
            xl={{ span: 6 }}
            md={{ span: 6 }}
            style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
        <Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }} onClick={handleSubmit}>查询</Button>
        <Button icon={"plus"} className="margin-right"   style={{ background: 'rgb(89, 205, 33)' ,color:"rgb(255, 255, 255)" }} onClick={onAdd}>  增加</Button>

      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
