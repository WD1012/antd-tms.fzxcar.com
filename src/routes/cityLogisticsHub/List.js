import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { Divider,Badge } from 'antd';
import AuthButton from "../../components/AuthButton/AuthButton";
const confirm = Modal.confirm
import accounting from 'utils/accounting'

const List = ({
  onDeleteItem, onEditItem, location, ...tableProps,deleteClick,
}) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      Modal.warning({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }
  const editBtnClick = (record, e) => {
    e.preventDefault()
    onEditItem(record);
  }

  const deleteBtnClick = (record, e) => {
    e.preventDefault()

    confirm({
      title: '确定删除这条记录?',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        deleteClick(record)
      },
    })
  }
  const columns = [
    {
      title: '城市名称',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 300,
    }, {
      title: '枢纽坐标（经度/纬度）',
      dataIndex: 'gpsLongitude',
      key: 'gpsLongitude',
      width: 300,
      render: (text, record) => {
        return `经度：${record.gpsLongitude} / 纬度：${record.gpsLatitude}`
      },
    },{
      title: '详细地址',
      dataIndex: 'searchAddress',
      key: 'searchAddress',

      render: (text, record) => {
        return `${record.searchAddress}`
      },
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span className={styles.operation}>
             <a href="#" onClick={e => editBtnClick(record, e)}>编辑</a><Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />
             <a href="#" onClick={e => deleteBtnClick(record, e)}>删除</a>
          </span>
          )
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
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
  onEditItem: PropTypes.func,
  editClick: PropTypes.func,
  deleteClick: PropTypes.func,
  location: PropTypes.object,
}

export default List
