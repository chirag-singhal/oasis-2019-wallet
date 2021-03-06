import React from 'react';
import QRCode from 'qrcode-react';

import './ProfileInfo.css';

const profileInfo = (props) => {
    return (
        <div className='ProfileInfo'>
            <div className='UserInfo'>
                <div className='UserName'>{ props.userName }</div>
                <div className='UserId'>User Id: { props.userId }</div>
                <div className='WalletInfo'>
                    <div className='WalletMoney'>
                        <div>&#8377;{ props.walletMoney }</div>
                        Wallet(Stalls)
                    </div>
                    <div className='WalletTokens'>
                        <div>{ props.walletTokens }</div>
                        Token
                    </div>
                </div>
            </div>
            <div className='QRCode' onClick={ props.openQRcodeHandler }>
                <QRCode value={ props.qrCode } bgColor="#ffffff" fgColor="#000000" size={70} />
            </div>
        </div>
    )
}

export default profileInfo;