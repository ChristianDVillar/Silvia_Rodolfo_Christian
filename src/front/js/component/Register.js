import React, { useState } from 'react'
import linea from "../../img/linea.png"
import yeti from "../../img/yeti.png"
import { useNavigate } from 'react-router-dom';
import "/workspaces/Silvia_Rodolfo_Christian/src/front/styles/registerStyles.css";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(""); //Estado para guardar el valor del email que el usuario ingresa. setemail es la función para actualizar este valor.
    const [password, setPassword] = useState(""); //Crea un estado similar para la contraseña.
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.BACKEND_URL;

    const signUp = async (event) => { //Función que se ejecuta cuando el usuario envía el formulario.
        event.preventDefault(); //Evita que el formulario se envíe de manera predeterminada, lo cual recargaría la página.

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/register`, { //Envía una solicitud POST a la URL de registro de la API.
                method: "POST",
                headers: {
                    "Content-Type": "application/json" //El cuerpo de la solicitud está en formato JSON.
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            if (!response.ok) { //Si la respuesta de la API no es exitosa (código de estado no es 200), lanza un error.
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); //Convierte la respuesta de la API en formato JSON.
            
            if (data.msg === "New User Created") { //Si la respuesta indica que el usuario fue creado:
                navigate('/'); //Redirige al usuario a la página de inicio de sesión.
            } else {
                alert("Error al crear usuario"); //Si algo salió mal, muestra una alerta.
            }
        } catch (error) { //Captura y maneja cualquier error que ocurra durante el proceso.
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al registrar. Inténtalo de nuevo."); //Si algo salió mal, muestra una alerta.
        }
    };

    return (
        <div className="d-flex">
            <div className="d-flex vh-100 justify-content-center align-items-center container row col-6" style={{ marginLeft: "100px" }}>
                <div>
                    <h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontSize: "80px", fontWeight: "bold" }}>Sign up</h1>
                    <img src={linea} style={{ zIndex: 0 }} />
                    <h3 className="px-5 fw-normal">Book your material</h3>
                </div>
                <img src={yeti} style={{ zIndex: 0, width: "300px", bottom: "200px", left: "550px" }} className="position-absolute" />
            </div>

            <div className="container col-3 row d-flex justify-content-center align-items-center" style={{ marginLeft: "80px" }}>
                <form onSubmit={signUp}>
                    <h2 className="fw-light mb-3">Sign up</h2>
                    <div className="mb-3">
                        <input type="text" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="firstName" placeholder="Your first name" value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="lastName" placeholder="Your lastname" value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="email" placeholder="Your email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="password" placeholder="Your password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }} id="confirmPassword" placeholder="Confirm password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg fw-light mt-3 btn-login" style={{ backgroundColor: "#4F9CF9", border: "none", width: "100%" }}>Save</button>
                </form>
            </div>
        </div>
    );
};

export default Register;