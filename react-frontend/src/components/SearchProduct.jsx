import { useState } from "react";
import { getCookie } from "../../utils/cookies.jsx";

function SearchProduct() {

    const adminToken = getCookie('jwt');

    const [searchProductData, setSearchProductData] = useState([]);
    const [updateDisplay, setUpdateDisplay] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

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
    );
}

export default SearchProduct;