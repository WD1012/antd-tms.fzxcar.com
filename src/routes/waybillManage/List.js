import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon, Divider } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import AuthButton from '../../components/AuthButton/AuthButton'

const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem,
  watchQuotedPriceClick,
  editQuotedPriceClick, isMotion, location, ...tableProps,onPayAuditShow
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
      title: '运单号',
      dataIndex: 'waybillNo',
      key: 'waybillNo',
      width: 170,
      fixed: 'left',
      render: (text, record) => {
        return <Link to={`waybill-manage/${record.orderBaseId}`}>{text}</Link>
      },
    }, {
      title: '订单号',
      dataIndex: 'dmsOrderNo',
      key: 'dmsOrderNo',
      width: 120,
    }, {
      title: '起始地',
      dataIndex: 'startCityName',
      key: 'startCityName',
      width: 210,
    }, {
      title: '目的地',
      dataIndex: 'endCityName',
      key: 'endCityName',
      width: 210,
    }, {
      title: '车辆数量',
      dataIndex: 'vehicleNum',
      key: 'vehicleNum',
      width: 90,
    }, {
      title: '承运商',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 250,
    }, {
      title: '运输类型',
      dataIndex: 'transportTypeName',
      key: 'transportTypeName',
      width: 90,
    }, {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 250,
    }, {
      title: '联系人',
      dataIndex: 'linkMan',
      key: 'linkMan',
      width: 120,
    }, {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 90,
    }, {
      title: '备注',
      width: 170,
      dataIndex: 'controlRemark',
      key: 'controlRemark',
    }, {
      title: '操作',
      key: 'operation',
      width: 140,
      fixed: 'right',
      render: (text, record) => {
        // return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
        return (
          <div className={styles.operation}>

            {record.paymentAudit === 1 ? <AuthButton child={ [<a onClick={(e) => { onPayAuditShow(e, record) }}><div>支付审核</div></a>,<Divider type="vertical" />]} resourceId='RES_2_123'/>:null}
            <AuthButton child={<Link to={`/waybill-manage/edit/${record.orderBaseId}`}>审核</Link>} resourceId='RES_2_123'/><Divider type="vertical" />
            {record.status === 1 ? <a onClick={(e) => { watchQuotedPriceClick(e, record) }}><AuthButton child={<div>查看报价</div>} resourceId='RES_2_120'/></a> : null}
            {record.status === 2 ? <a onClick={(e) => { editQuotedPriceClick(e, record) }}><AuthButton child={<div>分配</div>} resourceId='RES_2_121'/></a> : null}
            {record.status === 3 && record.assignStatus === 0 ? <a onClick={(e) => { editQuotedPriceClick(e, record) }}><AuthButton child={<div>重新分配</div>} resourceId='RES_2_122'/></a> : null}
          </div>)
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1920}}
        columns={columns}
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  watchQuotedPriceClick: PropTypes.func,
  editQuotedPriceClick: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  onPayAuditShow:PropTypes.func,
}

export default List
