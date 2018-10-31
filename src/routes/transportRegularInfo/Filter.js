import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select } from 'antd'
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
  isMotion,
  stateOptions,
  switchIsMotion,
  onFilterChange,
  regionBaseResultList,
  addrLoadData,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {

    let query ={}
    if(fields.startAddress && fields.startAddress.length > 1){
      Object.assign(query, {startProvinceCode:fields.startAddress[0]});
      Object.assign(query, {startCityCode:fields.startAddress[1]});
    }
    if(fields.endAddress && fields.endAddress.length > 1){
      Object.assign(query, {destinationProvinceCode:fields.endAddress[0]});
      Object.assign(query, {destinationCityCode :fields.endAddress[1]});
    }

    if(fields.startAddress && fields.startAddress.length === 1){
      Object.assign(query, {startProvinceCode:fields.startAddress[0]});
    }
    if(fields.endAddress && fields.endAddress.length === 1){
      Object.assign(query, {destinationProvinceCode:fields.endAddress[0]});
    }

    if(fields.queryStatus){
      Object.assign(query, {status:fields.queryStatus});
    }

    if(fields.queryTransportType){
      Object.assign(query, {transportTypeId:fields.queryTransportType});
    }


    return query

  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)

    onFilterChange(fields)
  }

  const { queryStatus, startAddress,endAddress ,queryTransportType} = filter
  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }


  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('queryStatus', { initialValue: queryStatus })(<Select   allowClear={true} placeholder="状态" style={{ width: '100%' }}>
          {stateOptions}
        </Select>)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('queryTransportType', { initialValue: queryTransportType })(<Select   allowClear={true} placeholder="运输类型" style={{ width: '100%' }}>
          <Select.Option key={1}>大板</Select.Option>
          <Select.Option key={2}>救援</Select.Option>
          <Select.Option key={3}>代驾</Select.Option>
        </Select>)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('startAddress', { initialValue: startAddress })(<Cascader
          style={{ width: '100%' }}
          options={regionBaseResultList}
          loadData={addrLoadData}
          changeOnSelect
          placeholder="起始地"
        />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('endAddress', { initialValue: endAddress })(<Cascader
          style={{ width: '100%' }}
          options={regionBaseResultList}
          loadData={addrLoadData}
          changeOnSelect
          placeholder="目的地"
        />)}
      </Col>
      <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <Button type="primary" className="margin-right" icon="search" onClick={handleSubmit}>查询</Button>
            <AuthButton child={ <Button style={{ background: 'rgb(89, 205, 33)', color: 'rgb(255, 255, 255)' }} icon="plus" onClick={onAdd}>增加</Button>} resourceId={'RES_2_153'} />
          </div>
        </div>
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
  regionBaseResultList: PropTypes.array,
  addrLoadData: PropTypes.func,
  stateOptions: PropTypes.array,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
