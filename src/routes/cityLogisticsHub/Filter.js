import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'


import { Form, Button, Row, Col, DatePicker, Select,Input, Cascader, Switch } from 'antd'
import AuthButton from "../../components/AuthButton/AuthButton";

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
  statusOptions,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },  addrOptions,addrLoadData,
}) => {
  const handleFields = (fields) => {
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const { cityName,  } = filter

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('cityName', { initialValue: cityName })(<Search style={{ width: '100%' }} placeholder="城市名称" onSearch={handleSubmit} />)}
      </Col>

      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <Button type="primary" className="margin-right" onClick={handleSubmit}>查询</Button>
            <AuthButton child={ <Button  style={{ background: 'rgb(89, 205, 33)', color: 'rgb(255, 255, 255)' }} icon="plus" onClick={onAdd}>增加</Button>} resourceId={'RES_2_147'} />
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,

  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
