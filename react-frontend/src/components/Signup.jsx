import { getCookie } from "../../utils/cookies.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

function Signup() {

    function handleSubmit(e){
        e.preventDefault();
        fetch('http://localhost:3000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.querySelector('#name').value,
                password: document.querySelector('#password').value
            })
        })
        .then(async res => {
            const data = await res.json();
            document.cookie = `jwt=${data.jwt}; path=/;`;
            console.log(data);
            console.log(getCookie('jwt'));
        })
        // .then(() => window.location.href = '/')
        .catch(err => console.log(err));
    }

    return (
        <div className="container-fluid bg-dark p-0 d-flex flex-column" style={{ height: "100vh" }}>
            <Header />

            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <section className="bg-light text-center" style={{ width: "100%", height: "100%" }}>
                    <div className="container h-100 d-flex justify-content-center align-items-center">
                        <div className="row justify-content-center w-100">
                            <div className="col-md-6 col-lg-4 border border-dark rounded p-4">
                                <h2 className="display-4">Sign Up</h2>
                                <p className="lead">Create an account to start shopping!</p>
                                <form>
                                    <div className="form-group m-3">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter your name" />
                                    </div>
                                    <div className="form-group m-3">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" name="password" className="form-control" id="password" placeholder="Enter your password" />
                                    </div>
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sign Up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Signup;
