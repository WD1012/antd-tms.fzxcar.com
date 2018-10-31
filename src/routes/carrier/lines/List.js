import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Button } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { Divider,Badge } from 'antd';
import accounting from 'utils/accounting'
import AuthButton from "../../../components/AuthButton/AuthButton";
const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem,onOffItem, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)

  const del = (record, e) =>{

    const startPlaceCity = record.startPlaceCity
    const destinationCity = record.destinationCity
    const carrierName = record.carrierName

    confirm({
      title: '确认删除承运商：' + carrierName +'，'+ startPlaceCity + '至' + destinationCity + ' 线路？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onDeleteItem(record.id,'admin')
      },
    })
  }

  const onOff = (record, e) =>{
    e.preventDefault()
    const status = record.status;
    const startPlaceCity = record.startPlaceCity
    const destinationCity = record.destinationCity
    const carrierName = record.carrierName

    const o = status===0?'暂停':'开启'
      confirm({
      title: '确认'+ o + '承运商：' + carrierName +'，'+ startPlaceCity + '至' + destinationCity + ' 线路？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onOffItem(record.id)
      },
    })
  }


  const columns = [
    {
      title: '起始地',
      dataIndex: 'startPlaceCity',
      key: 'startPlaceCity',
      width: 120,
      render: (text, record) => <span>{record.startPlaceProvince.length === 0 ? "":record.startPlaceProvince+ "/" }{record.startPlaceCity }</span>,
    }, {
      title: '目的地',
      dataIndex: 'destinationCity',
      key: 'destinationCity',

      render: (text, record) => <span>{record.destinationProvince.length === 0 ?"":record.destinationProvince  + "/"}{record.destinationCity }</span>,
      width: 120,
    }, {
      title: '承运商',
      dataIndex: 'carrierName',
      key: 'carrierName',

      width: 300,
    },  {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => <span><Badge status={text === 0 ? 'success' : 'error'} />{text === 0 ? '正常' : '暂停'}</span>
    },{
      title: '运价(单位:元)',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (text, record) => <span >{accounting.formatMoney(text) }</span>
    },{
      title: '操作',
      key: 'operation',
      width: 160,
      render: (text, record) => (
        <span className={styles.operation}>
          <AuthButton child={[   <a href="#" onClick={e => onEditItem(record, e)}>编辑</a>,
            <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_143'} />
          <AuthButton child={[<a href="#" onClick={e => onOff(record, e)}>{record.status===0?'暂停':'开启'}</a>,
            <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_144'} />
          <AuthButton child={[  <a href="#" onClick={e => del(record, e)}>删除</a>]} resourceId={'RES_2_146'} />
        </span>
      )
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  return (
    <div>
      <Table
        {...tableProps}
        scroll={{ x: 1000,}}
        className={styles.table}
        bordered
        columns={columns}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onOffItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
