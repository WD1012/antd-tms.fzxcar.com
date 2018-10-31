import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { config } from 'utils'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'
import { Upload, message, Icon } from 'antd';
import { Link } from 'react-router-dom'
import { Select } from 'antd';
import AuthButton from "../../../components/AuthButton/AuthButton";

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
  onFilterChange,
  filter,
  importLineProps,
  addrOptions,
  addrLoadData,
  carrierList,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {

    let query ={}
    if(fields.queryOrigin && fields.queryOrigin.length === 1){
      Object.assign(query, {startPlaceProvinceCode:fields.queryOrigin[0]});
    }
    if(fields.queryDestination && fields.queryDestination.length === 1){
      Object.assign(query, {destinationProvinceCode :fields.queryDestination[0]});
    }

    if(fields.queryOrigin && fields.queryOrigin.length > 1){
      Object.assign(query, {startPlaceCityCode:fields.queryOrigin[1]});
    }
    if(fields.queryDestination && fields.queryDestination.length > 1){
       Object.assign(query, {destinationCityCode:fields.queryDestination[1]});
    }

    if(fields.carrierId){
      Object.assign(query, {carrierId:fields.carrierId});
    }

    if(fields.queryStatus){
      Object.assign(query, {status:fields.queryStatus});
    }
    return query
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const checkFiles = (event) => {
    console.log(event.target.children[2])
    event.persist()  // 为了支持异步回掉后对event事件的继续引用
    event.target.children[2] && event.target.children[2].click()
  }
  // 阻止a标签向上冒泡
  const downClick = (event) => {
    event.stopPropagation()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { queryOrigin,queryDestination,carrierId,queryStatus  } = filter

  return (
    <div>
      <Row  gutter={24} align={"middle"}>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:10,paddingTop:0,marginBottom:5}}>
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
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
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

        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('carrierId', { initialValue: carrierId })(
            <Select allowClear={true}  placeholder="承运商" style={{ width: '100%' }} dropdownMatchSelectWidth={false}>
              { carrierList.map(json => (<Select.Option key={json.id}> {json.label} </Select.Option>))}
            </Select>
          )}
        </Col>
        <Col xs={{span: 4}}
             sm={{span: 4}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:5}}>
          {getFieldDecorator('queryStatus', { initialValue: queryStatus })(
            <Select allowClear={true} placeholder="状态" style={{ width: 100 }} >
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">暂停</Select.Option>
            </Select>
          )}
        </Col>

      </Row>
      <Row  gutter={24} align={"middle"}>
        <Col  xs={{span: 12}}
              sm={{span: 12}}
              xl={{ span: 12 }}
              md={{ span: 12 }}
              style={{paddingLeft:10,paddingTop:0,marginBottom:5,paddingRight:0}}>
          <Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }} onClick={handleSubmit}>查询</Button>

          <AuthButton child={ <Button icon={"plus"} className="margin-right"   style={{ background: 'rgb(89, 205, 33)' ,color:"rgb(255, 255, 255)" }} onClick={onAdd}>  增加</Button>} resourceId={'RES_2_142'} />
          <AuthButton child={ <Button  className="margin-right" icon="download" onClick={checkFiles} >下载导入模板<a href={`http://${config.import_on}/${config.import_temp}`} download  onClick={downClick}></a></Button>} resourceId={'RES_2_142'} />
          <AuthButton child={ <Upload {...importLineProps}>
            <Button >
              <Icon type="upload" /> 导入线路
            </Button>
          </Upload>} resourceId={'RES_2_142'} />


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
  addrOptions:PropTypes.array,
  addrLoadData:PropTypes.func,
  carrierList:PropTypes.array,
  importLineProps:PropTypes.object,
}

export default Form.create()(Filter)
