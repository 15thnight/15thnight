/* Routes for advocate users */
import {
    AdvocateAlertHistoryPage,
    AlertFormPage,
    ViewResponsesPage
} from 'pages/advocate';


const childRoutes = [
    { path: '/'                   , component: AlertFormPage },
    { path: '/send-alert'         , component: AlertFormPage },
    { path: '/alert-history'      , component: AdvocateAlertHistoryPage },
    { path: '/view-responses/:id' , component: ViewResponsesPage}
]

export default { childRoutes }