import Admin from "../Admin";
import EditElection from "../EditElection";
import EnrollCandidate from "../EnrollCandidate";
import EnrollUpload from "../EnrollUpload";
import Login from "../Login";
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
        path: "/edit",
        component: EditElection,
        needsAuth: true,
        forAdmin: true,
    },
    {
        path: "/view",
        component: ViewElection,
        needsAuth: true,
    },
    {
        path: "/result",
        component: Results,
        needsAuth: true,
    },
    {
        path: "/candidate",
        component: EnrollCandidate,
        needsAuth: true,
        forStudent: true,
    },
    {
        path: "/enroll",
        component: EnrollUpload,
        needsAuth: true,
        forStudent: true,
    },
    {
        path: "/preview",
        component: VotingPreview,
        needsAuth: true,
        forStudent: true,
    },
    {
        path: "/vote",
        component: Voting,
        needsAuth: true,
        forStudent: true,
    },
    {
        path: "/admin",
        component: Admin,
        needsAuth: true,
        forAdmin: true,
    },
    {
        path: "/student",
        component: Student,
        needsAuth: true,
        forStudent: true,
    },
    {
        path: "/otp",
        component: OTP,
        isOTP: true,
    },
    {
        path: "/resetpassword/:token",
        component: ResetPassword,
    },
    {
        path: "/verify/:token",
        component: SetPassword,
    },
    {
        path: "/",
        component: Login,
        isLogin: true,
    },
]

export default routes