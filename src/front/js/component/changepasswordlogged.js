import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import linea from "../../img/linea.png";
import yeti from "../../img/yeti.png";
import "../../styles/home.css"; // Asegúrate de que los estilos CSS estén en el archivo home.css

const ChangePasswordLogged = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        // Obtener el token JWT desde el localStorage
        const token = localStorage.getItem('jwt_token');

        if (!token) {
            setMessage("You must be logged in to change your password.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Password changed successfully!");
                setTimeout(() => navigate('/profile'), 2000); // Redirige al perfil después de 2 segundos
            } else {
                setMessage(data.msg || "Error changing password.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="d-flex">
            <div className="d-flex vh-100 justify-content-center align-items-center container row col-6" style={{ marginLeft: "100px" }}>
                <div>
                    <h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontSize: "80px", fontWeight: "bold" }}>Change Password</h1>
                    <img src={linea} style={{ zIndex: 0 }} alt="Linea decorativa" />
                    <h3 className="px-5 fw-normal">Secure your account</h3>
                    <h6 className="px-5 fw-light" style={{ marginTop: "80px" }}>Ensure your account is safe with a new password</h6>
                </div>
                <img src={yeti} style={{ zIndex: 0, width: "300px", bottom: "200px", left: "550px" }} className="position-absolute" alt="Yeti decorativo" />
            </div>

            <div className="container col-3 row d-flex justify-content-center align-items-center container" style={{ marginLeft: "80px" }}>
                <form onSubmit={handleSubmit}>
                    <h2 className="fw-light mb-3">Change Password</h2>

                    {/* Current Password Input */}
                    <div className="mb-3">
                        <input
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type="password"
                            className="form-control form-control-lg fw-light fs-6 input"
                            style={{ backgroundColor: "#D3E7FF" }}
                            placeholder="Current Password"
                            required
                        />
                    </div>

                    {/* New Password Input */}
                    <div className="mb-3">
                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            className="form-control form-control-lg fw-light fs-6 input"
                            style={{ backgroundColor: "#D3E7FF" }}
                            placeholder="New Password"
                            required
                        />
                    </div>

                    {/* Confirm New Password Input */}
                    <div className="mb-3">
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="form-control form-control-lg fw-light fs-6 input"
                            style={{ backgroundColor: "#D3E7FF" }}
                            placeholder="Confirm New Password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary btn-lg fw-light mt-3 btn-login" style={{ backgroundColor: "#4F9CF9", border: "none", width: "100%" }}>
                        Change Password
                    </button>

                    {/* Displaying messages */}
                    {message && <div className="mt-3 text-danger">{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordLogged;