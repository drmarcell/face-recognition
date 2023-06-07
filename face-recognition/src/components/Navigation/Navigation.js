import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {

    if (isSignedIn) {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p
                    onClick={() => onRouteChange('signout')}
                    className='f3 link dim white underline pa3 pointer'>
                    Logout
                </p>
            </nav>
        )
    } else {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p
                    onClick={() => onRouteChange('signin')}
                    className='f3 link dim white underline pa3 pointer'>
                    Login
                </p>
                <p
                    onClick={() => onRouteChange('register')}
                    className='f3 link dim white underline pa3 pointer'>
                    Registration
                </p>
            </nav>
        )
    }
}

export default Navigation;