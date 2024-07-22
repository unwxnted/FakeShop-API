import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getCookie } from "../../utils/cookies.jsx";

function Header() {
    const adminToken = getCookie('jwt');
    const [isAdmin, setIsAdmin] = useState(false);

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
                if(response.admin == true) setIsAdmin(true);
                else setIsAdmin(false);
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [adminToken]);

    const handleLogout = async () => {
        document.cookie = 'jwt=; Path=/;';
        window.location.href = '/signin';
    }

    return (
        <header className="bg-dark text-white p-3">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="h3">Shopping Store</h1>
                    <nav>
                        <Link to="/" className="text-white mx-2">Home</Link>
                        <Link to="/products" className="text-white mx-2">Products</Link>
                        <Link to="/cart" className="text-white mx-2">Cart</Link>
                        {isAdmin ? <Link to="/admin" className="text-white mx-2">Admin</Link> : null}
                        {adminToken ? <button onClick={handleLogout} className="btn btn-danger mx-2">Logout</button> : null}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
