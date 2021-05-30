let user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).user
  : "";

export const initialState = user ? {
    user_id: "" || user.user_id,
    email: "" || user.email,
    role: "" || user.role,
}: {
    user_id: "",
    email: "",
    role: "",
}

export const AuthReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_SUCCESS":
            return {
                user_id: "",
                email: action.email,
                role: "",
            }

        case "OTP_SUCCESS":
            return {
                user_id: action.user_id,
                email: action.email,
                role: action.role,
            }
        
        case "LOGOUT_SUCCESS":
            return {
                user_id: "",
                email: "",
                role: "",
            }

        default: 
            return state
    }
}