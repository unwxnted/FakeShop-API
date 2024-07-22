import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { getCookie } from "../../utils/cookies.jsx";

function Admin() {

    const adminToken = getCookie('jwt');
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [promoteMessage, setPromoteMessage] = useState("");
    const [demoteMessage, setDemoteMessage] = useState("");
    const [searchProductData, setSearchProductData] = useState([]);
    const [updateDisplay, setUpdateDisplay] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [createMessage, setCreateMessage] = useState("");


    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!adminToken) {
                setIsAdmin(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': adminToken
                    }
                }).then(res => res.json());
                if (response.admin == true) setIsAdmin(true);
                else setIsAdmin(false);

                if (response.admin == false) window.location.href = '/';

            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [adminToken]);

    const handlePromote = async (e) => {
        e.preventDefault();
        const id = document.querySelector('#id-promote').value;
        fetch('http://localhost:3000/api/users/promote/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPromoteMessage("promoted user successfully");
            })
            .catch(err => console.log(err));
    }

    const handleDemote = async (e) => {
        e.preventDefault();
        const id = document.querySelector('#id-demote').value;
        fetch('http://localhost:3000/api/users/demote/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setDemoteMessage("demoted user successfully");
            })
            .catch(err => console.log(err));
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        fetch('http://localhost:3000/api/users/search/' + username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setSearchData(data);
            })
            .catch(err => console.log(err));
    }

    const handleSearchProduct = async (e) => {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        fetch('http://localhost:3000/api/products/search/' + name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setSearchProductData(data);
            })
            .catch(err => console.log(err));
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        const name = document.querySelector('#name-product').value;
        const stock = document.querySelector('#stock').value;
        const price = document.querySelector('#price').value;
        fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            },
            body: JSON.stringify({
                name,
                stock: parseInt(stock),
                price: parseFloat(price)
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                document.querySelector('#name-product').value = "";
                document.querySelector('#stock').value = "";
                document.querySelector('#price').value = "";
                setCreateMessage("created product successfully");
            })
            .catch(err => console.log(err));
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateDisplay(!updateDisplay);
    }

    const handleUpdateProduct = async (e, id) => {
        e.preventDefault();
        const name = document.querySelector('#name-product').value;
        const stock = document.querySelector('#stock').value;
        const price = document.querySelector('#price').value;
        fetch('http://localhost:3000/api/products/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            },
            body: JSON.stringify({
                id,
                name,
                stock: parseInt(stock),
                price: parseFloat(price)
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setUpdateDisplay(false);
                setUpdateMessage("updated product successfully");
            })
            .catch(err => console.log(err));
    }

    const handleDeleteProduct = async (e, id) => {
        e.preventDefault();
        fetch('http://localhost:3000/api/products/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${adminToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                document.querySelector('#name').value = "";
                setSearchProductData([]);
                setDeleteMessage("deleted product successfully");
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="container-fluid bg-dark p-0 d-flex flex-column" style={{ height: "100vh" }}>
            <Header />

            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <section className="bg-light text-center h-100" style={{ width: "99.999%" }}>
                    <div className="container">
                        <h2 className="display-3 m-3 border border-dark rounded-pill">Admin</h2>
                        <div className="row justify-content-center">
                            <div className="col-md-4 col-sm-6 col-12 p-3 d-flex flex-column align-items-center">
                                <div className="card p-1 m-1 mt-4" style={{
                                        width: "200%",
                                        height: "18rem",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                    <h1 className="card-title">Search User</h1>
                                    <form>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">username</label>
                                            <input type="text" className="form-control" id="username" name="id" placeholder="Enter the username" />
                                        </div>
                                        <button type="submit" className="btn btn-primary" onClick={handleSearch}>Search</button>
                                    </form>
                                    <div>
                                        {searchData.map((user, index) => (
                                            <div key={index} className="mt-2">
                                                <h3>{user.name}</h3>
                                                <p>ID: {user.id}</p>
                                                <p>name: {user.name}</p>
                                                <p>admin: {user.admin ? "true" : "false"}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="card p-1 m-1 mt-4" style={{
                                        width: "200%",
                                        height: "18rem",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                    <h1 className="card-title">Promote User</h1>
                                    <form>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">id</label>
                                            <input type="text" className="form-control" id="id-promote" name="id" placeholder="Enter the id" />
                                        </div>
                                        <button type="submit" className="btn btn-primary" onClick={handlePromote}>Promote</button>
                                        <p>{promoteMessage}</p>
                                    </form>
                                </div>
                                <div className="card p-1 m-1 mt-4" style={{
                                        width: "200%",
                                        height: "18rem",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                    <h1 className="card-title">Demote User</h1>
                                    <form>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">id</label>
                                            <input type="text" className="form-control" id="id-demote" name="id" placeholder="Enter the id" />
                                        </div>
                                        <button type="submit" className="btn btn-primary" onClick={handleDemote}>Demote</button>
                                        <p>{demoteMessage}</p>
                                    </form>
                                </div>
                                <div className="card p-1 m-1 mt-4" style={{
                                        width: "200%",
                                        height: "18rem",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                    <h1 className="card-title">Search Product</h1>
                                    <form>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">name</label>
                                            <input type="text" className="form-control" id="name" name="id" placeholder="Enter the name" />
                                        </div>
                                        <button type="submit" className="btn btn-primary" onClick={handleSearchProduct}>Search</button>
                                    </form>
                                    <div>
                                        {searchProductData.map((product, index) => (
                                            <div key={index} className="mt-2">
                                                <h3>{product.name}</h3>
                                                <p>ID: {product.id}</p>
                                                <p>name: {product.name}</p>
                                                <p>stock: {product.stock}</p>
                                                <p>price: {product.price}</p>
                                                <button type="submit" className="btn btn-primary" onClick={handleUpdate}>Update</button>
                                                {updateDisplay && <form>
                                                    <div className="form-group m-3">
                                                        <label htmlFor="name">name</label>
                                                        <input type="text" className="form-control" id="name-product" name="name" placeholder="Enter the name" />
                                                    </div>
                                                    <div className="form-group m-3">
                                                        <label htmlFor="name">stock</label>
                                                        <input type="number" className="form-control" id="stock" name="stock" placeholder="Enter the stock" />
                                                    </div>
                                                    <div className="form-group m-3">
                                                        <label htmlFor="name">price</label>
                                                        <input type="number" className="form-control" id="price" name="price" placeholder="Enter the price" />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary m-1" onClick={(e) => handleUpdateProduct(e, product.id)}>Update</button>
                                                    {updateMessage && <p>{updateMessage}</p>}
                                                </form>}
                                                <button type="submit" className="btn btn-danger m-1" onClick={(e) => handleDeleteProduct(e, product.id)}>Delete</button>
                                                {deleteMessage && <p>{deleteMessage}</p>}
                                            </div>

                                        ))}
                                    </div>
                                </div>
                                <div className="card p-1 m-1 mt-4" style={{
                                        width: "200%",
                                        height: "24rem",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                    <h1 className="card-title">Create Product</h1>
                                    <form>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">name</label>
                                            <input type="text" className="form-control" id="name-product" name="name" placeholder="Enter the name" />
                                        </div>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">stock</label>
                                            <input type="number" className="form-control" id="stock" name="stock" placeholder="Enter the stock" />
                                        </div>
                                        <div className="form-group m-3">
                                            <label htmlFor="name">price</label>
                                            <input type="number" className="form-control" id="price" name="price" placeholder="Enter the price" />
                                        </div>
                                        <button type="submit" className="btn btn-primary" onClick={handleCreateProduct}>Create</button>
                                        {createMessage && <p>{createMessage}</p>}
                                    </form>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Admin;
