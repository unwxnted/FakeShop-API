import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Products() {
    const [pagination, setPagination] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setTotalProducts(data.length);
            })
            .catch(err => console.log(err));
    }, []);

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
                    width: "95%"
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
                                        }}>{product.title}</h1>
                                        <p className="card-text mb-1">{product.stock} in stock</p>
                                        <p className="card-text mb-1">${product.price}</p>
                                        <button className="btn btn-primary">Add to Cart</button>
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
