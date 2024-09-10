import React, { useEffect, useState } from "react";
import linea from "../../img/linea.png"
import yeti from "../../img/yeti.png"
import React, { useState } from 'react'; //Permite manejar el estado (variables que cambian).
import { Link, useNavigate } from "react-router-dom";
import "../../styles/home.css";


export const Home = () => {
	const [email, setEmail] = useState(""); //Estado para guardar el valor del email que el usuario ingresa. setemail es la función para actualizar este valor.
	const [password, setPassword] = useState(""); //Crea un estado similar para la contraseña.
	const navigate = useNavigate(); //Crea una función que se puede usar para redirigir a otras páginas.
	const apiUrl = process.env.BACKEND_URL; //Obtiene la URL base de la API desde las variables de entorno.


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
				navigate('/register');
			} else {
				alert('Error de autenticación'); //Muestra un mensaje si hay un problema con el inicio de sesión.
			}
		} catch (error) {
			console.error('Error en la solicitud:', error); //Captura errores y muestra un mensaje si algo sale mal.
			alert('Usuario no registrado');
		}
	};

	return (
		<div className="d-flex">
			<div className="d-flex vh-100 justify-content-center align-items-center container row col-6" style={{ marginLeft: "100px" }}>
				<div>
					<h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontSize: "80px", fontWeight: "bold" }}>Sign in</h1>
					<img src={linea} style={{ zIndex: 0 }} />
					<h3 className="px-5 fw-normal">Book your material</h3>
					<h6 className="px-5 fw-light" style={{ marginTop: "80px" }}>If you do not yet have an account</h6>
					<div className="px-5">
						<Link to="/register" className="mb-3">
							<button type="button" className="btn btn-primary fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
								Sign up <i className="fa-solid fa-arrow-right fa-sm" />
							</button>
						</Link>

					</div>
				</div>
				<img src={yeti} style={{ zIndex: 0, width: "300px", bottom: "200px", left: "550px" }} className="position-absolute" />
			</div>

			<div className="container col-3 row d-flex justify-content-center align-items-center container" style={{ marginLeft: "80px" }}>
				<form onSubmit={handleSubmit}>
					<h2 className="fw-light mb-3">Sign in</h2>
					<div className="mb-5">
						<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="email" placeholder="Enter email" />
					</div>
					<div className="mb-3">
						<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="password" placeholder="Enter password" />
						<div id="forgotPassword" className="form-text text-end">Forgot your password?</div>
					</div>
					<button type="submit" className="btn btn-primary btn-lg fw-light mt-3 btn-login" style={{ backgroundColor: "#4F9CF9", border: "none", width: "100%" }}>Login</button>
				</form>
			</div>
		</div>
	);
};

