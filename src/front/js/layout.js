import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import { FormPedido } from "./component/FormPedido";
import ForgotPassword from "./component/forgotPassword";
import ResetPassword from "./component/resetPassword"; // New component
import ChangePassword from "./component/changepasswordlogged";
import Register from "./component/Register";
import Stock from "./pages/Stock";
import NewArticle from "./pages/NewArticle";
import EditArticle from "./pages/EditArticle";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<FormPedido />} path="/formPedido" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Register />} path="/register" />

                        <Route element={<Stock />} path="/stock" />
                        <Route element={<NewArticle />} path="/new-article" />
                        <Route element={<EditArticle />} path="/edit-article/:id" />
                        <Route element={<ForgotPassword />} path="forgot-password" />
                        <Route element={<ResetPassword />} path="/reset-password/:uuid" /> {/* Reset Password using UUID */}
                        <Route element={<ChangePassword />} path="/changepasswordlogged" />
                        <Route element={<h1>Not found!</h1>} />

                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
