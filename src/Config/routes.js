import Admin from "../Admin";
import CreateElection from "../Components/CreateElectionDialog";
import Header from "../Components/Header";
import EditElection from "../EditElection";
import Login from "../Login";
import OTP from "../OTP";
import ResetPassword from "../ResetPassword";
import SetPassword from "../SetPassword";
import ViewElection from "../ViewElection";
import WS from "../WS";

const routes = [
    {
        path: "/",
        component: Login
    },
    {
        path: "/otp",
        component: OTP
    },
    {
        path: "/resetpassword/:token",
        component: ResetPassword
    },
    {
        path: "/verify/:token",
        component: SetPassword
    },
    {
        path: "/admin",
        component: Admin
    },
    {
        path: "/header",
        component: Header
    },
    {
        path: "/election",
        component: CreateElection,
    },
    {
        path: "/ws",
        component: WS,
    },
    {
        path: "/edit",
        component: EditElection,
    },
    {
        path: "/view/:id",
        component: ViewElection,
    },
]

export default routes