function createStore(reducer, enhancer){
    // enhancer是一个高阶函数，用于增强store功能。该函数接收一个已经存在的createStore函数作为参数，然后返回一个新的createStore函数。  
    if(enhancer){
        enhancer(createStore)(reducer);
    }
    // 这就算前面提到的store管理的state
    let currentState = {};
    // 这是前面提到的为store添加监听函数
    let currentListener = [];
    function subscribe(func: any){
        currentListener.push(func);
        return func;
    }
    function dispatch(action){
        currentState = reducer(currentState, action);
        // call all listener functions
        currentListener.forEach((func: (data:any)=>void) => func(currentState));
    }
    return {
        subscribe:subscribe,
        dispatch:dispatch,
        // 注意，这里是使用函数返回的，
        getState: () => currentState,
    };
}