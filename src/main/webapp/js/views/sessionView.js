const SessionView = {
	getLoginForm() {
		return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center">Iniciar Sesión</h2>
            <form id="loginForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-12">
                        <label for="loginEmail" class="form-label">Email:</label>
                        <input type="text" id="loginEmail" class="form-control" placeholder="Ingrese su email" required>
                    </div>
                    <div class="col-md-12">
                        <label for="loginPassword" class="form-label">Contraseña:</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="Ingrese su contraseña" required>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                </div>
            </form>
            <div id="loginResults" class="mt-4"></div>
        </div>
        `;
	},

	getRegisterForm() {
		return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center">Registrar Nuevo Cliente</h2>
            <form id="registerForm" class="bg-light p-4 rounded shadow-sm">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="registerNickname" class="form-label">Nickname:</label>
                        <input type="text" id="registerNickname" class="form-control" placeholder="Ingrese nickname" required>
                    </div>
                    <div class="col-md-6">
                        <label for="registerNombre" class="form-label">Nombre:</label>
                        <input type="text" id="registerNombre" class="form-control" placeholder="Ingrese nombre" required>
                    </div>
                    <div class="col-md-6">
                        <label for="registerApellido1" class="form-label">Primer Apellido:</label>
                        <input type="text" id="registerApellido1" class="form-control" placeholder="Ingrese primer apellido">
                    </div>
                    <div class="col-md-6">
                        <label for="registerApellido2" class="form-label">Segundo Apellido:</label>
                        <input type="text" id="registerApellido2" class="form-control" placeholder="Ingrese segundo apellido">
                    </div>
                    <div class="col-md-6">
                        <label for="registerDniNie" class="form-label">DNI/NIE:</label>
                        <input type="text" id="registerDniNie" class="form-control" placeholder="Ingrese DNI o NIE">
                    </div>
                    <div class="col-md-6">
                        <label for="registerEmail" class="form-label">Email:</label>
                        <input type="email" id="registerEmail" class="form-control" placeholder="Ingrese email" required>
                    </div>
                    <div class="col-md-6">
                        <label for="registerTelefono" class="form-label">Teléfono:</label>
                        <input type="text" id="registerTelefono" class="form-control" placeholder="Ingrese teléfono">
                    </div>
                    <div class="col-md-6">
                        <label for="registerPassword" class="form-label">Contraseña:</label>
                        <input type="password" id="registerPassword" class="form-control" placeholder="Ingrese contraseña" required>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <button type="submit" class="btn btn-success">Registrar</button>
                </div>
            </form>
            <div id="registerResults" class="mt-4"></div>
        </div>
        `;
	},

	render(containerId, type) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`No se encontró el contenedor con ID: ${containerId}`);
			return;
		}
		container.innerHTML = '';
		if (type === "login") {
			container.innerHTML = this.getLoginForm();
		} else if (type === "register") {
			container.innerHTML = this.getRegisterForm();
		}
	},

	renderLoginSuccess(message) {
		const resultsContainer = document.getElementById("loginResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderLoginError(message) {
		const resultsContainer = document.getElementById("loginResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderRegisterSuccess(message) {
		const resultsContainer = document.getElementById("registerResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderRegisterError(message) {
		const resultsContainer = document.getElementById("registerResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `;
		}
	},
	renderLogoutSuccess(message) {
		const container = document.getElementById("pro-inventario");
		container.innerHTML = `
	            <div class="alert alert-success">${message}</div>
	        `;
	},
};

export default SessionView;