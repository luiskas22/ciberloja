import ApiClient from './proxy/ApiClient.js';
import DefaultApi from './proxy/api/DefaultApi.js';

const apiClient = new ApiClient();
const defaultApi = new DefaultApi(apiClient);

const SessionService = {
	async login(credentials) {
	    try {
	        console.log("Enviando datos de login:", credentials);

	        const response = await fetch("http://localhost:8080/ciberloja-rest-api/api/cliente/autenticar", {
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

	        // Detailed logging
	        console.log('Login Response Details:', {
	            status: response.status,
	            statusText: response.statusText,
	            headers: Object.fromEntries(response.headers.entries())
	        });

	        // Handle different response scenarios
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

	        // Parse response
	        const data = await response.json();

	        // Validate response data
	        if (!data || Object.keys(data).length === 0) {
	            throw new Error("No se recibieron datos de usuario válidos");
	        }

	        console.log("Cliente autenticado con éxito:", data);
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

	        const response = await fetch("http://localhost:8080/ciberloja-rest-api/api/cliente/registrar", {
	            method: "POST",
	            headers: {
	                "Content-Type": "application/x-www-form-urlencoded",
	            },
	            body: formData.toString(),
	        });

	        // Log full response for debugging
	        console.log('Full response:', {
	            status: response.status,
	            statusText: response.statusText,
	            headers: Object.fromEntries(response.headers.entries())
	        });

	        // Try to get response text for more details
	        const responseText = await response.text();
	        console.log('Response text:', responseText);

	        if (!response.ok) {
	            throw new Error(`Error ${response.status}: ${responseText || 'Unknown server error'}`);
	        }

	        // Try to parse JSON if possible
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
	}

};

export default SessionService;