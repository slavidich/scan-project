const accessToken = localStorage.getItem('accessToken')

const initialState={
    isAuth: accessToken? true:false,
}

function authReduce(state=initialState, action){
    switch(action.type){
        case 'LOGIN_SUCCESS':
            return {...state, isAuth:true}
        case 'LOGOUT':
            return {...state, isAuth:false}
        default:
            return state;
    }
}

export default authReduce