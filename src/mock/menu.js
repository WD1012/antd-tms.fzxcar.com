const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
  },
  {
    id: '2',
    bpid: '1',
    name: 'Users',
    icon: 'user',
    route: '/user',
  },
  {
    id: '7',
    bpid: '1',
    name: 'Posts',
    icon: 'shopping-cart',
    route: '/post',
  },
  {
    id: '21',
    mpid: '-1',
    bpid: '2',
    name: 'User Detail',
    route: '/user/:id',
  },
  {
    id: '3',
    bpid: '1',
    name: 'Request',
    icon: 'api',
    route: '/request',
  },
  {
    id: '4',
    bpid: '1',
    name: 'UI Element',
    icon: 'camera-o',
  },
  {
    id: '41',
    bpid: '4',
    mpid: '4',
    name: 'IconFont',
    icon: 'heart-o',
    route: '/UIElement/iconfont',
  },
  // {
  //   id: '42',
  //   bpid: '4',
  //   mpid: '4',
  //   name: 'DataTable',
  //   icon: 'database',
  //   route: '/UIElement/dataTable',
  // },
  {
    id: '43',
    bpid: '4',
    mpid: '4',
    name: 'DropOption',
    icon: 'bars',
    route: '/UIElement/dropOption',
  },
  {
    id: '44',
    bpid: '4',
    mpid: '4',
    name: 'Search',
    icon: 'search',
    route: '/UIElement/search',
  },
  // {
  //   id: '45',
  //   bpid: '4',
  //   mpid: '4',
  //   name: '56pxor',
  //   icon: 'edit',
  //   route: '/UIElement/editor',
  // },
  // {
  //   id: '46',
  //   bpid: '4',
  //   mpid: '4',
  //   name: 'layer (Function)',
  //   icon: 'credit-card',
  //   route: '/UIElement/layer',
  // },
  {
    id: '5',
    bpid: '1',
    name: 'Charts',
    icon: 'code-o',
  },
  {
    id: '51',
    bpid: '5',
    mpid: '5',
    name: 'ECharts',
    icon: 'line-chart',
    route: '/chart/ECharts',
  },
  {
    id: '52',
    bpid: '5',
    mpid: '5',
    name: 'highCharts',
    icon: 'bar-chart',
    route: '/chart/highCharts',
  },
  {
    id: '53',
    bpid: '5',
    mpid: '5',
    name: 'Rechartst',
    icon: 'area-chart',
    route: '/chart/Recharts',
  },
  {
    id: '6',
    bpid: '1',
    name: 'Test Navigation',
    icon: 'setting',
  },
  {
    id: '61',
    bpid: '6',
    mpid: '6',
    name: 'Test Navigation1',
    route: '/navigation/navigation1',
  },
  {
    id: '62',
    bpid: '6',
    mpid: '6',
    name: 'Test Navigation2',
    route: '/navigation/navigation2',
  },
  {
    id: '621',
    bpid: '62',
    mpid: '62',
    name: 'Test Navigation21',
    route: '/navigation/navigation2/navigation1',
  },
  {
    id: '622',
    bpid: '62',
    mpid: '62',
    name: 'Test Navigation22',
    route: '/navigation/navigation2/navigation2',
  },
  {
    id: '8',
    bpid: '1',
    name: '地理信息管理',
    icon: 'setting',
  }, {
    id: '9',
    bpid: '1',
    name: '保险费模板',
    icon: 'setting',
  }, {
    id: '10',
    bpid: '1',
    name: '客户运价',
    icon: 'setting',
  }, {
    id: '12',
    bpid: '1',
    name: '运单管理',
    icon: 'setting',
  },
  {
    id: '81',
    bpid: '8',
    mpid: '8',
    name: '调度员区域管理',
    route: '/manage-location',
  },
  {
    id: '82',
    bpid: '8',
    mpid: '8',
    name: '城市集合管理',
    route: '/city-collection',
  }, {
    id: '91',
    bpid: '9',
    mpid: '9',
    name: '查看模板',
    route: '/insurance-list',
  }, {
    id: '101',
    bpid: '10',
    mpid: '10',
    name: '规则运价',
    route: '/transport-regular-info',
  }, {
    id: '102',
    bpid: '10',
    mpid: '10',
    name: '固定运价',
    route: '/transport-info',
  }, {
    id: '103',
    bpid: '10',
    mpid: '10',
    name: '提验车费配置',
    route: '/vehicle-validate-price-info',
  }, {
    id: '11',
    bpid: '1',
    name: '承运商管理',
    icon: 'user',
  },
  {
    id: '111',
    bpid: '11',
    mpid: '11',
    name: '承运商列表',
    route: '/manage-carrier',
  },{
    id: '11101',
    bpid: '111',
    mpid: '-1',
    name: '承运商详情',
    route: '/manage-carrier/:id',
  }, {
    id: '114',
    bpid: '11',
    mpid: '11',
    name: '承运商线路列表',
    route: '/manage-carrier-line',
  }, {
    id: '1201',
    bpid: '12',
    mpid: '12',
    name: '运单列表',
    route: '/waybill-manage',
  }, {
    id: '1201',
    bpid: '12',
    mpid: '-1',
    name: '运单详情',
    route: '/waybill-manage/:waybillNo',
  }, {
    id: '1202',
    bpid: '12',
    mpid: '-1',
    name: '运单详情编辑',
    route: '/waybill-manage/edit/:waybillNo',
  },{
    id: '1203',
    bpid: '12',
    mpid: '-1',
    name: '车辆详情',
    route: '/waybill-manage/vehicle-detail/:orderBaseId/:vehicleId',
  },{
    id: '104',
    bpid: '10',
    mpid: '10',
    name: '服务费配置',
    route: '/serivce-price-info',
  },
]

module.exports = {
  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}
