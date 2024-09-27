import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import linea from "../../img/linea.png"
import { Image } from 'cloudinary-react'


const NewArticle = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.BACKEND_URL;
  const [description, setDescription] = useState(""); //guarda el valor del artículo y actualiza el valor
  const [stocktype, setStocktype] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageSelected, setImageSelected] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const uploadImage = async () => {
    //datos del formulario = nuevos datos del formulario
    const formData = new FormData();
    //agrega el archivo a los datos del formulario
    formData.append("file", imageSelected);
    //agrega los ajustes preestablecidos de carga (public upload preset para que no haya prolemas enla carga desde le lado del cliente)
    //se hace copiando el nombre del Upload Preset
    formData.append("upload_preset", "mihmd30x");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dohlrocq4/image/upload`, {
        method: 'POST',
        body: formData
      });

      const file = await response.json();

      //devuelve la URL segura de la imagen subida
      console.log(file);
      return file.secure_url;
      //return response.data.secure_url;
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      throw error;
    }
  };

  const saveArticle = async () => {
    try {
      //sube la imagen y obtiene la URL
      const uploadedImageUrl = await uploadImage();
      setImageUrl(uploadedImageUrl);
      console.log(uploadedImageUrl);

      //objeto de datos en JSON
      const articleData = {
        description: description,
        stocktype: stocktype,
        quantity: parseInt(quantity),
        image: uploadedImageUrl // URL de Cloudinary
      };
      console.log(articleData);

      const response = await fetch(`${apiUrl}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData) //se envía como JSON
      });

      if (!response.ok) {
        throw new Error("Hubo un problema en la solicitud");
      }
      const data = await response.json();
      console.log("Artículo guardado", data);
      navigate("/stock");

    } catch (error) { // Captura y maneja cualquier error que ocurra durante el proceso.
      console.error("Error en la solicitud:", error.message);
      console.error("Detalles del error:", error);
      alert("Hubo un problema. Inténtalo de nuevo."); // Si algo salió mal, muestra una alerta.
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-start mt-5 row" style={{ minHeight: "200px" }}>
        <div className="col-12 col-md-8">
          <h1 className="mb-n1 px-md-5 display-4 font-weight-bold" style={{ fontSize: "70px", fontWeight: "bold" }}>Stock</h1>
          <img src={linea} className="mt-2mx-md-5 my-2 img-fluid" style={{ zIndex: 0, maxWidth: "100%", height: "auto" }} alt="Linea decorativa" />
        </div>
        <div className="mt-5">
          <Link to="/stock">
            <button type="button" className="btn btn-primary fw-light" style={{ backgroundColor: "#4F9CF9", border: "none" }}>
              <i className="fa-solid fa-arrow-left" /> Back
            </button>
          </Link>
        </div>

        <div className="col-12 col-md-6 mt-5">
          <div className="card mb-5 mt-5" style={{ width: "18rem", backgroundColor: "#FFE492" }}>
            <Image
              //'cloudName' es el nombre de la cuenta de cloudinary
              //'publicID' viene dado en la imagen que se sube
              className="mt-3" cloudName="dohlrocq4" publicId={imageUrl} />

            <form onSubmit={(e) => { e.preventDefault(); saveArticle(); }}>
              <div className="card-body">
                <div className="mb-2">
                  <label htmlFor="formFileSm" className="form-label fw-light fs-6">Upload image</label>
                  <input className="form-control form-control-sm" id="formFileSm" type="file" style={{ backgroundColor: "#D3E7FF" }}
                    //maneja la selección y guardado del archivo de imagen del artículo
                    onChange={(event) => { setImageSelected(event.target.files[0]); }} required />
                </div>

                <div className="mb-2">
                  <input type="text" className="form-control form-control-lg fw-light fs-6 input" style={{ backgroundColor: "#D3E7FF" }}
                    value={description} onChange={(e) => setDescription(e.target.value)} id="description" name="description" placeholder="Description" required />
                </div>

                <div className="mb-2">
                  <select className="form-select fw-light fs-6" style={{ backgroundColor: "#D3E7FF", color: "#4F9CF9" }} value={stocktype} onChange={(e) => setStocktype(e.target.value)} required>
                    <option value="">Type</option>
                    <option value="monitor">Screen</option>
                    <option value="teclado">Keyboard</option>
                    <option value="cable">Cable</option>
                    <option value="mouse">Mouse</option>
                    <option value="camara">Webcam</option>
                  </select>
                </div>

                <div className="mb-2">
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
    </div>
  );
}

export default NewArticle