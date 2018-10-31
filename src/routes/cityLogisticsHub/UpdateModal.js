import React from 'react'

import PropTypes from 'prop-types'
import { Form, Button, Input, Select,  Row, Col,Modal, Cascader, } from 'antd'
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap'
import { message, } from 'antd';
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

/*
componentDidMount =() => {
  var map = new BMap.Map("allmap"); // 创建Map实例
  map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
  map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
  map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
}
*/

const modal = ({
                 item,
                 onOk,
                 form: {
                   getFieldDecorator,
                   validateFields,
                   getFieldsValue,
                 },
                 addrOptions,addrLoadData,lon,lat,address,markerVisible,center,local,dot,
                 ...modalProps
               }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      onOk()
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const set = new  Set();
  let lbs = ''
  const onChange = (value, selectedOptions) =>{
    selectedOptions.map((item) => {
      set.add({'key':item.value,'label':item.label})
      lbs = lbs + item.label
    })

  }
  const loca = (e) =>{

    local(lbs,set)
  }

  const getEvents = () => {
    return {
      click: (e) => {
        let address

        var geocoder= new BMap.Geocoder();

        geocoder.getLocation(e.point,function(rs){

          address = rs.address
          const lon = e.point.lng
          const lat = e.point.lat
          dot(lon,lat,address)
        });

      }
    }
  }

  const validatorAddr = (rule, value, callback) => {

    if (value) {
      if (value.length < 2) {
        callback('必须选择到市级或区级地址')
      }
      callback()
    } else {
      callback('必须选择到市级或区级地址')
    }
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col  xl={{ span: 10 }} md={{ span: 10 }} style={{paddingTop:0,marginBottom:5}}>
            <Cascader
              style={{ width: '100%' }}
              options={addrOptions}
              loadData={addrLoadData}
              changeOnSelect
              onChange={onChange}
              placeholder="选择省/市/区"


            />
          </Col>

          <Col  xl={{ span: 2 }} md={{ span: 2 }} style={{paddingTop:0,marginBottom:5}}>
            <Button type="primary" className="margin-right" onClick={e => loca(e)}  style={{paddingTop:0,marginBottom:5}}>定位</Button>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col  xl={{ span: 24 }} md={{ span: 24 }}style={{paddingTop:0,marginBottom:5}}>
            <Input   placeholder="详细地址" value={address}/>
          </Col>

          <Col  xl={{ span: 10 }} md={{ span: 10 }} style={{paddingTop:0,marginBottom:5}}>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col  xl={{ span: 10 }} md={{ span: 10 }} style={{paddingTop:0,marginBottom:5}}>
            <Input addonBefore="纬度"  value={lat} />
          </Col>
          <Col  xl={{ span: 10 }} md={{ span: 10 }} style={{paddingTop:0,marginBottom:5}}>
            <Input addonBefore="经度"  value={lon} />
          </Col>
        </Row>

        <Row gutter={24}>
          <Map events={getEvents()} enableScrollWheelZoom center={center===''?{lng:lon , lat:lat}:center}  zoom={15} >
            {markerVisible &&
            <Marker position={{lng:lon , lat:lat}} >
            </Marker> }
          </Map>
        </Row>



      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  onOk: PropTypes.func,

  addrOptions:PropTypes.array,
  addrLoadData:PropTypes.func,

  lon:PropTypes.number,
  lat:PropTypes.number,
  address:PropTypes.string,
  markerVisible:PropTypes.bool,
  center:PropTypes.string,
  local:PropTypes.func,

  dot:PropTypes.func,

  item:PropTypes.object,
}

export default Form.create()(modal)
