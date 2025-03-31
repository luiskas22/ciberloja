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
                        <a href="#cliente/editar" class="btn btn-primary">Editar Perfil</a>
                    </div>
                </div>
            </div>
        </div>
        `;
	},
	getAddressesView(direcciones) {
		return `
	        <div class="container mt-4">
	            <h2 class="mb-4 text-center">Minhas Direções</h2>
	            ${direcciones.length > 0 ? `
	                <div class="row">
	                    ${direcciones.map((dir, index) => `
	                        <div class="col-md-6 mb-3">
	                            <div class="card">
	                                <div class="card-body">
	                                    <h5 class="card-title">Direção ${index + 1}</h5>
	                                    <p class="card-text">
	                                        <strong>Rua:</strong> ${dir.nombreVia || 'Não informado'}<br>
	                                        <strong>Número:</strong> ${dir.dirVia || 'Não informado'}<br>
	                                        <strong>Cidade:</strong> ${dir.localidadNombre || 'Não informado'}<br>
											<strong>Provincia:</strong> ${dir.provinciaNombre || 'Não informado'}<br>
	                                        <strong>País:</strong> ${dir.paisNombre || 'Não informado'}
	                                    </p>
	                                    <div class="text-center">
	                                        <a href="#direcciones/editar/${index}" class="btn btn-primary btn-sm">Editar</a>
	                                        <button class="btn btn-danger btn-sm">Excluir</button>
	                                    </div>
	                                </div>
	                            </div>
	                        </div>
	                    `).join('')}
	                </div>
	                <div class="text-center mt-3">
	                    <a href="#direcciones/nueva" class="btn btn-success">Adicionar Nova Direção</a>
	                </div>
	            ` : `
	                <div class="alert alert-info">
	                    Nenhuma direção cadastrada. Deseja adicionar uma?
	                    <a href="#direcciones/nueva" class="btn btn-success btn-sm ms-2">Adicionar Direção</a>
	                </div>
	            `}
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
	
	renderAddresses(containerId, direcciones) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Contêiner não encontrado com ID: ${containerId}`);
			return;
		}
		container.innerHTML = this.getAddressesView(direcciones);
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
	}
};

export default ClienteView;