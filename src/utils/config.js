const PREFIX = 'http://127.0.0.1:3000'
const PREFIX_LOCAL = '127.0.0.1:8070/api/v1/test-import/upload'

//const PREFIX_ON = 'http://10.3.10.92:8080/tms-boot-rest-0.0.1-SNAPSHOT'
const PREFIX_ON = 'http://10.3.10.112:9006/tms-boot-rest-0.0.1-SNAPSHOT'
//const PREFIX_ON = 'http://microsvc.dycd.com:9006/tms-boot-rest-0.0.1-SNAPSHOT'
//const import_on = '10.3.10.92:8080/tms-boot-rest-0.0.1-SNAPSHOT'
const import_on = '10.3.10.112:9006/tms-boot-rest-0.0.1-SNAPSHOT'
//const import_on = 'microsvc.dycd.com:9006/tms-boot-rest-0.0.1-SNAPSHOT'
const import_temp = 'contract.xlsx'

const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: '',
  prefix: 'DYCD-TMS',
  footerText: 'DYCD  © 2018 TMS',
  logo: '/logo.png',
  logo_: '/logo_.png',
  logo_small: '/logo_small.png',
  logo_small_: '/logo_small_.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  import_on,
  import_temp,
  APIV1,
  APIV2,
  api: {
    userLogin: `${PREFIX_ON}${APIV1}/login`,
    userLogout: `${PREFIX_ON}${APIV1}/login/loginOut`,
    userInfo: `${APIV1}/userInfo`,
    users: `${PREFIX_ON}${APIV1}/role-user`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    // dashboard: `${APIV1}/dashboard`,
    //menus: `${APIV1}/menus`,
    menus: `${PREFIX_ON}${APIV1}/role-user`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
    manageLocation: `${PREFIX_ON}${APIV1}/region-info`,
    getManageLocation: `${PREFIX_ON}${APIV1}/manage-location/`,
    provinc: `${PREFIX}/provinc-names`,
    account: `${PREFIX_ON}${APIV1}/account`,
    addAccount: `${PREFIX_ON}${APIV1}/region-user/add-region-userinfo`,
    insuranceList: `${PREFIX_ON}${APIV1}/insurance-template-info/list`,
    insuranceCreate: `${PREFIX_ON}${APIV1}/insurance-template-info/add`,
    insuranceRemove: `${PREFIX_ON}${APIV1}/insurance-template-info/`,
    vehicleValidatePriceInfo: `${PREFIX_ON}${APIV1}/vehicle-validate-price-info/get`,
    vehicleValidatePriceInfoUpdate: `${PREFIX_ON}${APIV1}/vehicle-validate-price-info`,
    // transportRegularInfo: `${PREFIX_ON}${APIV1}/transport-regular-info`,
    manageCarrier: `${PREFIX_ON}${APIV1}/carrier-info`,
    manageCarrierEmployee: `${PREFIX_ON}${APIV1}/carrier-employee-info`,
    manageCarrierRegion: `${PREFIX_ON}${APIV1}/carrier-transport-region`,
    manageCarrierLine: `${PREFIX_ON}${APIV1}/carrier-contract-line-info`,
    regionInfterFace: `${PREFIX_ON}${APIV1}/region-interface`,
    transportRegularInfo: `${PREFIX_ON}${APIV1}/transport-regular-info`,
    transportInfo: `${PREFIX_ON}${APIV1}/transport-fixed-regular-info`,
    _transportInfo: `${PREFIX_ON}${APIV1}/transport-fixed-regular-info`,
    wayBill: `${PREFIX_ON}${APIV1}/waybill-manage`,
    cityCollectionInfo: `${PREFIX_ON}${APIV1}/city-collectionInfo`,
    // uploadUrl: `http://base-server.dev.dycd.com`,
    uploadUrl: `${PREFIX_ON}${APIV1}/file/upload`,
    servicePrice: `${PREFIX_ON}${APIV1}/service-price-info`,
    recoveryVehiclePrice: `${PREFIX_ON}${APIV1}/vehicleRescuePriceInfo`,
    dashboard: `${PREFIX_ON}${APIV1}/workbench`,
    takeVehiclePrice: `${PREFIX_ON}${APIV1}/vehicle-batch-price-info`,
    usedCarDrivingPrice: `${PREFIX_ON}/vehicle-used-diving-price`,
    carrierOfferPriceinfo: `${PREFIX_ON}${APIV1}/carrier-offer-priceinfo`,
    // transportInfo: 'http://10.3.10.92:8080/tms-boot-rest-0.0.1-SNAPSHOT/api/v1/transport-fixed-regular-info/get-region-list',
    checkButtonResource: `${PREFIX_ON}${APIV1}/role-user/check-button-resource`,

    deliverStorePrice: `${PREFIX_ON}${APIV1}/to-repo-price`,
    cityCenterInfo: `${PREFIX_ON}${APIV1}/city-centerInfo`,

  },
}
