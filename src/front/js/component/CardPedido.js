import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCalendar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CardPedido = ({ article, onCantidadChange, onDatesChange }) => {
    const { store, actions } = useContext(Context);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);  // Controla si el calendario está abierto
    const [cantidad, setCantidad] = useState(0);

    // Función para aumentar la cantidad
    const incrementarCantidad = () => {
        if (cantidad < article.quantity) {
            setCantidad(cantidad + 1); // Incrementa la cantidad
        }
    };

    // Función para disminuir la cantidad (evitando que sea menor que 1)
    const decrementarCantidad = () => {
        if (cantidad > 0) {
            setCantidad(cantidad -1); // Decrementa la cantidad
        }
    };

    // Función para alternar el calendario
    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    // Cada vez que las fechas cambien, llamamos a onDatesChange para pasarlas al componente padre
    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        onDatesChange(start, end); // Pasamos las fechas al componente padre

        // Si ambas fechas están seleccionadas, cerramos el calendario
        if (start && end) {
            setIsCalendarOpen(false);  // Cerramos el calendario
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-body d-flex flex-wrap justify-content-between align-items-center" style={{ backgroundColor: "#FFE492" }}>

                {/* Descripción del pedido (siempre alineada a la izquierda) */}
                <span className="fs-5 col-12 col-md-6 mb-2 mb-md-0">{article.description}</span>

                {/* Controles y stock (en resoluciones grandes se alinea a la derecha, en pequeñas se reordena) */}
                <div className="d-flex flex-wrap align-items-center justify-content-between col-12 col-md-6">
                    {/* Stock disponible */}
                    <span className="me-4" style={{ fontWeight: "bold" }}>STOCK DISPONIBLE: {article.quantity}</span>

                    {/* Botón de calendario */}
                    <button className="btn me-4 p-0" style={{ fontSize: "24px" }} onClick={toggleCalendar}>
                        <FontAwesomeIcon icon={faCalendar} />
                    </button>
                    {isCalendarOpen && (
                            <div className="position-absolute" style={{ zIndex: 999 }}>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => handleDateChange(date, endDate)}  // Set start date
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Fecha inicial"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setIsCalendarOpen(false);
                                    } } // Set end date
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}  // La fecha final no puede ser anterior a la inicial
                                    placeholderText="Fecha final"
                                />
                            </div>
                        )}
                    

                    {/* Control de cantidad */}
                    <div className="d-flex align-items-center">
                        <button
                            onClick={incrementarCantidad}
                            className="btn btn-sm btn-outline-success p-0 ms-2"
                            style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>

                        <span className="m-2"> {cantidad}</span>

                        <button
                            onClick={decrementarCantidad}
                            className="btn btn-sm btn-outline-danger p-0 ms-2"
                            style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                    </div>

                    {/* Botón de eliminación */}
                    <button
                        className="btn btn-sm btn-outline-danger ms-md-4 mt-2 mt-md-0"  // Margin en pantallas grandes, pero no en pequeñas
                        onClick={() => actions.handleSelected(article)}
                        style={{ fontSize: "24px" }}
                    >
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                </div>
            </div>
        </div>
    );
};
