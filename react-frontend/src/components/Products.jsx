import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { getCookie } from "../../utils/cookies.jsx";

function Products() {
    const [totalProducts, setTotalProducts] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [selectedQuantities, setSelectedQuantities] = useState({});

    useEffect(() => {

        const token = getCookie('jwt');
        if(!token){
            window.location.href = '/signin';
        }

        fetch('http://localhost:3000/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${getCookie('jwt')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProducts(data);
                setTotalProducts(data.length);
            })
            .catch(err => console.log(err));
    }, []);

    const handleQuantityChange = (event, productId) => {
        const newSelectedQuantities = {...selectedQuantities};
        newSelectedQuantities[productId] = event.target.value;
        setSelectedQuantities(newSelectedQuantities);
    }

    const addToCart = (product) => {
        const quantity = selectedQuantities[product.id] || 1;
    
        fetch('http://localhost:3000/api/carts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${getCookie('jwt')}`
            },
            body: JSON.stringify({
                productId: product.id,
                quantity: parseInt(quantity)
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => console.log(err));
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className="container-fluid bg-dark p-0 d-flex flex-column" style={{
            height: "100vh"
        }}>
            <Header />

            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <section className="bg-light text-center" style={{
                    width: "99.999%"
                }}>
                    <div className="container">
                        <h2 className="display-3 m-3 border border-dark rounded-pill">Products</h2>
                        <div className="row justify-content-center">
                            {currentProducts.map((product, index) => (
                                <div className="col-md-4 col-sm-6 col-12 p-3 d-flex flex-column align-items-center" key={index}>
                                    <div className="card p-1 m-1 mt-4" style={{
                                        width: "18rem",
                                        height: "20rem",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                        <h1 className="card-title mb-1" style={{
                                            maxHeight: '5em',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>{product.name}</h1>
                                        <p className="card-text mb-1">{product.stock} in stock</p>
                                        <p className="card-text mb-1">${product.price}</p>
                                        <input type="number" className="form-control" id="quantity" name="quantity" placeholder="Quantity" onChange={(e) => handleQuantityChange(e, product.id)} />
                                        <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
                                    </div>
                                </div>
                            ))}
                            {currentProducts.length < productsPerPage && [...Array(productsPerPage - currentProducts.length)].map((_, index) => (
                                <div className="col-md-4 col-sm-6 col-12 p-3 d-flex flex-column align-items-center" key={`placeholder-${index}`}>
                                    <div className="card p-1 m-1 mt-4" style={{
                                        width: "18rem",
                                        height: "20rem",
                                        visibility: "hidden"
                                    }}>
                                        <h1 className="card-title mb-1">Placeholder</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="my-4">
                            <button className="btn btn-primary mx-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                            <button className="btn btn-primary mx-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(totalProducts / productsPerPage)}>Next</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Products;
