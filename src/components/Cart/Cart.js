import React, { Component } from 'react';

import Header from '../UI/Header/Header';

import '../Page.css';

class Cart extends Component {
    render() {
        return (
            <div className='Cart Page'>
                <Header heading='Cart' subHeading='Know your current orders'>
                </Header>
            </div>
        );
    }
}

export default Cart;