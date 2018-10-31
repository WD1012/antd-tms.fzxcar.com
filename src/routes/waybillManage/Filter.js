import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Select, Cascader, Tag } from 'antd'
import city from '../../utils/city'
import styles from './List.less'
import AuthButton from '../../components/AuthButton/AuthButton'

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
  onAdd, onExport,
  isMotion,
  regionResultOption,
  dictOrderStatusOption,
  dictOrderTypeOption,
  dictTransportTypeOption,
  dictvehicleStatusOption,
  addrLoadData,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    console.log(fields)
    fields = handleFields(fields)
    // onFilterChange(fields)
  }
  const handleSearch = () => {
    let fields = getFieldsValue()
    console.log(fields)
    if (fields.endAddress) {
      if (fields.endAddress.length === 1) {
        fields.endProvinceCode = fields.endAddress[0]
      }
      if (fields.endAddress.length === 2) {
        fields.endCityCode = fields.endAddress[1]
        fields.endProvinceCode = fields.endAddress[0]
      }
    }
    if (fields.startAddress) {
      if (fields.startAddress.length === 1) {
        fields.startProvinceCode = fields.startAddress[0]
      }
      if (fields.startAddress.length === 2) {
        fields.startCityCode = fields.startAddress[1]
        fields.startProvinceCode = fields.startAddress[0]
      }
    }
   /* if(fields.startNonFormatDate ){
      fields.startDate  =  fields.startNonFormatDate.format('YYYY-MM-DD')
    }*/


    /*if( fields.endNonFormatDate ){
      fields.endDate = fields.endNonFormatDate.format('YYYY-MM-DD')
    }*/

    if(fields.nonFormatDate ){
      fields.startDate  =  fields.nonFormatDate[0].format('YYYY-MM-DD')
    }

    if( fields.nonFormatDate ){
      fields.endDate = fields.nonFormatDate[1].format('YYYY-MM-DD')
    }

    onFilterChange(fields)
  }

  const handleExport = () => {
    let fields = getFieldsValue()
    if (fields.endAddress) {
      if (fields.endAddress.length === 1) {
        fields.endProvinceCode = fields.endAddress[0]
      }
      if (fields.endAddress.length === 2) {
        fields.endCityCode = fields.endAddress[1]
        fields.endProvinceCode = fields.endAddress[0]
      }
    }
    if (fields.startAddress) {
      if (fields.startAddress.length === 1) {
        fields.startProvinceCode = fields.startAddress[0]
      }
      if (fields.startAddress.length === 2) {
        fields.startCityCode = fields.startAddress[1]
        fields.startProvinceCode = fields.startAddress[0]
      }
    }
    if(fields.nonFormatDate ){
      fields.startDate  =  fields.nonFormatDate[0].format('YYYY-MM-DD')
    }

    if( fields.nonFormatDate ){
      fields.endDate = fields.nonFormatDate[1].format('YYYY-MM-DD')
    }


    onExport(fields)
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    // onFilterChange(fields)
  }
  const onStartAddressChange = (value, selectedOptions) => {
    console.log(value, selectedOptions)
  }
  const {
    waybillNo, dmsOrderNo, vin, carrierName, customerName, transportType, status, waybillType, vehicleStatus, startAddress, endAddress,nonFormatDate
  } = filter
  return (
    <div>
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('waybillNo', { initialValue: waybillNo })(<Search placeholder="运单号" onSearch={handleSubmit} />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('dmsOrderNo', { initialValue: dmsOrderNo })(<Search placeholder="订单号" onSearch={handleSubmit} />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('vin', { initialValue: vin })(<Search placeholder="车架号" onSearch={handleSubmit} />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('startAddress', { initialValue: startAddress })(<Cascader
            style={{ width: '100%' }}
            options={regionResultOption}
            loadData={addrLoadData}
            changeOnSelect
            placeholder="起始地"
          />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('endAddress', { initialValue: endAddress })(<Cascader
            style={{ width: '100%' }}
            options={regionResultOption}
            loadData={addrLoadData}
            changeOnSelect
            placeholder="目的地"
          />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('carrierName', { initialValue: carrierName })(<Search placeholder="承运商" onSearch={handleSubmit} />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {
          getFieldDecorator('customerName', { initialValue: customerName })(<Search placeholder="客户" onSearch={handleSubmit} />)
        }
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {getFieldDecorator('transportType', { initialValue: transportType})(<Select
          style={{ width: '100%' }}
          placeholder="运输类型"
          allowClear={true}
          onChange={handleChange.bind(null, 'transportType')}
        >{dictTransportTypeOption}</Select>)}
      </Col>
    </Row>
    <Row gutter={24}>

      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {getFieldDecorator('status', { initialValue: status })(<Select
          style={{ width: '100%' }}
          allowClear={true}
          placeholder="状态"
          onChange={handleChange.bind(null, 'status')}
        >{dictOrderStatusOption}</Select>)}
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {getFieldDecorator('waybillType', { initialValue: waybillType })(<Select
          style={{ width: '100%' }}
          allowClear={true}
          options={city}
          placeholder="运单类型"
          onChange={handleChange.bind(null, 'waybillType')}
        >{dictOrderTypeOption}</Select>)}
      </Col>


      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {getFieldDecorator('vehicleStatus', { initialValue: vehicleStatus })(<Select
          style={{ width: '100%' }}
          allowClear={true}
          placeholder="车辆状态"
          onChange={handleChange.bind(null, 'vehicleStatus')}
        >{dictvehicleStatusOption}</Select>)}
      </Col>

      <Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
        {
          getFieldDecorator('nonFormatDate', { initialValue: nonFormatDate })(

            <RangePicker style={{ width: '100%' }} showToday={false} placeholder={["运单开始日期","运单结束日期"]}
          />
          )
        }
      </Col>

      {/*<Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
        {
          getFieldDecorator('startNonFormatDate', { initialValue: startNonFormatDate })(
            <DatePicker style={{ width: '100%' }} showToday={false} placeholder="选择开始日期"/>
          )
        }
      </Col>*/}
      {/*<Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('endNonFormatDate', { initialValue: endNonFormatDate})(<DatePicker style={{ width: '100%' }} showToday={false} placeholder="选择结束日期"/> )}
      </Col>
      */}




      <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 24 }}>

        <Button type="primary" className="margin-right" onClick={handleSearch}> 查询</Button>
        <Button type="dashed" className="margin-right" onClick={handleExport}> 导出</Button>

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
  regionResultOption: PropTypes.array,
  dictOrderStatusOption: PropTypes.array,
  dictOrderTypeOption: PropTypes.array,
  dictTransportTypeOption: PropTypes.array,
  dictvehicleStatusOption: PropTypes.array,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onExport: PropTypes.func,
  addrLoadData: PropTypes.func,
}

export default Form.create()(Filter)
