import request from 'request';
import handleResponse from '../utils/handleResponse';
import * as api from '../constants/api';
import * as auth from '../store/actions/auth';

export const changeLoginStatus = (isLoggedIn, JWT, userName, userId, qrCode, referralCode, bitsianId) => (dispatch, getState) => {

    if (isLoggedIn) {
      
    }
    dispatch({
      type: auth.SET_LOGIN,
      isLoggedIn, JWT, userName, userId, qrCode, referralCode, bitsianId
    });
}

export const googleLogin = id => (dispatch, getState) => {
    request({
      method: 'POST',
      url: api.LOGIN,
      headers: {
        'Content-Type': 'application/json',
        'X-Wallet-Token': api.WALLET_TOKEN,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id_token: id
      })
    }, (error, response, body) => {
      handleResponse(error, response, body, () => {
        try {
          body = JSON.parse(body)
          dispatch(changeLoginStatus(true, body.JWT, body.name, body.user_id, body.qr_code, body.referral_code, body.bitsian_id))
        } catch (e) {
          throw new Error(e.message || "");
        }
      })
    });
}


export const login = (username, password) => (dispatch, getState) =>{
    request({
        method: 'POST',
        url: api.LOGIN,
        headers: {
            'Content-Type': 'application/json',
            'X-Wallet-Token': api.WALLET_TOKEN,
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            username, password
        })
    }, (error, response, body) => {
        handleResponse(error, response, body, () => {
            try {
                body = JSON.parse(body);
                console.log(body)
                dispatch(changeLoginStatus(true, body.JWT, body.name, body.user_id, body.qr_code, body.referral_code, body.bitsian_id))
            } catch (e) {
                throw new Error(e.message || "");
            }
        })
    });
}