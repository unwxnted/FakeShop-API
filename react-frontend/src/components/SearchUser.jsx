import { useState } from "react";
import { getCookie } from "../../utils/cookies.jsx";

function SearchUser() {

    const adminToken = getCookie('jwt');

    const [searchData, setSearchData] = useState([]);

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

    return (
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
    );
}

export default SearchUser;