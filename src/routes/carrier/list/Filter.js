import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import AuthButton from "../../../components/AuthButton/AuthButton";
import { Form, Button, Row, Col, DatePicker, Input, Select, } from 'antd'
const Option = Select.Option

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
  onFilterChange,
  filter,
  addrsData,
  insurances,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { status,insuranceId,startingPlace,destinationPlace } = fields
    if (status === '-1' ) {
      fields.status = null
    }

    if (insuranceId === '-1' ) {
      fields.insuranceId = null
    }
    if (startingPlace === '-1' ) {
      fields.startingPlace = null
    }
    if (destinationPlace === '-1' ) {
      fields.destinationPlace = null
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { carrierName, linkMan,linkTel ,status ,insuranceId,startPlace,destinationPlace } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <div>
      <Row  gutter={24} align={"middle"}>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:10,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('linkMan', { initialValue: linkMan })(<Search style={{ width: '100%' }} placeholder="业务联系人" onSearch={handleSubmit} />)}
        </Col>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:10,paddingTop:0,marginBottom:5}}>
           {getFieldDecorator('carrierName', { initialValue: carrierName })(<Search style={{ width: '100%' }} placeholder="承运商名称" onSearch={handleSubmit} />)}
        </Col>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:10,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('insuranceId', { initialValue: insuranceId })(
            <Select allowClear={true} placeholder="保险费" style={{ width: '100%' }}>
              { insurances.map(json => (<Option key={json.id}> {json.templateName} </Option>))}
            </Select>
          )}
        </Col>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('status', { initialValue: status })(

            <Select
              allowClear={true}
              showSearch
              style={{ width: '100%' }}
              placeholder="状态"
              optionFilterProp="children"
            >
              <Option key={0}>正常</Option>
              <Option key={1}>暂停</Option>
            </Select>
          )}
        </Col>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span:4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('startingPlace', { initialValue: startPlace })(
            <Select
              allowClear={true}
              showSearch
              style={{ width: '100%' }}
              placeholder="运输区域起始地"
              optionFilterProp="children"
            >
              { addrsData.map(json => (<Option key={json.value}> {json.label} </Option>))}
            </Select>
          )}
        </Col>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span:4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('destinationPlace',{ initialValue: destinationPlace })(
            <Select
              allowClear={true}
              showSearch
              style={{ width: '100%' }}
              placeholder="运输区域目的地"
              optionFilterProp="children"
            >
              { addrsData.map(json => (<Option key={json.value}> {json.label} </Option>))}
            </Select>
          )}
        </Col>

      </Row>

      <Row gutter={24}>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:10,paddingTop:10,marginBottom:10}}>
          {getFieldDecorator('linkTel', { initialValue: linkTel  })(<Search style={{ width: '100%' }} placeholder="业务联系人电话" onSearch={handleSubmit} />)}
        </Col>
        <Col  xs={{span: 6}}
              sm={{span: 6}}
              xl={{ span: 6 }}
              md={{ span: 6 }}
              style={{paddingLeft:10,paddingTop:10,marginBottom:10}}>
               <Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }}  onClick={handleSubmit}>查询</Button>
          <AuthButton child={<Button icon="plus" style={{ background: 'rgb(89, 205, 33)' ,color:"rgb(255, 255, 255)" }} onClick={onAdd}> 增加</Button>} resourceId={'RES_2_162'} />

        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  addrsData:PropTypes.array,
  insurances:PropTypes.array,
}

export default Form.create()(Filter)
