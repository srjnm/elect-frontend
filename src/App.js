import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom"
import routes from "./Config/routes.js"
import AuthContextProvider from "./Context/AuthContext.js"
import { createMuiTheme, ThemeProvider } from "@material-ui/core"
import isAdmin from "./Utils/isAdmin.js"
import isStudent from "./Utils/isStudent.js"
import isAuthenticated from "./Utils/isAuthenticated.js"

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#60b7e9',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#f25050'
        },
    },
})

const App = () => {
    const RenderRoute = (route) => {
        const history = useHistory()

        document.title = route.title || "ELECT";

        if(route.isLogin && isAdmin()) {
            history.push("/admin")
        }

        if(route.isLogin && isStudent()) {
            history.push("/student")
        }

        if(route.isOTP && isAdmin()) {
            history.push("/admin")
        }

        if(route.isOTP && isStudent()) {
            history.push("/student")
        }

        if(route.needsAuth && !isAuthenticated()) {
            history.push("/")
        }

        if(route.forAdmin && !isAdmin()) {
            history.push("/")
        }

        if(route.forStudent && !isStudent()) {
            history.push("/")
        }

        return (
            <Route
                exact
                path={ route.path }
                component={ route.component }
            />
        )
    }

    return (
        <ThemeProvider theme={ theme }>
            <AuthContextProvider>
                <Router>
                    <Switch>
                        {routes.map((route) => (
                            <RenderRoute {...route} />
                        ))}
                    </Switch>
                </Router>
            </AuthContextProvider>
        </ThemeProvider>
    );
}
 
export default App;
