import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="bg-dark text-white p-3">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h3">Shopping Store</h1>
                        <nav>
                            <Link to="/" className="text-white mx-2">Home</Link>
                            <Link to="/products" className="text-white mx-2">Products</Link>
                            <Link to="/cart" className="text-white mx-2">Cart</Link>
                        </nav>
                    </div>
                </div>
            </header>
    );
}

export default Header;