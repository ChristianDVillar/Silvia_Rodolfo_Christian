import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoNavbar from "../../img/logo.png";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [isLogged, setIsLogged] = useState(false);
	const count = store.selected.length;
	const token = localStorage.getItem("jwt_token");

	// Verificar si el usuario está logueado
	useEffect(() => {
		setIsLogged(!!token);
	}, [token]);

	// Manejar Login/Logout
	const handleLogin = () => {
		if (isLogged) {
			setIsLogged(false);
			localStorage.removeItem("jwt_token");
			navigate("/"); // Redirigir al inicio después del logout
		} else {
			navigate("/"); // Redirigir al inicio si no está logueado
		}
	};

	// Eliminar elemento del carrito
	const noCart = (id) => {
		actions.deleteSelected(id);
	};

	return (
		<nav className="navbar" style={{ backgroundColor: "#043873" }}>
			<div className="container d-flex">
				<Link to="/">
					<img src={logoNavbar} style={{ width: "200px" }} alt="Logo" />
				</Link>
				<div className="d-flex align-items-center ms-auto gap-2">
					{/* Mostrar el dropdown de perfil con el nombre si está logueado */}
					{token ? (
						<div className="d-flex align-items-center">
							<div className="btn-group">
								<button
									type="button"
									className="btn dropdown-toggle"
									data-bs-toggle="dropdown"
									aria-expanded="false"
									style={{ backgroundColor: "#4F9CF9", color: "#fff" }}
								>
									{/* Mostrar el nombre completo del usuario si está disponible */}
									{store.user && store.user.firstName && store.user.lastName
										? `${store.user.firstName} ${store.user.lastName}`
										: "Perfil"}
								</button>
								<ul className="dropdown-menu dropdown-menu-end">
									<li>
										<Link className="dropdown-item" to="/changepasswordlogged">
											Change Password
										</Link>
									</li>
									<li>
										<button className="dropdown-item" onClick={handleLogin}>
											Logout
										</button>
									</li>
								</ul>
							</div>
						</div>
					) : null}

					{/* Botón de Login/Logout */}
					{!token && (
						<button onClick={handleLogin} type="button" className="btn ms-auto" style={{ backgroundColor: "#FFE492" }}>
							{token ? "Logout" : "Login"}
						</button>
					)}

					{/* Carrito de compras */}
					{token && (
						<div className="btn-group top-50 end-0 me-5" style={{ zIndex: "1" }}>
							<button
								type="button"
								className="btn dropdown-toggle"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								style={{ backgroundColor: "#4F9CF9" }}
							>
								Order
								<span className="badge" style={{ color: "black" }}>{count}</span>
							</button>

							<ul className="dropdown-menu dropdown-menu-end">
								{store.selected.length > 0 ? (
									store.selected.map((selected, index) => (
										<li className="dropdown-item d-flex" key={index}>
											<div className="me-auto p-2">
												{selected[0]}
											</div>
											<div className="p-2" onClick={() => noCart(selected[0])}>
												<i className="fa-solid fa-trash" />
											</div>
											<div>
												<button
													type="button"
													className="btn btn-secondary m-2"
													style={{ backgroundColor: "#4F9CF9" }}
													onClick={() => navigate("/formPedido")}
												>
													Order
												</button>
											</div>
										</li>
									))
								) : (
									<li className="dropdown-item">No items</li>
								)}
							</ul>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};
