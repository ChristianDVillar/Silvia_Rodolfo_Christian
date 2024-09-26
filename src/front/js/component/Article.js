import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Article = ({ description, quantity, stocktype, image, id }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);
  const usertype = store.usertype;
  const articulo = {
    description: description,
    quantity: quantity,
    stocktype: stocktype,
    id: id
  };

  useEffect(() => {
    setIsSelected(store.selected.some((element) => element.description === description));
    //obtiene usertype y hace que se oculten los botones elegidos
    const fetchUserType = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        navigate("/");
      }
    };
    fetchUserType();
  }, []);

  const handleSelectedClick = () => {
    actions.handleSelected(articulo);
  };

  const deleteArticleClic = (id) => {
    actions.deleteArticle(id);
  };

  return (
    <div className="card mb-5 p-2" style={{ width: "100%", height: "25rem", backgroundColor: "#FFE492" }}>
      <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
        <img src={image} className="card-img-top" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div className="card-body">
        <h4 className="card-title"> {description}</h4>
        <p>{stocktype}</p>
        <p>Quantity: {quantity}</p>


        {usertype === "usuario" && (
          <div className="d-flex align-items-center">
            <p className="mb-0">Añadir al pedido </p>
            <div className={`btn ${store.selected.includes(articulo) ? 'active' : ''}`} onClick={handleSelectedClick}>
              {store.selected.includes(articulo) ? (
                <i className="fa-solid fa-square-check fa-2xl" style={{ color: "#042649" }} />
              ) : (
                <i className="fa-regular fa-square-check fa-2xl" style={{ color: "#042649" }} />
              )}
            </div>
          </div>
        )}

        {usertype === "tecnico" && (
          <div className="text-center mb-2">
            <button type="button" className="btn btn-secondary m-2" style={{ backgroundColor: "#043873" }} onClick={() => navigate(`/edit-article/${id}`)}>
              <i className="fa-solid fa-pen-to-square" />
            </button>
            <button type="button" className="btn btn-secondary m-2" style={{ backgroundColor: "#043873" }} onClick={() => { deleteArticleClic(id) }}>
              <i className="fa-solid fa-trash" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Article