import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import routes from "./Config/routes.js"
import AuthContextProvider from "./Context/AuthContext.js"
import { createMuiTheme, ThemeProvider } from "@material-ui/core"

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
    return (
        <ThemeProvider theme={ theme }>
            <AuthContextProvider>
                <Router>
                    <Switch>
                        {routes.map((route) => (
                            <Route
                                exact
                                key={ route.path }
                                path={ route.path }
                                component={ route.component }
                            />
                        ))}
                    </Switch>
                </Router>
            </AuthContextProvider>
        </ThemeProvider>
    );
}
 
export default App;
