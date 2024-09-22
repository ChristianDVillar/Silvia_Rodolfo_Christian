import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Image } from 'cloudinary-react'
import { Context } from "../store/appContext";
import linea from "../../img/linea.png"


const EditArticle = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { id } = useParams();
    const [description, setDescription] = useState(""); //guarda el valor del artículo y actualiza el valor
    const [stocktype, setStocktype] = useState("");
    const [quantity, setQuantity] = useState("");
    const [imageSelected, setImageSelected] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        //Ejecuta loadArticle cuando id cambie (cuando se cargue el componente o cambie de artículo)
        if (id) {
          loadArticle();
        }
      }, [id]);

    const loadArticle = async () => {
        //petición GET al servidor para obtener los datos del artículo con el id
        try {
            const response = await fetch(`${store.apiUrl}/stock/${id}`);
            console.log(response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            
            setDescription(data.data.description);
            setStocktype(data.data.type);
            setQuantity(data.data.quantity);        
            setImageUrl(data.data.image);
        } catch (error) {
            console.error("Error cargando el artículo:", error);
        }
    };
    
    const uploadImage = async () => {
        //añade la imagen seleccionada por el usuario (una nueva)
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "mihmd30x");

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dohlrocq4/image/upload`, {
                method: 'POST',
                body: formData
            });
            const file = await response.json();
            //devuelve la URL segura de la imagen subida
            return file.secure_url;

        } catch (error) {
            console.error("Error subiendo la imagen:", error);
            throw error;
        }
    };

    const editArticle = async (id) => {
        try {
            const uploadedImageUrl = imageSelected ? await uploadImage() : imageUrl; // Usa la URL existente si no se selecciona una nueva imagen

            const articleData = {
                description: description,
                stocktype: stocktype,
                quantity: parseInt(quantity),
                image: uploadedImageUrl // URL de Cloudinary
            };

            const response = await fetch(`${store.apiUrl}/stock/${id}`, {
                method: "PUT",
                body: JSON.stringify(articleData),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            console.log(data);
            actions.getStock();
            console.log(actions.getStock());
            
            navigate('/stock');
        } catch (error) {
            console.error("Error actualizando el artículo:", error);
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
                    <Link to="/stock">
                        <button type="button" className="btn btn-primary fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
                            <i className="fa-solid fa-arrow-left" /> Back
                        </button>
                    </Link>
                </div>

                <div className="card mb-5 mt-5" style={{ width: "18rem", backgroundColor: "#FFE492" }}>

                    <Image
                        //'cloudName' es el nombre de la cuenta de cloudinary
                        //'publicID' viene dado en la imagen que se sube
                        className="mt-3" cloudName="dohlrocq4" publicId={imageUrl} />


                    <form onSubmit={(e) => { e.preventDefault(); editArticle(id); }}>
                        <div className="card-body">
                            <div className="mb-2">
                                <label htmlFor="formFileSm" className="form-label fw-light fs-6">Upload image</label>
                                <input className="form-control form-control-sm" id="formFileSm" type="file" style={{ backgroundColor: "#D3E7FF" }}
                                    //maneja la selección y guardado del archivo de imagen del artículo
                                    onChange={(event) => { setImageSelected(event.target.files[0]); }} />
                            </div>

                            <div className="mb-2">
                                <input type="text" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }}
                                    value={description} onChange={(e) => setDescription(e.target.value)} id="description" name="description" placeholder="Description" required />
                            </div>

                            <div className="mb-2">
                                <select className="form-select fw-light fs-6" style={{ backgroundColor: "#D3E7FF", color: "#4F9CF9" }} value={stocktype} onChange={(e) => setStocktype(e.target.value)} required>
                                    <option value="">Type</option>
                                    <option value="monitor">Monitor</option>
                                    <option value="teclado">Teclado</option>
                                    <option value="cable">Cable</option>
                                    <option value="mouse">Mouse</option>
                                    <option value="camara">Cámara</option>
                                </select>
                            </div>

                            <div>
                                <input type="number" min="0" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }}
                                    value={quantity} onChange={(e) => setQuantity(e.target.value)} id="quantity" name="quantity" placeholder="Quantity" required />
                            </div>

                            <div className="text-center mb-2">
                                <button type="submit" className="btn btn-secondary m-2" style={{ backgroundColor: "#043873" }}>
                                    <i className="fa-solid fa-check" />
                                </button>
                                <button type="button" className="btn btn-secondary m-2" style={{ backgroundColor: "#043873" }} onClick={() => navigate("/stock")}>
                                    <i className="fa-solid fa-xmark" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditArticle