## Redux学习笔记
学习转载xiaofeng123aazz老师的[redux原理是什么](https://blog.csdn.net/xiaofeng123aazz/article/details/127082218)
>简单设计了一个思维导图：[redux](https://www.mindnow.cn/share/d1e751e1)
### redux的核心原理
1. 将应用的状态统一放到state中，由store来管理state。
2. reducer的作用是返回一个新的state去更新store中对用的state。
3. 按redux的原则,UI层每一次状态的改变都应通过action去触发，action传入对应的reducer 中，reducer返回一个新的state更新store中存放的state，这样就完成了一次状态的更新
4. subscribe是为store订阅监听函数，这些订阅后的监听函数是在每一次dipatch发起后依次执行
5. 可以添加中间件对提交的dispatch进行重写

### redux的api
1. createStore 创建仓库，接受reducer作为参数
2. bindActionCreator 绑定store.dispatch和action 的关系
3. combineReducers 合并多个reducers
4. applyMiddleware 洋葱模型的中间件,介于dispatch和action之间，重写dispatch
5. compose 整合多个中间件

#### enhancer说明
在Redux中，createStore函数是用来创建store对象的方法，我们可以通过createStore函数创建具有特定状态的Redux store对象。该方法有三个参数：reducer、preloadedState和enhancer，其中enhancer是可选参数，表示store的增强器。

enhancer是一个高阶函数，用于增强store功能。该函数接收一个已经存在的createStore函数作为参数，然后返回一个新的createStore函数。具体来说，增强器会在createStore函数的基础上添加一些额外的功能，而不需要修改原有的功能。

常见的enhancer包括applyMiddleware和compose：

+ applyMiddleware：用于增强store的中间件，例如日志记录、异步处理等。
+ compose：用于组合多个增强器，让它们能够协同工作。

例子：
```
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const storeEnhancers = applyMiddleware(thunkMiddleware);

const store = createStore(rootReducer, storeEnhancers);

export default store;
```
代码解释：
通过applyMiddleware和thunkMiddleware添加了Redux Thunk中间件，使store支持异步的处理。这里的storeEnhancers就是一个增强器，用于增强store的功能。
#### redux-thunk说明
>redux-thunk 中间件是一种能够处理异步操作的工具，它允许您将异步操作封装成函数，并将这些函数与dispatch函数一起使用。在Redux中，普通的action creator只能返回一个action对象（或者没返回任何东西），而thunk允许您的action creator返回一个函数。

>当dispatch一个函数时， redux-thunk会在函数执行时拦截这个action，并使其执行该函数。这样，您就可以在action creator中进行异步处理，例如向服务器发送请求、等待一段时间、或者执行一些Promise等异步操作。在异步操作完成后，您可以再次调用dispatch，并将结果传递给reducer，以更新应用程序的状态。

示例
```
export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch(fetchProductsRequest());
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      dispatch(fetchProductsSuccess(data));
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
    }
  };
};
```
>说明：使用try-catch语句来捕捉可能出现的错误。当我们传递一个异步action给dispatch函数时，redux-thunk会将dispatch函数作为第二个参数传递给thunk函数。这样，我们就可以在异步操作完成时再次调用dispatch函数，将数据传递给reducers以进行处理。

#### createStore
```
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
```
> 说明：createStore并没有直接返回store中存放的state，而是返回一个函数getState来获取state，当我们调用getState去获取state时，需要返回一个state的复制品，也就是需要返回一个深拷贝state之后对象，这样可以避免state值的非法篡改，因为如何直接返回state的话，只需通过state[key] = xxxx就能对state进行修改，违背了redux只能通过dispatch(action)去更新state
#### bindActionCreator
```
function bindActionCreator (creators, dispatch) {
    let bound = {}
    Object.keys(creators).map(key =>{
        const creator = creators[key];
        bound[key] = (..args) => dispatch(creator(...args))
    })
    return bound
}
```
> bindActionCreator是为action函数外面包一层dispatch，这样在进行action发起时无需再手动dispatch了
#### combineReducers
```
function combineReducers (reducers) {
    const reducersKeys = Object.keys(reducers),
    finalReducers = {}
    for (let i = 0; i < reducerKeys.length; i++) {
        if (typeof reducers[i] === 'function') {
            finalReducers[i] = reducers[i]
        }
    }
    const finalReducersKeys = Object.keys(finalReducers)
    return function combination (state={}, action) {
        let hasChanged = false,
            nextState = {}
        for (let i = 0; i < finalReducersKeys.length; i++) {
            const key = finalReducersKeys[i],
            reducer = finalReducers[key],
            preStateKeys = state[key],
            nextStateKeys = reducer(preState, action),
            nextState[key] = nextStateKeys
            hasChanged = hasChanged || preStateKeys !== nextStateKeys
        }
        return hasChanged ? nextState : state
    }
}
```
### applyMiddleware
```
function applyMiddleware (...middlewares) {
    return createStore => (...args) => {
        const store = createStore(...args)
        let { getState, dispatch } = store
        const middlewateApi = {
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

```
#### compose
```
function compose (...funcs) {
    if(funcs.length === 0) {
        return args => args
    }
    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce( (ret, item) => (...args) => ret(item(...args)) )
}

```
>compose是整合多个中间件的情况，这里使用reduce对用传入的中间件进行累加执行
## react-redux
>react组件中实现对store中的state进行获取、修改、监听.
>createStore会给我们返回getState、dispatch、subscribe来进行获取state、修改state、监听state变化，而我们现在要做的就是把这个三个函数传递给react组件。
### react-redux的核心原理
1. 将Provider高阶组件包裹在组件的最外层，并且将创建的store传入Provider高阶组件中，
然后再Provider高阶组件内部获取传入的store并将它添加到Provider高阶组件的context上下文中，context是react组件特有的一种不用手动一层层传递props就能在组件树中传递数据的方式，这样就实现了store相对于react组件的全局化，所有组件都能对store进行修改，获取，监听了
2. 虽然Provider下的组件都拥有可以操作store的能力了，但是由于倘若我们要在每一个组件都从context中去获取store会造成大量代码冗余，还有一点就是即使你能在react组件中能够操作store了，但是当你dispatch一个action之后，store中的state虽然更新了，但是并不会触发组件中的render函数去渲染新的数据，所以我们就需要通过react-redux另一个高阶组件connect
来做集中处理。connect组件接受一个component组件返回一个新的component组件，在connect最终返回的组件中获取store并将store设置为当前组件的state，并且在connect返回的组件中的componentDidMount周期函数中调用subscribe给store绑定监听函数，而这个监听函数就是负责当前store中的state发生改变时，通过this.setState来触发组件的render函数的调用，最终达到store中的state与UI中state同步的问题。
#### Provider
```
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Provider extends Component {

    constructor (props) {
        super(props)
        this.store = props.store
    }

    static propTypes = {
        store: PropTypes.object
    }

    getChildContext () {
        return { store: this.store }
    }

    render () {
        return this.props.children
    }
}

```
#### connect
```
import React, { Component } from 'react'
import PropTyeps from 'prop-types'
import { bindActionCreator } from 'redux'

const connect = (mapStateToProps, dispatchStateToProps) => (WrapperComponent) => class Connect extends Component {

    construtor (props, context) {
        super(props, context)
        this.store = context.store
        this.state = {
            props: {}
        }
    }

    static contextTypes = {
        store: PropTypes.object
    }

    componentDidMount () {
        this.store.subscribe(this.update)
        this.update()
    }

    update = () => {
        const { getState, dispatch } = this.store
        const stateProps = mapStateToProps(getState())
        const dispatchProps = bindActionCreator(dispatchStateToProps, dispatch)
        this.setState({
            ...this.state.props,
            ...stateProps,
            ...dispatchProps,
        })
    }

    render () {
        const { props } = this.state
        return <WrapperComponent {...props} />
    }
}

```