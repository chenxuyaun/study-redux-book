let finalReducers;
function combineReducers(reducers){
    const reducersKeys = Object.keys(reducers)
    finalReducers = {}
    for (let i = 0; i < reducersKeys.length; i++) {
        if(typeof reducers[i] === 'function'){
            finalReducers[i] = reducers[i];
        }
    }
    const finalReducersKeys = Object.keys(finalReducers)
    return function combination(state = {}, action) {
        for (let i = 0; i < finalReducersKeys.length; i++) {
            const key = finalReducersKeys[i]
            if (key === action.type) {
                return {...state,...finalReducers[key](state[key], action) }
            }
        }
        return state;
    }
} 