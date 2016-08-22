/* Routes for anonymous users */
import {
    LoginPage,
    ForgotPasswordPage,
    ResetPasswordPage
} from 'pages/external'


const childRoutes = [
    { path: '/'                             , component: LoginPage },
    { path: '/login'                        , component: LoginPage },
    { path: '/forgot-password'              , component: ForgotPasswordPage },
    { path: '/reset-password/:email/:token' , component: ResetPasswordPage }
]

export default { childRoutes }