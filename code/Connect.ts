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
