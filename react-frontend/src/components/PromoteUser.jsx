import { useState } from "react";
import { getCookie } from "../../utils/cookies.jsx";

function PromoteUser() {

    const adminToken = getCookie('jwt');

    const [promoteMessage, setPromoteMessage] = useState("");

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

    return (
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
    );
}

export default PromoteUser;