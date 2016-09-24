/* Routes for advocate users */
import {
    AdvocateAlertHistoryPage,
    AlertFormPage,
    ViewResponsesPage
} from 'pages/advocate';


const childRoutes = [
    { path: '/'                   , component: AlertFormPage },
    { path: '/alert-form'         , component: AlertFormPage },
    { path: '/alert-history'      , component: AdvocateAlertHistoryPage },
    { path: '/view-responses/:id' , component: ViewResponsesPage}
]

export default { childRoutes }