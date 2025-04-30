import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

const apiClient = new ApiClient();
const defaultApi = new DefaultApi(apiClient);

const SessionService = {
	async login(credentials) {
		try {
			console.log("Enviando datos de login:", credentials);

			const response = await fetch("http://192.168.99.40:8080/ciberloja-rest-api/api/cliente/autenticar", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					email: credentials.username,
					password: credentials.password
				})
			});

			console.log('Login Response Details:', {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers.entries())
			});

			if (response.status === 401) {
				const errorData = await response.json();
				throw new Error(errorData.mensaje || "Credenciales inválidas");
			}

			if (response.status === 400) {
				const errorData = await response.json();
				throw new Error(errorData.mensaje || "Error en la solicitud");
			}

			if (response.status === 500) {
				const errorData = await response.json();
				throw new Error(errorData.mensaje || "Error interno del servidor");
			}

			if (!response.ok) {
				throw new Error(`Error de autenticación: ${response.status}`);
			}

			const data = await response.json();
			console.log("Datos recibidos del servidor:", data);

			if (!data.hasOwnProperty('rol_id')) {
				console.warn("El servidor no devolvió un rol_id, usando valor por defecto (1)");
				data.rol_id = 1;
			}

			return data;
		} catch (error) {
			console.error("Error de autenticación:", {
				message: error.message,
				name: error.name,
				stack: error.stack
			});
			throw error;
		}
	},

	async registrar(clienteData) {
		try {
			console.log("Enviando datos de registro:", clienteData);

			const formData = new URLSearchParams();
			Object.keys(clienteData).forEach(key => {
				formData.append(key, clienteData[key]);
			});

			console.log("Enviando datos al API:", formData.toString());

			const response = await fetch("http://192.168.99.40:8080/ciberloja-rest-api/api/cliente/registrar", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formData.toString(),
			});

			console.log('Full response:', {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers.entries())
			});

			const responseText = await response.text();
			console.log('Response text:', responseText);

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${responseText || 'Unknown server error'}`);
			}

			let data = {};
			try {
				data = responseText ? JSON.parse(responseText) : {};
			} catch (parseError) {
				console.error('Failed to parse response:', parseError);
				throw new Error('Failed to parse server response');
			}

			console.log("Cliente registrado con éxito:", data);
			return data;
		} catch (error) {
			console.error("Detalles completos del error al registrar el usuario:", {
				message: error.message,
				name: error.name,
				stack: error.stack
			});
			throw error;
		}
	},

	async loginEmpleado(credentials) {
		try {
			console.log("Enviando datos de login para empleado:", credentials);

			const response = await fetch("http://192.168.99.40:8080/ciberloja-rest-api/api/empleado/autenticar", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					id: credentials.id,
					password: credentials.password
				})
			});

			console.log('Login Response Details:', {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers.entries())
			});

			if (response.status === 401) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Credenciales inválidas");
			}

			if (response.status === 400) {
				const errorData = await response.json();
				throw new Error(errorData.error || "ID y contraseña son requeridos");
			}

			if (response.status === 500) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Error interno del servidor");
			}

			if (!response.ok) {
				throw new Error(`Error de autenticación: ${response.status}`);
			}

			const data = await response.json();

			if (!data || Object.keys(data).length === 0) {
				throw new Error("No se recibieron datos de empleado válidos");
			}

			if (data.token) {
				localStorage.setItem('empleadoToken', data.token);
				localStorage.setItem('empleadoRol', data.rol || '');
			}

			console.log("Empleado autenticado con éxito:", data);
			return data;
		} catch (error) {
			console.error("Error de autenticación de empleado:", {
				message: error.message,
				name: error.name,
				stack: error.stack
			});
			throw error;
		}
	},

	async forgotPassword(email) {
		try {
			console.log("Enviando solicitud de restablecimiento de contraseña para:", email);

			const response = await fetch("http://192.168.99.40:8080/ciberloja-rest-api/api/cliente/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({ email })
			});

			console.log('Forgot Password Response Details:', {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers.entries())
			});

			if (response.status === 400) {
				const errorData = await response.json();
				throw new Error(errorData.mensaje || "Correo electrónico inválido o no registrado");
			}

			if (response.status === 500) {
				const errorData = await response.json();
				throw new Error(errorData.mensaje || "Error interno del servidor");
			}

			if (!response.ok) {
				throw new Error(`Error en la solicitud de restablecimiento: ${response.status}`);
			}

			const data = await response.json();
			console.log("Respuesta del servidor:", data);

			return data; // Returns { mensaje: "Enlace de restablecimiento enviado correctamente" }
		} catch (error) {
			console.error("Error en la solicitud de restablecimiento de contraseña:", {
				message: error.message,
				name: error.name,
				stack: error.stack
			});
			throw error;
		}
	},

	async resetPassword(token, clientId, newPassword) {
		try {
			console.log("Enviando solicitud de cambio de contraseña:", { token, clientId, newPassword });
	
			// Primero intentamos con PUT (más común para actualizaciones)
			let response;
			try {
				const url = new URL("http://192.168.99.40:8080/ciberloja-rest-api/api/cliente/reset-password");
				url.searchParams.append('token', token);
				url.searchParams.append('id', clientId);
				
				response = await fetch(url, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					},
					body: JSON.stringify({ newPassword })
				});
				
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
			} catch (putError) {
				console.log("PUT falló, intentando con POST...", putError);
				
				// Si PUT falla, intentamos con POST
				response = await fetch("http://192.168.99.40:8080/ciberloja-rest-api/api/cliente/reset-password", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					},
					body: JSON.stringify({ 
						token, 
						id: clientId,
						newPassword 
					})
				});
				
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.mensaje || `Error ${response.status}`);
				}
			}
	
			const data = await response.json();
			console.log("Respuesta del servidor:", data);
			return data;
		} catch (error) {
			console.error("Error en el servicio al cambiar contraseña:", {
				message: error.message,
				name: error.name,
				stack: error.stack
			});
			throw error;
		}
	}
};

export default SessionService;