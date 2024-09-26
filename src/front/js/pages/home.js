
import linea from "../../img/linea.png"
import yeti from "../../img/yeti.png"
import { Link, useNavigate } from "react-router-dom";
import "../../styles/home.css";
import React, { useState, useEffect } from "react";


export const Home = () => {
	const [email, setEmail] = useState(""); //Estado para guardar el valor del email que el usuario ingresa. setemail es la función para actualizar este valor.
	const [password, setPassword] = useState(""); //Crea un estado similar para la contraseña.
	const navigate = useNavigate(); //Crea una función que se puede usar para redirigir a otras páginas.
	const apiUrl = process.env.BACKEND_URL; //Obtiene la URL base de la API desde las variables de entorno.

	useEffect(() => {
		const token = localStorage.getItem("jwt_token")
		if (token) {
			navigate("/stock")
		}
	}, [navigate]);


	const handleSubmit = async (event) => { //Función que se ejecuta cuando el usuario envía el formulario.
		event.preventDefault(); //Evita que el formulario se envíe de manera predeterminada, lo cual recargaría la página.
		try {
			const response = await fetch(`${apiUrl}/login`, { //Envía una solicitud POST a la URL de inicio de sesión de la API.
				method: "POST",
				headers: {
					"Content-Type": "application/json" //El cuerpo de la solicitud está en formato JSON.
				},
				body: JSON.stringify({ //El cuerpo de la solicitud contiene el email y la contraseña convertidos a JSON.
					email,
					password
				})
			});
			if (!response.ok) { //Si la respuesta de la API no es exitosa (código de estado no es 200), lanza un error.
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json(); //Convierte la respuesta de la API en formato JSON.
			if (data.jwt_token) { //Si jwt_token existe:
				localStorage.setItem("jwt_token", data.jwt_token); //Guarda el token JWT en el almacenamiento local del navegador.
				navigate('/stock');
			} else {
				alert('Error de autenticación'); //Muestra un mensaje si hay un problema con el inicio de sesión.
			}
		} catch (error) {
			console.error('Error en la solicitud:', error); //Captura errores y muestra un mensaje si algo sale mal.
			alert('Usuario no registrado');
		}
	};

	return (
		<div className="d-flex flex-column flex-md-row vh-100 align-items-center justify-content-center">
			{/* Sección izquierda */}
			<div className="text-center text-md-start col-12 col-md-6 d-flex flex-column justify-content-center align-items-md-start position-relative">
				<h1 className="mb-n1 px-md-5 " style={{ fontSize: "80px", fontWeight: "bold" }}>Sign in</h1>
				<img src={linea} className="mt-2mx-md-5 my-2 img-fluid" style={{ zIndex: 0, maxWidth: "100%", height: "auto" }} alt="Linea decorativa" />
				<h3 className="px-md-5 fw-normal">Book your material</h3>
				<h6 className="px-md-5 mt-5">If you do not yet have an account</h6>
				<div className="px-md-5 mt-3">
					<Link to="/register">
						<button type="button" className="btn btn-primary fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
							Sign up <i className="fa-solid fa-arrow-right fa-sm" />
						</button>
					</Link>
				</div>

				{/* Imagen del yeti alineada a la derecha y más cerca */}
				<div className="yeti-img-container">
					<img src={yeti} style={{ zIndex: 0 }} className=" img-fluid yeti-img" alt="Yeti" />
				</div>
			</div>


			{/* Sección derecha - Formulario */}
			<div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
				<form onSubmit={handleSubmit} className="w-100 p-4 p-md-5">
					<h2 className="fw-light mb-4">Sign in</h2>
					<div className="form-group mb-4">
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							className="form-control form-control-lg fw-light fs-6 input"
							id="email"
							placeholder="Enter email"
							required
							style={{ backgroundColor: "#D3E7FF" }}
						/>
					</div>
					<div className="form-group mb-4">
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							className="form-control form-control-lg fw-light fs-6 input"
							id="password"
							placeholder="Enter password"
							required
							style={{ backgroundColor: "#D3E7FF" }}
						/>
						<div id="forgotPassword" className="form-text text-end">
							<Link to="/forgot-password">Forgot your password?</Link>
						</div>
					</div>
					<button type="submit" className="btn btn-login btn-primary btn-lg w-100 fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
						Login
					</button>
				</form>
			</div>
		</div >
	);
};
