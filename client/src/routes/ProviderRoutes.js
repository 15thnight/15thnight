/* Routes for provider users */
import {
    ProviderActiveAlertsPage,
    ProviderAllAlertsPage,
    ProviderHelpPage,
    ProviderRespondedAlertsPage,
    RespondToPage
} from 'pages/provider';


const childRoutes = [
    { path: '/'                  , component: ProviderActiveAlertsPage },
    { path: '/active-alerts'     , component: ProviderActiveAlertsPage },
    { path: '/all-alerts'        , component: ProviderAllAlertsPage },
    { path: '/responded-alerts'  , component: ProviderRespondedAlertsPage },
    { path: '/r/:id'             , component: RespondToPage },
    { path: '/respond-to/:id'    , component: RespondToPage },
    { path: '/help'              , component: ProviderHelpPage }
]

export default { childRoutes }