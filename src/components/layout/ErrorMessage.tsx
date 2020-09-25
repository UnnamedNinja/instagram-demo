import React from 'react'


type BackgroundProps = {
    text: string
}


const Background = (props: BackgroundProps) => {
    return (
        <main>
            <div className="background">
                <div className="error-img-wrapper text-center">
                    <img src="/img/error.png" alt="logo"/>
                </div>
                <h2 className="text-center">{props.text}</h2>
                <p className="text-center">You will be redirected to login page.</p>
            </div>
        </main>
    )
}



export default Background