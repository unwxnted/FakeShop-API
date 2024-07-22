import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { getCookie } from "../../utils/cookies.jsx";

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {

        const token = getCookie('jwt');
        if(!token){
            window.location.href = '/signin';
        }

        fetch('http://localhost:3000/api/carts/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${getCookie('jwt')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const transformAndSortCart = (cartData) => {
                let transformedCart = [];

                cartData.forEach(order => {
                    const productId = order.product.id;

                    if (transformedCart[productId]) {
                        transformedCart[productId].quantity += order.quantity;
                    } else {
                        transformedCart[productId] = { ...order.product, quantity: order.quantity };
                    }
                });

                return transformedCart;
            };

            console.log(transformAndSortCart(data));
            setCart(transformAndSortCart(data));
            console.log(cart);
        })
        .catch(err => console.log(err));
    }, []);


    const pay = async () => {
        await fetch('http://localhost:3000/api/carts/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${getCookie('jwt')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setCart([]);
        })
        .catch(err => console.log(err));
    }

    const clearCart = async () => {
        await fetch('http://localhost:3000/api/carts/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${getCookie('jwt')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setCart([]);
        })
        .catch(err => console.log(err));
    }

    const deleteProduct = async (id) => {
        await fetch(`http://localhost:3000/api/carts/delete/product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${getCookie('jwt')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setCart(cart.filter(product => product.id !== id));
        })
        .catch(err => console.log(err));
    }

    let total = 0;
    cart.forEach(product => {
        total += product.price * product.quantity;
    });

    return (
        <div className="container-fluid bg-dark p-0 d-flex flex-column" style={{height: "100vh"}}>
            <Header />

            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <section className="bg-light text-center h-100" style={{width: "99.999%"}}>
                    <div className="container">
                        <h2 className="display-3 m-3 border border-dark rounded-pill">Cart</h2>
                        <div className="table-responsive m-5">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}</td>
                                            <td>${product.price}</td>
                                            <td>${product.price * product.quantity}</td>
                                            <td><button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Delete</button></td>
                                        </tr>
                                    ))}
                                    <tr> <td colSpan="6">Total: ${total}</td> </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-center">
                            {cart.length > 0 ? <button className="btn btn-primary m-2" onClick={pay}>Pay</button> : <button className="btn btn-primary disabled m-2">Pay</button>}
                            {cart.length > 0 ? <button className="btn btn-danger m-2" onClick={clearCart}>Clear cart</button> : <button className="btn btn-danger disabled m-2">Clear cart</button>}
                        </div>


                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Cart;
