import React, { Component } from 'react';
import { connect } from 'react-redux';
import request from 'request';

import firestore from '../../firestore/Firestore';

import * as api from '../../constants/api';
import Header from '../UI/Header/Header';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import Ticket from './Ticket/Ticket';
import Button from '../UI/Button/Button';
import handleResponse from '../../utils/handleResponse';
import * as loader from '../../actionCreator/loader';
import { bindActionCreators } from 'redux'

import '../Page.css';
import './Profile.css';
import Loader from '../Loader/loader';

class Profile extends Component {
    componentDidMount() {
        this.props.showLoader();
        request({
            method: 'GET',
            url: api.GET_MY_PROFSHOWS,
            headers: {
                'Content-Type': 'application/json',
                'X-Wallet-Token': api.WALLET_TOKEN,
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'JWT '+this.props.jwt_token
            }
        }, (error, response, body) => {
            handleResponse(error, response, body, () => {
                try {
                    body = JSON.parse(body);
                    this.props.getUserTickets(body.shows);
                } catch (e) {
                    throw new Error(e.message || "");
                }
            })
        });

        firestore.doc('users/' + this.props.userId).onSnapshot((doc) => {
            if (doc && doc.exists) {
                const user = doc.data();
                this.props.updateBalanceAndTokens(user.total_balance, user.tokens)
            }
        });
    }

    signOutUser() {
        document.cookie = encodeURIComponent('_oalettknwasis19__') + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = encodeURIComponent('_oalettknwasis19__name')+ '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = encodeURIComponent('_oalettknwasis19__user_id') + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = encodeURIComponent('_oalettknwasis19__qr_code') + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = encodeURIComponent('_oalettknwasis19__referral_code') + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = encodeURIComponent('_oalettknwasis19__bitsian_id') + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.reload();
    }

    render() {
        let ticket;
        if(this.props.isLoading && !this.props.userTickets) {
            ticket = <Loader style={{height: '30%'}} />
        }
        else {
            ticket = <Ticket 
            userTickets={ this.props.userTickets }
            openBuyTicketHandler={ this.props.openBuyTicket } />
        }
        return (
            <div className='Profile Page'>
                <Header heading='Profile' subHeading='Order food using wallet'>
                    <i className="fa fa-sign-out LogOut" onClick={ this.signOutUser }></i>
                </Header>
                <ProfileInfo 
                    userName={ this.props.userName } 
                    userId={ this.props.userId } 
                    walletMoney={ this.props.userBalance } 
                    walletTokens={ this.props.userTokens } 
                    qrCode={ this.props.qrCode }
                    openQRcodeHandler={ this.props.openQRcode } />
                <div className='TransactionButtons' style={ (this.props.bitsianId !== "") ? null : {justifyContent: 'center'} }>
                    { (this.props.bitsianId !== "") ? <Button click={ this.props.openAddMoney }>Add Money</Button> : null }
                    <Button click={ this.props.openSendMoney }>Send Money</Button>
                </div>
                {ticket}
                
            </div>
        );
    }
}


const mapStateToProp = state => {
    return {
        jwt_token: state.auth.jwt_token,
        userName: state.auth.userName,
        userId: state.auth.userId,
        qrCode: state.auth.qrCode,
        referralCode: state.auth.referralCode,
        bitsianId: state.auth.bitsianId,
        userTickets: state.userTickets.userTickets,
        userBalance: state.auth.userBalance,
        userTokens: state.auth.userTokens,
        isLoading: state.loader.isLoading
    };
};

const mapDispatchToProp = dispatch => {
    const action = bindActionCreators(Object.assign({}, loader), dispatch);
    return {
        ...action,
        openQRcode: () => dispatch({ type: 'OPEN_QRCODE' }),
        openSendMoney: () => dispatch({ type: 'OPEN_SEND_MONEY' }),
        openAddMoney: () => dispatch({ type: 'OPEN_ADD_MONEY' }),
        openBuyTicket: () => dispatch({ type: 'OPEN_BUY_TICKET' }),
        getUserTickets: (tickets) => dispatch({ type: 'GET_USER_TICKETS', payload: tickets }),
        updateBalanceAndTokens: (balance, tokens) => dispatch({ type: 'UPDATE_REALTIME_DATA', balance, tokens }),
    };
}

export default connect(mapStateToProp, mapDispatchToProp)(Profile);