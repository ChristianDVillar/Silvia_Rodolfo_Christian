const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			apiUrl: process.env.BACKEND_URL,
			article: [],
			usertype: [],
			selected: [],
			user: null, // Añadimos un campo user para almacenar los datos del usuario
			userInitials: '' // Campo para almacenar las iniciales del usuario
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},
			
			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo: demo });
			},
			deleteSelected: (description) => {
				const store = getStore();
				setStore({ selected: store.selected.filter(selected => selected[0] !== description) });
			},

			addSelected: (elemento) => {
				const store = getStore();
				setStore({ selected: [...store.selected, elemento] });
			},

			getStock: () => {
				const store = getStore();
				const token = localStorage.getItem("jwt_token");
				fetch(`${store.apiUrl}/stock`, {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						'Authorization': 'Bearer ' + token //authorization token
					}
				})
					.then(response => response.json())
					.then((data) => {
						setStore({ article: data });
					})
					.catch((err) => { console.error(err) });
			},

			getUser: async () => {
				// Obtiene datos del usuario por id
				const store = getStore();
				const token = localStorage.getItem("jwt_token");
				
				try {
					// Petición para obtener toda la información del usuario
					const response = await fetch(`${store.apiUrl}/user`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							'Authorization': 'Bearer ' + token 
						}
					});

					const data = await response.json();

					// Verificar si los datos del usuario están presentes
					if (data && data.data) {
						const user = data.data;
						
						// Calcular las iniciales del usuario
						const firstNameInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
						const lastNameInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
						const initials = `${firstNameInitial}${lastNameInitial}`;
						
						// Guardar los datos del usuario y sus iniciales en el store
						setStore({
							user: user,
							userInitials: initials,
							usertype: user.usertype // Si también necesitas guardar el tipo de usuario
						});
					} else {
						console.error('No se encontraron datos de usuario');
					}
					
				} catch (error) {
					console.error('Error al obtener el usuario:', error);
				}
			},

			deleteArticle: (id) => {
				const store = getStore();
				const actions = getActions();
				fetch(`${store.apiUrl}/stock/${id}`, {
					method: "DELETE",
					headers: {
						'Content-Type': 'application/json',
						accept: "application/json",
					},
				})
					.then(response => {
						if (response.ok) {
							actions.getStock(); // Actualiza la lista de artículos
						} else {
							console.error("Error al eliminar el artículo.");
						}
					})
					.catch((err) => { console.error(err); });
			}
		}
	};
};

export default getState;

