import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import linea from "./../../img/linea.png";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { uuid } = useParams(); // Extract UUID from URL params
    const apiUrl = process.env.BACKEND_URL; // Backend URL

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/reset-password/${uuid}`, {
                method: "PUT", // PUT request to reset password
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.msg === "Password updated") {
                setMessage("Password has been successfully updated!");
                setTimeout(() => {
                    navigate("/"); // Redirect to login page after success
                }, 3000);
            } else {
                setMessage("Error: Could not update the password.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("There was a problem updating your password. Please try again.");
        }
    };

    return (
        <div className="container mt-auto p-3 d-flex flex-column min-vh-100">
            <div className="row justify-content-start text-start mb-4 col-6">
					<div className="col-12">
						<h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontSize: "80px", fontWeight: "bold" }}>Reset Password</h1>
						<img className="mt-2" src={linea} />
					</div>
				</div>
        <div className="reset-password-container p-5 mt-5 rounded" style={{border: "solid 1px #043873", background: "#FFE492"}}>
        <div className="row justify-content-center">
        <div className="col-12 col-md-6">
            <form onSubmit={handlePasswordReset} className="mb-3">

                <div className="form-group mb-3">
                <input
                    type="password"
                    className="form-control w-100"
                    style={{background: "#A7CEFC"}}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                </div>
                <div className="form-group mb-3">
                <input
                    type="password"
                    className="form-control w-100"
                    style={{background: "#A7CEFC"}}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                </div>
                
                <div className="text-center mt-3">
						<button type="submit" className="btn btn-primary fw-light align-text-center btn-block w-100" style={{ backgroundColor: "#4F9CF9", border: "none"}} >
							<strong>Reset Password</strong>
						</button>
					</div>
            </form>
            {message && <p className="alert alert-info text-center">{message}</p>}
            </div>
            </div>
        </div>
        </div>
    );
};

export default ResetPassword;