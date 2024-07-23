import { useState } from "react";
import { getCookie } from "../../utils/cookies.jsx";

function CreateProduct() {

    const adminToken = getCookie('jwt');

    const [createMessage, setCreateMessage] = useState("");

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

    return (
        <div className="card p-1 m-1 mt-4" style={{
            width: "200%",
            height: "18rem",
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
    );
}

export default CreateProduct;