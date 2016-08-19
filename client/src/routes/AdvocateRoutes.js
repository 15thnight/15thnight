/* Routes for advocate users */
import {
    AdvocateAlertHistoryPage,
    AlertFormPage
} from 'pages/advocate';


const childRoutes = [
    { path: '/'              , component: AlertFormPage },
    { path: '/alert-form'    , component: AlertFormPage },
    { path: '/alert-history' , component: AdvocateAlertHistoryPage }
]

export default { childRoutes }