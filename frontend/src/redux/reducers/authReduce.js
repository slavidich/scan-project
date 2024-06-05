const username = localStorage.getItem('username')

const initialState={
    isAuth: username? true:false,
    showModal: false
}

function authReduce(state=initialState, action){
    switch(action.type){
        case 'LOGIN_SUCCESS':
            return {...state, isAuth:true}
        case 'LOGOUT':
            localStorage.removeItem('username');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expire');
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