import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Divider } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)


  const deleteComfim = (id,e) => {
    e.preventDefault()
    confirm({
      title: '确认删除服务费配置？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onDeleteItem(id,'admin')
      },
    })
  }

  const columns = [
    {
      title: '运单类型',
      dataIndex: 'waybillType',
      key: 'waybillType',
    },{
      title: '单车服务费',
      dataIndex: 'singleServicePrice',
      key: 'singleServicePrice',
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span>
          <a href="#"  onClick={e => onEditItem(record,e)} >编辑</a>
          <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />
          <a href="#" onClick={e => deleteComfim(record.id,e)} >删除</a>
        </span>
      )
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1250 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
