import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para la navegación
import linea from "../../img/linea.png"
import yeti from "../../img/yeti.png"
const ForgotPassword = () => {
    const [email, setEmail] = useState(""); // Estado para el email del usuario
    const [message, setMessage] = useState(""); // Estado para mensajes de éxito o error
    const navigate = useNavigate();
    const apiUrl = process.env.BACKEND_URL; // URL del backend

    const handleForgotPassword = async (event) => {
        event.preventDefault(); // Prevenir comportamiento por defecto del formulario
        try {
            const response = await fetch(`${apiUrl}/forgot-password`, { // Ruta para restablecer contraseña
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Asegura que estás enviando JSON
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); // Respuesta de la API

            if (data.msg === "If the email is registered, a reset link has been sent.") {
                setMessage("A reset password link has been sent to your email.");
                setTimeout(() => {
                    navigate("/"); // Redirigir a la página de inicio de sesión después de un tiempo
                }, 3000);
            } else {
                setMessage("Error: Could not send reset link.");
            }
            
        } catch (error) {
            console.error("Error in request:", error);
            setMessage("There was a problem sending the reset link. Please try again.");
        }
    };

    return (
        <div className="d-flex flex-column flex-md-row vh-100 align-items-center justify-content-center">
            <div className="text-center text-md-start col-12 col-md-6 d-flex flex-column justify-content-center align-items-md-start position-relative">
                <div>
                    <h1 className="mb-n1 px-5" style={{ fontSize: "60px", fontWeight: "bold" }}>Forgot Password</h1>
                    <img src={linea} className="mt-2mx-md-5 my-2 img-fluid" style={{ zIndex: -1, maxWidth: "100%", height: "auto" }} alt="Linea decorativa" />
                    <h3 className="px-5 fw-normal">Enter your email to reset your password</h3>
                </div>
                <div className="yeti-img-container">
					<img src={yeti} style={{ zIndex: 0 }} className=" img-fluid yeti-img" alt="Yeti" />
				</div>
            </div>

            <div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
                <form onSubmit={handleForgotPassword}>
                    <h2 className="fw-light mb-4 mt-3">Reset Password</h2>
                    <div className="form-group mb-4">
                        <input
                            type="email"
                            className="form-control form-control-lg fw-light fs-6 input"
                            style={{ backgroundColor: "#D3E7FF" }}
                            id="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {message && <div className="mb-3 alert alert-info">{message}</div>}
                    <button type="submit" className="btn btn-login btn-primary btn-lg w-100 fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
