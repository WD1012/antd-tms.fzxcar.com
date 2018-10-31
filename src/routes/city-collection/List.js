import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { Divider } from 'antd';
import AuthButton from "../../components/AuthButton/AuthButton";
const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem, isMotion, onHrefEdit,
  onHrefDelete, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '集合名称',
      dataIndex: 'collectionName',
      key: 'collectionName',
      width: 120,
    }, {
      title: '集合元素',
      dataIndex: 'name',
      key: 'name',
      width: 400,
      render: (text, record) => {
        const renderCity = record.collecitonDetail.map((item) => {
          return item.cityName
        })
        return renderCity.join()
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        // return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
        return (<div>
          <AuthButton child={[  <a href="#" onClick={e => onHrefEdit(e, record)}>编辑</a>,
          <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_175'} />
          <AuthButton child={[  <a href="#" onClick={e => onDeleteItem(e, record.id)}>删除</a>]} resourceId={'RES_2_176'} />
        </div>)
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  return (
    <Table
      {...tableProps}
      className={styles.table}
      bordered
      columns={columns}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  onHrefEdit: PropTypes.func,
  onHrefDelete: PropTypes.func,
}

export default List
