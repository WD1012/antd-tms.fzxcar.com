import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'


import { Form, Button, Row, Col, DatePicker, Select,Input, Cascader, Switch } from 'antd'
import city from '../../utils/city'
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
  switchIsMotion,
  regionResultOptions,
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
    let query ={}


    if(fields.queryOrigin && fields.queryOrigin.length === 1){
      Object.assign(query, {startProvinceCode :fields.queryOrigin[0]});
    }

    if(fields.queryOrigin && fields.queryOrigin.length > 1){
      Object.assign(query, {startCityCode :fields.queryOrigin[1]});
    }

    if(fields.queryOrigin && fields.queryOrigin.length > 2){
      Object.assign(query, {startRegionCode :fields.queryOrigin[2]});
    }

    if(fields.queryDestination && fields.queryDestination.length === 1){
      Object.assign(query, {destinationProvinceCode:fields.queryDestination[0]});
    }
    if(fields.queryDestination && fields.queryDestination.length > 1){
      Object.assign(query, {destinationCityCode:fields.queryDestination[1]});
    }

    if(fields.queryDestination && fields.queryDestination.length > 2){
      Object.assign(query, {destinationRegionCode:fields.queryDestination[2]});
    }

    if(fields.queryStatus){
      Object.assign(query, {status:fields.queryStatus});
    }

    if(fields.queryTransportTypeId){
      Object.assign(query, {transportTypeId :fields.queryTransportTypeId });
    }

    return query
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const { queryStatus, queryDestination,queryOrigin , queryTransportTypeId} = filter

  const children = [];
  children.push(<Select.Option key={1}>{'大板'}</Select.Option>);
  children.push(<Select.Option key={2}>{'救援'}</Select.Option>);
  children.push(<Select.Option key={3}>{'代驾'}</Select.Option>);


  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('queryStatus', { initialValue: queryStatus })(<Select  style={{ width: '100%' }}  allowClear={true} placeholder="选择状态">{statusOptions}</Select>)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('queryTransportTypeId', { initialValue: queryTransportTypeId })
        (<Select  style={{ width: '100%' }}  allowClear={true} placeholder="选择运输类型">{children}</Select>)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('queryOrigin', { initialValue: queryOrigin })(
          <Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            placeholder="起始地"
          />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
        {getFieldDecorator('queryDestination', { initialValue: queryDestination })(
          <Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            placeholder="目的地"
          />
        )}
      </Col>

      <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
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
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  statusOptions: PropTypes.array,
  form: PropTypes.object,
  filter: PropTypes.object,
  regionResultOptions: PropTypes.array,
  onFilterChange: PropTypes.func,
  addrOptions:PropTypes.array,
  addrLoadData:PropTypes.func,
}

export default Form.create()(Filter)
