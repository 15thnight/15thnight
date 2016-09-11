/* Routes for anonymous users */
import {
    LoginPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    RespondToRedirect
} from 'pages/external'


const childRoutes = [
    { path: '/'                             , component: LoginPage },
    { path: '/login'                        , component: LoginPage },
    { path: '/forgot-password'              , component: ForgotPasswordPage },
    { path: '/reset-password/:email/:token' , component: ResetPasswordPage },
    { path: '/respond-to/:alertId'          , component: RespondToRedirect }
]

export default { childRoutes }