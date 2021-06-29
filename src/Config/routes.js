import Admin from "../Admin";
import AdminResults from "../AdminResults";
import CreateElection from "../Components/CreateElectionDialog";
import Header from "../Components/Header";
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
import VotingPreview from "../VotingPreview";
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
        path: "/view",
        component: ViewElection,
    },
    {
        path: "/results",
        component: AdminResults,
    },
    {
        path: "/result",
        component: Results,
    },
    {
        path: "/candidate",
        component: EnrollCandidate,
    },
    {
        path: "/student",
        component: Student,
    },
    {
        path: "/enroll",
        component: EnrollUpload,
    },
    {
        path: "/preview",
        component: VotingPreview,
    }
]

export default routes