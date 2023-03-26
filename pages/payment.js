import React from "react";

const Success = (props) => {
    React.useEffect(() => {
        //close window if transaction is successful
        if (props.status === "success") {
            window.close();
        }
    }, [props]);
    return (
        <div>
            <h1>Transaction ID: {props.data.transactionId}</h1>
        </div>
    );
}

export async function getServerSideProps({ query, req }) {
    const baseUrl = process.env.NODE_ENV === 'development' ? `http://${req.headers.host}` : `https://${req.headers.host}`;
    const checkoutId = query.checkoutId;
    console.log('checkoutId: ', checkoutId);
    return {
        props: {
            data: {
                transactionId: checkoutId
            },
            status: 'success'
        }
    }
    // console.log('success order: ', orderId);
    // const response = await fetch(`${baseUrl}/api/viewOrder?orderId=${orderId}`);
    // const orderData = await response.json();
    // console.log('success data: ', orderData);
    // if (orderData.data.status === 'completed') {
    //     const updateTransaction = await fetch(`${orderData.data.domain}/api/updateTransaction?id=${orderData.data.transactionId}`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': `Bearer ${tmblApiKey}`
    //             },
    //         });
    //     const updateTransactionData = await updateTransaction.json();
    //     console.log('updateTransactionData: ', updateTransactionData);
    //     return {
    //         props: {
    //             data: orderData.data,
    //             status: 'success'
    //         }
    //     }
    // }
    // else {
    //     return {
    //         props: {
    //             data: orderData.data
    //         }
    //     }
    // }
}

export default Success;