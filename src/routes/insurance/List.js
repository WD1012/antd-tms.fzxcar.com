import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import AuthButton from "../../components/AuthButton/AuthButton";
const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem, isMotion, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    e.preventDefault()
    confirm({
      title: '确定删除这条记录?',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 200,
    }, {
      title: '计费单位',
      dataIndex: 'chargingUnitName',
      key: 'chargingUnitName',
      width: 100,
    }, {
      title: '计费规则',
      dataIndex: 'rule',
      key: 'rule',
    }, {
      title: '操作',
      dataIndex: '',
      key: 'opt',
      width: 100,
      render: (text, record) => {
        return <AuthButton child={[ <a href="#" onClick={e => handleMenuClick(record, e)}>删除</a>]} resourceId={'RES_2_173'} />
      },
    },
  ]


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
}

export default List
