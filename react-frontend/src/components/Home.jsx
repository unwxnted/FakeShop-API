import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container-fluid vh-100 vw-100 bg-dark pl-5 pr-5 pb-5 pt-2 d-flex flex-column">
            <Header />

            <main className="flex-grow-1">
                <section className="bg-light text-center d-flex justify-content-center align-items-center" style={{ width:"100%",minHeight: "calc(100vh - 7rem)" }}>
                    <div className="container w-50">
                        <h2 className="display-4">Welcome to Our Shopping Store</h2>
                        <p className="lead">Find the best products at the best prices!</p>
                        <Link to="/products"><button className="btn btn-primary btn-lg" >Shop Now</button></Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;