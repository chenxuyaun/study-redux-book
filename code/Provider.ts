import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Provider extends Component {
    store: any
    props: any

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
