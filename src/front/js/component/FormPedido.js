import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'; //Permite crear enlaces de navegación entre páginas.
import linea from "./../../img/linea.png";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { CardPedido } from "./CardPedido";

export const FormPedido = () => {
    const { store, actions } = useContext(Context);
    const [search, setSearch] = useState(""); // Estado para el valor del buscador
    const [pedidos, setPedidos] = useState([]); // Estado para guardar los pedidos (búsquedas)
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [pendingPedido, setPendingPedido] = useState(null); // Estado para el pedido pendiente
    const [currentDate, setCurrentDate] = useState(""); // Estado para guardar la fecha actual
    const [selectedType, setSelectedType] = useState(""); // Tipo de producto seleccionado
    const [products, setProducts] = useState([]); // Estado para los productos
    const [articles, setArticles] = useState([]); // Estado para guardar los artículos obtenidos
    const navigate = useNavigate(); //Para redirigir a otras páginas
    const apiUrl = process.env.BACKEND_URL; // URL base de la API desde las variables de entorno
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");
    const [quantity, setQuantity] = useState(0);
    const { detail_id } = useParams(); //Accedemos a los parámetros dinámicos de la URL como "detail_id".
    const token = localStorage.getItem("jwt_token"); //Obtiene el token de autenticación almacenado.
    const selected = store.selected;
	
    console.log({selected:selected});
    console.log({pedidos:pedidos});
    
    // Función para obtener los productos de un tipo seleccionado

    const getProductsByType = async (type) => {
        console.log('Fetching products of type:', type); // Agregar log para verificar qué tipo se está enviando
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/search?type=${type}`, { // Pasamos el "type" como parámetro de la URL
                method: 'POST', // Método POST según la API definida en el backend
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Autenticación mediante el token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); // Parseamos la respuesta
            console.log("Productos recibidos:", data); // Log de productos recibidos
            setProducts(data.article || []); // Guardamos los productos obtenidos para el tipo seleccionado
        } catch (error) {
            console.log("Error en la solicitud:", error);
            alert("Error al obtener los productos del tipo seleccionado.");
        }
    };

    // Función que añade el producto seleccionado al pedido
    const addProductToOrder = (product) => {
        setPedidos([...pedidos, { descripcion: product.description, cantidad: 1 }]); // Añadimos el producto a pedidos
        setShowModal(false); // Cerramos el modal
    };
	
    // Función para manejar la selección de un tipo de producto

    const handleSelectType = (event) => {
        const selectedValue = event.target.value;  // Obtener el valor seleccionado en el dropdown
        setSelectedType(selectedValue);  // Guardar el valor seleccionado en el estado
        if (selectedValue) {
            getProductsByType(selectedValue);  // Llamar a la función para obtener los productos del tipo seleccionado
            setShowModal(true);  // Mostrar el modal con los productos
        }
    };

    const handleSelectedClick = (product) => {
        // Si el producto ya está en el carrito, no se añade de nuevo
        if (selected.some(p => p.description === product.description)) {
            alert("Este producto ya está en el carrito");
        } else {
            // Agregar producto con cantidad inicial de 1
            actions.handleSelected({ ...product, cantidad: 1 });
        }
    };
    

    // Función para manejar el cambio de fechas
    const handleDatesChange = (index,start, end) => {
        setInitialDate(start);
        setFinalDate(end);
        const nuevosSeleccionados = [...selected];
        nuevosSeleccionados[index].initialDate = start;
        console.log(end);
        
        nuevosSeleccionados[index].finalDate = end;
        actions.setSelected(nuevosSeleccionados);
    };
    // Función para actualizar la cantidad de un pedido
    const actualizarCantidad = (index, nuevaCantidad) => {
        const nuevosSeleccionados = [...selected];
        nuevosSeleccionados[index].cantidad = nuevaCantidad; // Actualizar la cantidad en el estado 'selected'
        actions.setSelected(nuevosSeleccionados); // Usamos la acción para actualizar el estado global
    };
 

    {/* FrontPedido */ }
    const addForm = async (event) => {
        event.preventDefault();
        if (!initialDate || !finalDate) {
            alert('Por favor selecciona ambas fechas.');
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    
                    currentDate,
                    details: selected.map(item => ({
                        formId: orderRandomNumber,
                        stockId: item.id,  // Id del producto
                        description: item.description,
                        quantity: item.cantidad,  // La cantidad actualizada
                        initialDate:item.initialDate,
                        finalDate: item.finalDate,
                        stocktype: item.type // El tipo de producto
                    }))
                })
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            if (data.message === "Form and details created successfully") {
                navigate('/stock');
            } else {
                alert("Error al crear formulario");
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
            alert("Error al crear formulario. Inténtalo de nuevo");
        }
    };
    const updateForm = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (!initialDate || !finalDate) { //Validar ambas fechas.
            alert('Por favor selecciona ambas fechas.');
            return;
        }
        try {
            const response = await fetch(`${apiUrl}form/${detail_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` //Autorizamos al usuario a hacer la solicitud
                },
                body: JSON.stringify({
                    initialDate,
                    finalDate,
                    quantity
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.msg === "DetailForm updated successfully") {
                navigate('/stock'); //PREGUNTAR Y MODIFICAR(PÁGINA PRINCIPAL?)
            } else {
                alert("Error al actualizar formulario")
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
            alert("Error al actualizar el formulario. Inténtalo de nuevo");
        }
    }


    // Función para manejar el clic en el ícono de búsqueda y abrir el modal
    const handleSearchClick = () => {
        if (!selectedType) {
            alert('Por favor, selecciona un tipo de producto antes de buscar.');
            return;
        }
        // Cargar productos del tipo seleccionado
        getProductsByType(selectedType);
    };

    // Función para eliminar un pedido de la lista
    const eliminarPedido = (index) => {
        // Filtrar los pedidos eliminando el que tiene el id que recibimos
        const nuevosPedidos = pedidos.filter((_, i) => i !== index);
        setPedidos(nuevosPedidos); // Actualizar el estado con la nueva lista
    };

    


    // Función para el conteo de productos pedidos
    function countPedidos() {
        const totalPedidos = pedidos.reduce((total, pedido) => total + pedido.cantidad, 0);
        let maxPedidos = 5;
        let quedanTantosPedidos = maxPedidos - totalPedidos;

        if (quedanTantosPedidos === 0) {
            return <span style={{ color: "red" }}>Has alcanzado el máximo de productos por pedir.</span>;
        }
        if (quedanTantosPedidos === 1) {
            return <span style={{ color: "orange" }}>Queda 1 producto.</span>;
        }
        return <span>Quedan {quedanTantosPedidos} productos.</span>;
    };

    const orderRandomNumber = Math.floor(1000 + Math.random() * 9000);

    // Función para obtener la fecha actual y formatearla a dd.mm.yyyy
    useEffect(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        setCurrentDate(formattedDate); // Guardamos la fecha formateada en el estado
    }, []);

    return (
        <div>
            <div>
                <div className="container mt-auto p-3 d-flex flex-column min-vh-100">
                    <div className="row justify-content-start text-start mb-4 col-6">
                        <div className="col-12">
                            <h1 className="mb-n1 px-5" style={{ position: "relative", zIndex: 1, fontSize: "80px", fontWeight: "bold" }}>Order</h1>
                            <img className="mt-2" src={linea} />
                        </div>
                    </div>
                    {/* Información de la orden */}
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-3 text-center">
                            <h6 style={{ color: "#043873" }}><strong>Order #{orderRandomNumber}</strong></h6>
                        </div>
                        <div className="col-md-3 text-center">
                            <h6 style={{ color: "#043873" }}><strong>{currentDate}</strong></h6>
                        </div>
                        <div className="col-md-3 text-center">
                            <h6 style={{ color: "#043873" }}><strong>
                                {store.user && store.user.firstName && store.user.lastName
                                    ? `${store.user.firstName} ${store.user.lastName}`
                                    : "Usuario"}
                            </strong></h6>
                        </div>
                    </div>
                    <p style={{ color: "lightgray" }}>Remember that you have a max of 5 products.</p>
                    {/* Barra de búsqueda */}
                    <div className="row mb-4">
                        <div className="col-12 col-md-9">
                            <div className="input-group">
                                <select
                                    className="form-select fw-light fs-6"
                                    style={{ backgroundColor: "#D3E7FF", color: "#4F9CF9" }}
                                    value={selectedType}
                                    onChange={handleSelectType}
                                    required
                                >
                                    <option value="">Select a product type</option> {/* Opción por defecto */}
                                    <option value="monitor">Screen</option>
                                    <option value="teclado">Keyboard</option>
                                    <option value="cable">Cable</option>
                                    <option value="mouse">Mouse</option>
                                    <option value="camara">Webcam</option>
                                </select>
                                {/* Icono de búsqueda */}
                                <button
                                    className="input-group-text"
                                    style={{ backgroundColor: "#4F9CF9", cursor: "pointer" }}
                                    onClick={handleSearchClick} // Manejar clic en el ícono de búsqueda
                                >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#043873" }} />
                                </button>
                            </div>
                            {/* Modal para seleccionar productos */}
                            {showModal && (
                                <div className="modal fade show" style={{ display: "block" }}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Product type: {selectedType}</h5>
                                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                            </div>
                                            <div className="modal-body">
                                                <ul>
                                                    {products.map((product, index) => (
                                                        <li key={index}>
                                                            <button className="btn btn-link" onClick={() => handleSelectedClick(product)}>{product.description}</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-12 col-md-3 text-md-end text-center">
                            <button onClick={addForm} type="submit" className="btn btn-primary fw-light align-text-center" style={{ backgroundColor: "#4F9CF9", border: "none", width: "150px" }} >
                                <strong>Order</strong>
                            </button>
                        </div>
                    </div>
                    {/* Lista de Artículos en carrito */}
                    <div className="col-12 mb-3" >
                        {selected.map((cart, index) => (
                            <CardPedido
                                key={index}
                                article={cart}
                                index={index}
                                onDatesChange={handleDatesChange}
                                onCantidadChange={actualizarCantidad} />
                        ))}
                    </div>
                </div >
            </div>
        </div>
    );
};