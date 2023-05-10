function compose(...funcs){
    if(funcs.length == 0)
        return x => x;
    if(funcs.length == 1)
        return funcs[0];
    return funcs.reduce((a,b) => a.bind(null, b(a)));
}