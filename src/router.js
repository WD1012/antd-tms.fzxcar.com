import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/user',
      models: () => [import('./models/user')],
      component: () => import('./routes/user/'),
    }, {
      path: '/user/:id',
      models: () => [import('./models/user/detail')],
      component: () => import('./routes/user/detail/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/request',
      component: () => import('./routes/request/'),
    }, {
      path: '/UIElement/iconfont',
      component: () => import('./routes/UIElement/iconfont/'),
    }, {
      path: '/UIElement/search',
      component: () => import('./routes/UIElement/search/'),
    }, {
      path: '/UIElement/dropOption',
      component: () => import('./routes/UIElement/dropOption/'),
    }, {
      path: '/UIElement/layer',
      component: () => import('./routes/UIElement/layer/'),
    }, {
      path: '/UIElement/dataTable',
      component: () => import('./routes/UIElement/dataTable/'),
    }, {
      path: '/UIElement/editor',
      component: () => import('./routes/UIElement/editor/'),
    }, {
      path: '/chart/ECharts',
      component: () => import('./routes/chart/ECharts/'),
    }, {
      path: '/chart/highCharts',
      component: () => import('./routes/chart/highCharts/'),
    }, {
      path: '/chart/Recharts',
      component: () => import('./routes/chart/Recharts/'),
    }, {
      path: '/post',
      models: () => [import('./models/post')],
      component: () => import('./routes/post/'),
    }, {
      path: '/manage-location',
      models: () => [import('./models/manageLocation')],
      component: () => import('./routes/manageLocation/'),
    }, {
      path: '/city-collection',
      models: () => [import('./models/cityCollection')],
      component: () => import('./routes/city-collection/'),
    }, {
      path: '/insurance-list',
      models: () => [import('./models/insurance')],
      component: () => import('./routes/insurance/'),
    }, {
      path: '/vehicle-validate-price-info',
      models: () => [import('./models/vehicle-validate-price-info')],
      component: () => import('./routes/vehicleValidatePriceInfo/'),
    }, {
      path: '/transport-regular-info',
      models: () => [import('./models/transport-regular-info')],
      component: () => import('./routes/transportRegularInfo/'),
    }, {
      path: '/transport-info',
      models: () => [import('./models/transport-info')],
      component: () => import('./routes/transportInfo/'),
    }, {
      path: '/manage-carrier',
      models: () => [import('./models/carrier/manageCarrier')],
      component: () => import('./routes/carrier/list'),
    }, {
      path: '/manage-carrier/:id',
      models: () => [import('./models/carrier/manageCarrierDetail')],
      component: () => import('./routes/carrier/list/detail'),
    }, {
      path: '/manage-carrier-line',
      models: () => [import('./models/carrier/manageCarrierLine')],
      component: () => import('./routes/carrier/lines/'),
    }, {
      path: '/waybill-manage',
      models: () => [import('./models/waybill-manage')],
      component: () => import('./routes/waybillManage/'),
    }, {
      path: '/waybill-manage/:waybillNo',
      models: () => [import('./models/waybill-manage-detail')],
      component: () => import('./routes/waybillManageDetail/'),
    }, {
      path: '/waybill-manage/edit/:waybillNo',
      models: () => [import('./models/waybill-manage-detail')],
      component: () => import('./routes/waybillManageDetail/'),
    }, {
      path: '/vehicle-detail/:orderBaseId/:vehicleId',
      models: () => [import('./models/vehicle-detail')],
      component: () => import('./routes/vehicleDetail/'),
    }, {
      path: '/vehicle-detail/edit/:orderBaseId/:vehicleId',
      models: () => [import('./models/vehicle-detail')],
      component: () => import('./routes/vehicleDetail/'),
    }, {
      path: '/serivce-price-info',
      models: () => [import('./models/service-price')],
      component: () => import('./routes/servicePrice/'),
    }, {
      path: '/recovery-vehicle-price',
      models: () => [import('./models/recovery-vehicle-price')],
      component: () => import('./routes/recoveryVehiclePrice/'),
    }, {
      path: '/tabke-vehicle-price',
      models: () => [import('./models/take-vehicle-price')],
      component: () => import('./routes/takeVehiclePrice/'),
    }, {
      path: '/used-car-driving-price',
      models: () => [import('./models/used-car-driving-price')],
      component: () => import('./routes/usedCarDrivingPrice/'),
    },{
      path: '/deliver-store-price',
      models: () => [import('./models/deliver-store-price')],
      component: () => import('./routes/deliverStorePrice/'),
    },{
      path: '/city-logistics-hub',
      models: () => [import('./models/city-logistics-hub')],
      component: () => import('./routes/cityLogisticsHub/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={zh_CN}>
        <App>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
            {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
            <Route component={error} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
