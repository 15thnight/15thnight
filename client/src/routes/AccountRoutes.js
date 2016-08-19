/* Routes for all logged in users */
import {
    EditProfilePage,
    ChangePasswordPage,
    LogoutPage
} from 'pages/account';


const childRoutes = [
    { path: '/edit-profile'   , component: EditProfilePage },
    { path: '/change-password', component: ChangePasswordPage },
    { path: '/logout'         , component: LogoutPage }
]

export default { childRoutes }