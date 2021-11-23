import React from 'react';

export default function Account({ authenticated }) {

    return (
        <>
            {authenticated &&
                <div class="container">
                    <div class="row">
                        <div class="col">Account</div>
                    </div>
                </div>
            }
        </>
    )
}