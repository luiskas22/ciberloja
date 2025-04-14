const DireccionView = {
    getAddressesView(direcciones) {
        return `
        <div class="container mt-4">
            <h2 class="mb-4 text-center">Minhas Direções</h2>
            ${direcciones.length > 0 ? `
                <div class="row">
                    ${direcciones.map((dir) => `
                        <div class="col-md-6 mb-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Direção ${dir.id}</h5>
                                    <p class="card-text">
                                        <strong>Rua:</strong> ${dir.nombreVia || 'Não informado'}<br>
                                        <strong>Número:</strong> ${dir.dirVia || 'Não informado'}<br>
                                        <strong>Cidade:</strong> ${dir.localidadNombre || 'Não informado'}<br>
                                        <strong>Provincia:</strong> ${dir.provinciaNombre || 'Não informado'}<br>
                                        <strong>País:</strong> ${dir.paisNombre || 'Não informado'}
                                    </p>
                                    <div class="text-center">
                                        <button class="btn btn-primary btn-sm btn-edit-direccion" data-direccion-id="${dir.id}">Editar</button>
                                        <button class="btn btn-danger btn-sm btn-delete-direccion" data-direccion-id="${dir.id}">Excluir</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="text-center mt-3">
                    <button class="btn btn-success btn-create-direccion">Adicionar Nova Direção</button>
                </div>
            ` : `
                <div class="alert alert-info">
                    Nenhuma direção cadastrada. Deseja adicionar uma?
                    <button class="btn btn-success btn-sm btn-create-direccion ms-2">Adicionar Direção</button>
                </div>
            `}
        </div>
        `;
    },

    getCreateAddressModal(localidades = [], provincias = []) {
        return `
        <div class="modal fade" id="createAddressModal" tabindex="-1" aria-labelledby="createAddressModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createAddressModalLabel">Adicionar Nova Direção</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="createAddressForm">
                            <div class="mb-3">
                                <label for="nombreVia" class="form-label">Rua</label>
                                < травня type="text" class="form-control" id="nombreVia" name="nombreVia" required>
                            </div>
                            <div class="mb-3">
                                <label for="dirVia" class="form-label">Número</label>
                                <input type="text" class="form-control" id="dirVia" name="dirVia" required>
                            </div>
                            <div class="mb-3">
                                <label for="provinciaSelect" class="form-label">Provincia</label>
                                <select class="form-select" id="provinciaSelect" name="provinciaId" required>
                                    <option value="">Seleccione una provincia</option>
                                    ${provincias.map(prov => `
                                        <option value="${prov.id}">${prov.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="localidadSelect" class="form-label">Localidad</label>
                                <select class="form-select" id="localidadSelect" name="localidadId" required>
                                    <option value="">Seleccione una localidad</option>
                                    ${localidades.map(loc => `
                                        <option value="${loc.id}" data-provincia-id="${loc.provinciaId}">${loc.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveNewAddress">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    getEditAddressModal(direccion, { localidades = [], provincias = [], paises = [] }) {
        return `
        <div class="modal fade" id="editAddressModal" tabindex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editAddressModalLabel">Editar Direção ${direccion.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editAddressForm">
                            <input type="hidden" name="id" value="${direccion.id}">
                            <div class="mb-3">
                                <label for="nombreVia" class="form-label">Rua</label>
                                <input type="text" class="form-control" id="nombreVia" name="nombreVia" value="${direccion.nombreVia || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="dirVia" class="form-label">Número</label>
                                <input type="text" class="form-control" id="dirVia" name="dirVia" value="${direccion.dirVia || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="paisSelect" class="form-label">País</label>
                                <select class="form-select" id="paisSelect" name="paisId" required>
                                    <option value="">Seleccione un país</option>
                                    ${paises.map(pais => `
                                        <option value="${pais.id}" ${direccion.paisId == pais.id ? 'selected' : ''}>${pais.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="provinciaSelect" class="form-label">Provincia</label>
                                <select class="form-select" id="provinciaSelect" name="provinciaId" required>
                                    <option value="">Seleccione una provincia</option>
                                    ${provincias.map(prov => `
                                        <option value="${prov.id}" ${direccion.provinciaId == prov.id ? 'selected' : ''}>${prov.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="localidadSelect" class="form-label">Localidad</label>
                                <select class="form-select" id="localidadSelect" name="localidadId" required>
                                    <option value="">Seleccione una localidad</option>
                                    ${localidades.map(loc => `
                                        <option value="${loc.id}" ${direccion.localidadId == loc.id ? 'selected' : ''}>${loc.nombre}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveEditedAddress">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    renderAddresses(containerId, direcciones) {
        console.log("Renderizando direcciones:", JSON.stringify(direcciones, null, 2));
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado con ID: ${containerId}`);
            return;
        }
        try {
            let addressesContainer = container.querySelector('#addresses-list');
            if (!addressesContainer) {
                addressesContainer = document.createElement('div');
                addressesContainer.id = 'addresses-list';
                container.appendChild(addressesContainer);
            }
            const html = this.getAddressesView(direcciones);
            console.log("HTML generado para direcciones:", html);
            addressesContainer.innerHTML = html;
        } catch (error) {
            console.error("Error al renderizar direcciones:", error);
            this.renderError("Error al mostrar las direcciones. Por favor, intenta de nuevo.");
        }
    },

    renderModal(containerId, modalHtml) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contêiner não encontrado com ID: ${containerId}`);
            return;
        }
        container.innerHTML += modalHtml;
    },

    renderProfileUpdateSuccess(message) {
        const container = document.getElementById("pro-inventario");
        if (!container) {
            console.error("Contêiner 'pro-inventario' não encontrado");
            return;
        }
        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-success" role="alert">
                ${message}
            </div>
        `;
    },

    renderError(message) {
        const container = document.getElementById("pro-inventario");
        if (!container) {
            console.error("Contêiner 'pro-inventario' não encontrado");
            return;
        }
        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${message}
            </div>
        `;
    },
};

export default DireccionView;