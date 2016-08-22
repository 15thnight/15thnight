/* Routes for provider users */
import {
    ProviderActiveAlertsPage,
    RespondToPage
} from 'pages/provider';


const childRoutes = [
    { path: '/'               , component: ProviderActiveAlertsPage },
    { path: '/active-alerts'  , component: ProviderActiveAlertsPage},
    { path: '/respond-to/:id' , component: RespondToPage }
]

export default { childRoutes }