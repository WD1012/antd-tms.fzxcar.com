import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Modal, InputNumber, Row, Col } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({
  onChange, onUpdate, isMotion, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)


  const columns = [
    {
      title: '',
      dataIndex: 'priceName',
      key: 'priceName',
    }, {
      title: '计费单位',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return <InputNumber defaultValue={record.price} onChange={(val) => { onChange(record, val) }} />
      },
    },
  ]

  const getBodyWrapperProps = {
    // page: location.query.page,
    // current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <Row type="flex" justify="center">
      <Col span={24}>
        <Table
          {...tableProps}
          className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
          showHeader={false}
          pagination={false}
          columns={columns}
          simple
          rowKey={record => record.id}
          getBodyWrapper={getBodyWrapper}
        /></Col>
      <Col span={4}><Button onClick={onUpdate}>保存</Button></Col>
    </Row>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onUpdate: PropTypes.func,
  onChange: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
