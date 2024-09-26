import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import linea from "../../img/linea.png"
import { useNavigate } from "react-router-dom";
import Article from "../component/Article";

const Stock = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const usertype = store.usertype;

    const [selectedType, setSelectedType] = useState(""); // Tipo de producto seleccionado
    const articles = store.article;

   
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

    const handleSelectType = (event) => {
        const selectedValue = event.target.value;
        setSelectedType(selectedValue);
    };

    const filteredArticles = selectedType && articles != []
        ? articles.filter((article) => article.type === selectedType)
        : articles;
        


    return (
        <div className="container">
            <div className="d-flex flex-column align-items-start mt-5 row" style={{ minHeight: "500px" }}>
                <div>
                    <h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontWeight: "bold" }}>Stock</h1>
                    <img src={linea} className="img-fluid" style={{ zIndex: 0, maxWidth: "100%", height: "auto" }} alt="Linea decorativa" />
                </div>
                <div className="row mb-4 align-items-center mt-5">
                    <div className="col-12 col-md-auto mb-2 mb-md-0">
                        <button onClick={goTo} type="button" className="btn btn-primary fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
                            {usertype === "usuario" ? "Order" : "New article"}
                        </button>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="col-12 col-md">
                        <div className="input-group">
                            <select
                                className="form-select fw-light fs-6"
                                style={{ backgroundColor: "#D3E7FF", color: "#4F9CF9" }}
                                value={selectedType}
                                onChange={handleSelectType}
                                required
                            >
                                <option value="">Selecciona un tipo de producto</option> {/* Opción por defecto */}
                                <option value="monitor">Monitor</option>
                                <option value="teclado">Teclado</option>
                                <option value="cable">Cable</option>
                                <option value="mouse">Mouse</option>
                                <option value="camara">Cámara</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lista de Artículos generales filtrada por el tipo seleccionado */}
                <div className="container mt-5">
                    <div className="row g-3">
                        {(filteredArticles.length > 0) ? (
                            filteredArticles.map((article, index) => (
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
                            ))
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