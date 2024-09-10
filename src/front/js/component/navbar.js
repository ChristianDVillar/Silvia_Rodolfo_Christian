import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoNavbar from "../../img/logo.png";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	//determina si el usuario está logueado.
	//"false" para que inicie como NO logueado
	const [isLogged, setIsLogged] = useState(false);
	const count = store.cart.length;

		//comprueba si hay token
		useEffect(() => {
			const token = localStorage.getItem("jwt-token");
			if (token) {
				setIsLogged(true);
			}
		}, []);

	//si está logueado cambia el estado y elimina el token, si no lo está envía a inicio para que lo haga
	const handleLogin = () => {
		if (isLogged) {
			setIsLogged(false);
			localStorage.removeItem("jwt-token");
			navigate("/");
		} else {
			navigate("/")
		}
	};

	const noCart = (name) => {
		actions.deleteItem(name);
	};

	return (
		<nav className="navbar" style={{ backgroundColor: "#043873" }}>
			<div className="container d-flex">
				<Link to="/">
					<img src={logoNavbar} />
				</Link>
				<div className="d-flex align-items-center ms-auto gap-2">
					<button onClick={handleLogin} type="button" className="btn ms-auto" style={{ backgroundColor: "#FFE492" }}>
						{/*cambia el texto del botón según el estado*/}
						{isLogged ? "Logout" : "Login"}
					</button>

					{isLogged && (
					<div className="btn-group top-50 end-0 me-5" style={{ zIndex: "1" }}>
						<button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: "#4F9CF9" }}>
							Order
							<span className="badge" style={{ color: "black" }}>{count}</span>
						</button>

						<ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
							{
								store.cart.length > 0 ? (
									store.cart.map((item, index) => (
										<li className="dropdown-item d-flex" key={index}>
											<div className="p-2" onClick={() => noCart(item[0])}>
												<i className="fa-solid fa-trash" />
											</div>
											<button type="button" style={{ backgroundColor: "#4F9CF9" }}>
												Order
											</button>
										</li>

									))
								) : (
									<li className="dropdown-item">No items</li>
								)
							}
						</ul>
					</div>
					)}
				</div>
			</div>
		</nav>
	);
};
