import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { getCookie } from "../../utils/cookies.jsx";
import SearchUser from "./SearchUser.jsx";
import PromoteUser from "./PromoteUser.jsx";
import DemoteUser from "./DemoteUser.jsx";
import SearchProduct from "./SearchProduct.jsx";
import CreateProduct from "./CreateProduct.jsx";

function Admin() {

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
        

    return (
        <div className="container-fluid bg-dark p-0 d-flex flex-column" style={{ height: "100vh" }}>
            <Header />

            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <section className="bg-light text-center h-100" style={{ width: "99.999%" }}>
                    <div className="container">
                        <h2 className="display-3 m-3 border border-dark rounded-pill">Admin</h2>
                        <div className="row justify-content-center">
                            <div className="col-md-4 col-sm-6 col-12 p-3 d-flex flex-column align-items-center">
                                
                                <SearchUser />

                                <PromoteUser />
                                
                                <DemoteUser />

                                <SearchProduct />

                                <CreateProduct />
                                
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
