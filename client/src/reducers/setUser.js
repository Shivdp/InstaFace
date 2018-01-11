function setUser(state = {name: '', email: ''}, action) {
        switch (action.type) { 
            case 'CHANGE_NAME':
                return {
                    name: action.name, 
                    email: action.email
                }
                break; 
            case 'LOGOUT': 
                return {name: '', email: ''}
                break; 
        }
        return state; 
    }
    
    
    
    export default setUser;