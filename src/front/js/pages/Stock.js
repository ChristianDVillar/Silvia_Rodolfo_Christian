import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import linea from "../../img/linea.png"
import { useNavigate } from "react-router-dom";
import Article from "../component/Article";

const Stock = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const usertype = store.usertype;

    //comprueba si hay token y el usertype para ocultar botones
    useEffect(() => {
        const fetchUserType = async () => {
            const token = localStorage.getItem("jwt_token");
            if (!token) {
                navigate("/");
            } else {
                await actions.getUser();
            }
        };
        fetchUserType();
        console.log(usertype);
        actions.getStock();
    }, []);

    //dependiendo del usertype el botón va a una página o a otra
    const goTo = () => {
        if (usertype === "usuario") {
            navigate("/formPedido");
        } else {
            navigate("/new-article");
        }
    };

    return (
        <div className="container">
            <div className="d-flex flex-column align-items-start mt-5 row" style={{minHeight: "200px"}}>
                <div>
                    <h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontWeight: "bold" }}>Stock</h1>
                    <img src={linea} className="img-fluid" style={{ zIndex: 0, maxWidth: "100%", height: "auto" }} alt="Linea decorativa" />
                </div>
                <div className="mt-5">
                    <button onClick={goTo} type="button" className="btn btn-primary fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
                    {usertype === "usuario" ? "Order" : "New article"}
                    </button>
                </div>
                <div className="container mt-5">
                    <div className="row g-3">
                        {store.article && store.article.length > 0 ? (
                            store.article.map((article, index) => {
                                return (
                                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <Article
                                            description={article.description}
                                            stocktype={article.stocktype}
                                            quantity={article.quantity}
                                            image={article.image}
                                            usertype={usertype}
                                            id={article.id}
                                        />
                                    </div>
                                )
                            })
                        ) : (
                            <p>No hay artículos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stock