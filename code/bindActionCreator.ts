function bindActionCreator (creators, dispatch) {
    let bound = {}
    Object.keys(creators).map(key =>{
        const creator = creators[key];
        bound[key] = function(...args) {
            return dispatch(creator, args);
        }
    })
    return bound;
}

const action = bindActionCreator({
    ADD: (a, b) => a + b,
    SUB: (a, b) => a - b,
    MUL: (a, b) => a * b,
    DIV: (a, b) => a / b,
}, dispatch)

dispatch(action.ADD(3, 4)) // 7
