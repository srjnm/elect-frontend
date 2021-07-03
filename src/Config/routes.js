import Admin from "../Admin";
import EditElection from "../EditElection";
import EnrollCandidate from "../EnrollCandidate";
import Login from "../Login";
import Logout from "../Logout";
import OTP from "../OTP";
import ResetPassword from "../ResetPassword";
import Results from "../Results";
import SetPassword from "../SetPassword";
import Student from "../Student";
import ViewElection from "../ViewElection";
import Voting from "../Voting";
import VotingPreview from "../VotingPreview";

const routes = [
    {
        path: "/logout",
        component: Logout,
        needsAuth: true,
        forSuperAdmin: true,
        title: "Logout",
    },
    {
        path: "/edit",
        component: EditElection,
        needsAuth: true,
        forAdmin: true,
        title: "Edit Election",
    },
    {
        path: "/view",
        component: ViewElection,
        needsAuth: true,
        title: "View Election",
    },
    {
        path: "/result",
        component: Results,
        needsAuth: true,
        title: "Results",
    },
    {
        path: "/candidate",
        component: EnrollCandidate,
        needsAuth: true,
        forStudent: true,
        title: "Enroll Candidate",
    },
    {
        path: "/preview",
        component: VotingPreview,
        needsAuth: true,
        forStudent: true,
        title: "Preview",
    },
    {
        path: "/vote",
        component: Voting,
        needsAuth: true,
        forStudent: true,
        title: "Voting",
    },
    {
        path: "/admin",
        component: Admin,
        needsAuth: true,
        forAdmin: true,
        title: "Dashboard",
    },
    {
        path: "/student",
        component: Student,
        needsAuth: true,
        forStudent: true,
        title: "Dashboard",
    },
    {
        path: "/otp",
        component: OTP,
        isOTP: true,
        title: "Enter OTP",
    },
    {
        path: "/resetpassword/:token",
        component: ResetPassword,
        title: "Reset Password",
    },
    {
        path: "/verify/:token",
        component: SetPassword,
        title: "Set Password",
    },
    {
        path: "/",
        component: Login,
        isLogin: true,
        title: "ELECT | Login",
    }
]

export default routes