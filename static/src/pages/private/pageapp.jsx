import React from 'react';

export default function PageApp({ authenticated }) {

    return (
        <>
            {authenticated &&
                <div class="container">
                    <div class="row">
                        <div class="col">App</div>
                    </div>
                </div>
            }
        </>
    )
}