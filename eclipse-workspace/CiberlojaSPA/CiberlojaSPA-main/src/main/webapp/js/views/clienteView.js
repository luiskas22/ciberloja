const ClienteView = {
	getProfileView(clienteData) {
		return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center">Meu Perfil</h2>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${clienteData.nombre} ${clienteData.apellido1}</h5>
                    <p class="card-text">
                        <strong>Nickname:</strong> ${clienteData.nickname}<br>
                        <strong>Email:</strong> ${clienteData.email}<br>
                        <strong>DNI/NIE:</strong> ${clienteData.dniNie}<br>
                        <strong>Telefone:</strong> ${clienteData.telefono || 'Não informado'}
                    </p>
                    <div class="text-center mt-3">
                        <button class="btn btn-primary btn-edit-profile">Editar Perfil</button>
                    </div>
                </div>
            </div>
        </div>
        `;
	},

	getEditProfileModal(cliente) {
		return `
        <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editProfileModalLabel">Editar Perfil</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm">
                            <input type="hidden" name="id" value="${cliente.id}">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" value="${cliente.nombre || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="apellido1" class="form-label">Primer Apellido</label>
                                <input type="text" class="form-control" id="apellido1" name="apellido1" value="${cliente.apellido1 || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="apellido2" class="form-label">Segundo Apellido</label>
                                <input type="text" class="form-control" id="apellido2" name="apellido2" value="${cliente.apellido2 || ''}">
                            </div>
                            <div class="mb-3">
                                <label for="nickname" class="form-label">Nickname</label>
                                <input type="text" class="form-control" id="nickname" name="nickname" value="${cliente.nickname || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email" value="${cliente.email || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="dniNie" class="form-label">DNI/NIE</label>
                                <input type="text" class="form-control" id="dniNie" name="dniNie" value="${cliente.dniNie || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" name="telefono" value="${cliente.telefono || ''}">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="password" name="password" placeholder="Dejar en blanco si no desea cambiarla">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveEditedProfile">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
        `;
	},

	renderProfileUpdateSuccess(message) {
		const resultsContainer = document.getElementById("profileUpdateResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderProfile(containerId, clienteData) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Contêiner não encontrado com ID: ${containerId}`);
			return;
		}
		container.innerHTML = this.getProfileView(clienteData);
	},

	renderProfileUpdateError(message) {
		const resultsContainer = document.getElementById("profileUpdateResults");
		if (resultsContainer) {
			resultsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderError(message) {
		const container = document.getElementById("pro-inventario");
		if (container) {
			container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `;
		}
	},

	renderModal(containerId, modalHtml) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Contêiner não encontrado com ID: ${containerId}`);
			return;
		}
		container.innerHTML += modalHtml;
	}
};

export default ClienteView;