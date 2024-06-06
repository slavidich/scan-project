const accessToken = localStorage.getItem('accessToken')

const initialState={
    isAuth: accessToken? true:false,
    showModal: false
}

function authReduce(state=initialState, action){
    switch(action.type){
        case 'LOGIN_SUCCESS':
            return {...state, isAuth:true, showModal: false}
        case 'LOGOUT':
            return {...state, isAuth:false}
        case 'SHOW_MODAL':
            return {...state, showModal:true }
        case 'HIDE_MODAL':
            return {...state, showModal:false}
        default:
            return state;
    }
}

export default authReduce