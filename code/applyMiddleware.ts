function applyMiddleware(...middleware){
    return createStore =>(...args) =>{
        const store = createStore(...args);
        let {getState, dispatch} = store;
        const middlewareAPI = {
            getState,
            dispatch: (...args) => dispatch(...args)
        }
        const middlewareChain = middlewares.map(middleware => middlware(middlewareApi))
        dispatch = compose(...middlewareChanin)(dispatch)
        return {
            store,
            dispatch
        }
    }
}

