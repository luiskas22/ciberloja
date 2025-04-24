import Translations from '../resources/translations.js'; // Adjust path as needed

const DireccionView = {
    renderAddresses(containerId, direcciones = [], lang = 'pt') {
        console.log('Rendering addresses:', direcciones);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor no encontrado con ID: ${containerId}`);
            return;
        }

        // Ensure direcciones is an array
        const addressList = Array.isArray(direcciones) ? direcciones : [];

        // Access translations safely
        let t = {};
        try {
            t = Translations[lang]?.direcciones || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        container.innerHTML = `
        <div class="container address-container mt-5">
            <h2 class="address-title mb-4 text-center" data-i18n="direcciones.title">${t.title || 'Mis Direcciones'}</h2>
            ${addressList.length > 0 ? `
                <div class="row g-4">
                    ${addressList.map((dir) => `
                        <div class="col-md-6 col-lg-4">
                            <div class="card address-card h-100">
                                <div class="card-body p-4">
                                    <h5 class="card-title address-card-title mb-3" data-i18n="direcciones.address_title" data-i18n-values='{ "id": "${dir.id}" }'>${t.address_title?.replace('{id}', dir.id) || `Dirección ${dir.id}`}</h5>
                                    <div class="address-details">
                                        <p class="address-item"><i class="fas fa-road me-2"></i><strong data-i18n="direcciones.street">${t.street || 'Calle'}:</strong> ${dir.nombreVia || (t.not_provided || 'No informado')}</p>
                                        <p class="address-item"><i class="fas fa-hashtag me-2"></i><strong data-i18n="direcciones.number">${t.number || 'Número'}:</strong> ${dir.dirVia || (t.not_provided || 'No informado')}</p>
                                        <p class="address-item"><i class="fas fa-city me-2"></i><strong data-i18n="direcciones.city">${t.city || 'Ciudad'}:</strong> ${dir.localidadNombre || (t.not_provided || 'No informado')}</p>
                                        <p class="address-item"><i class="fas fa-map me-2"></i><strong data-i18n="direcciones.province">${t.province || 'Provincia'}:</strong> ${dir.provinciaNombre || (t.not_provided || 'No informado')}</p>
                                        <p class="address-item"><i class="fas fa-globe me-2"></i><strong data-i18n="direcciones.country">${t.country || 'País'}:</strong> ${dir.paisNombre || (t.not_provided || 'No informado')}</p>
                                    </div>
                                    <div class="address-actions mt-4 text-center">
                                        <button class="btn btn-primary btn-sm btn-edit-direccion me-2" data-direccion-id="${dir.id}" data-i18n="direcciones.edit">${t.edit || 'Editar'}</button>
                                        <button class="btn btn-outline-danger btn-sm btn-delete-direccion" data-direccion-id="${dir.id}" data-i18n="direcciones.delete">${t.delete || 'Eliminar'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-success btn-create-direccion" data-i18n="direcciones.add_new">${t.add_new || 'Añadir Nueva Dirección'}</button>
                </div>
            ` : `
                <div class="alert alert-info text-center py-4">
                    <i class="fas fa-info-circle me-2"></i>
                    <span data-i18n="direcciones.no_addresses">${t.no_addresses || 'No hay direcciones registradas. ¿Desea añadir una?'}</span>
                    <div class="mt-3">
                        <button class="btn btn-success btn-create-direccion" data-i18n="direcciones.add">${t.add || 'Añadir Dirección'}</button>
                    </div>
                </div>
            `}
        </div>
        `;
    },

    renderCreateAddressModal(containerId, localidades = [], provincias = [], lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor no encontrado con ID: ${containerId}`);
            return;
        }

        const t = Translations[lang].direcciones || {};
        container.innerHTML += `
        <div class="modal fade" id="createAddressModal" tabindex="-1" aria-labelledby="createAddressModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createAddressModalLabel" data-i18n="direcciones.create_title">${t.create_title || 'Añadir Nueva Dirección'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="createAddressForm">
                            <div class="mb-3">
                                <label for="nombreVia" class="form-label" data-i18n="direcciones.street">${t.street || 'Calle'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-road"></i></span>
                                    <input type="text" class="form-control" id="nombreVia" name="nombreVia" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="dirVia" class="form-label" data-i18n="direcciones.number">${t.number || 'Número'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                                    <input type="text" class="form-control" id="dirVia" name="dirVia" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="provinciaSelect" class="form-label" data-i18n="direcciones.province">${t.province || 'Provincia'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-map"></i></span>
                                    <select class="form-select" id="provinciaSelect" name="provinciaId" required>
                                        <option value="" data-i18n="direcciones.select_province">${t.select_province || 'Seleccione una provincia'}</option>
                                        ${provincias.map(prov => `
                                            <option value="${prov.id}">${prov.nombre}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="localidadSelect" class="form-label" data-i18n="direcciones.city">${t.city || 'Ciudad'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-city"></i></span>
                                    <select class="form-select" id="localidadSelect" name="localidadId" required>
                                        <option value="" data-i18n="direcciones.select_city">${t.select_city || 'Seleccione una ciudad'}</option>
                                        ${localidades.map(loc => `
                                            <option value="${loc.id}" data-provincia-id="${loc.provinciaId}">${loc.nombre}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-i18n="direcciones.cancel">${t.cancel || 'Cancelar'}</button>
                        <button type="button" class="btn btn-primary" id="saveNewAddress" data-i18n="direcciones.save">${t.save || 'Guardar'}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    renderEditAddressModal(containerId, direccion, { localidades = [], provincias = [], paises = [] }, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor no encontrado con ID: ${containerId}`);
            return;
        }

        const t = Translations[lang].direcciones || {};
        container.innerHTML += `
        <div class="modal fade" id="editAddressModal" tabindex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editAddressModalLabel" data-i18n="direcciones.edit_title" data-i18n-values='{ "id": "${direccion.id}" }'>${t.edit_title?.replace('{id}', direccion.id) || `Editar Dirección ${direccion.id}`}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editAddressForm">
                            <input type="hidden" name="id" value="${direccion.id}">
                            <div class="mb-3">
                                <label for="nombreVia" class="form-label" data-i18n="direcciones.street">${t.street || 'Calle'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-road"></i></span>
                                    <input type="text" class="form-control" id="nombreVia" name="nombreVia" value="${direccion.nombreVia || ''}" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="dirVia" class="form-label" data-i18n="direcciones.number">${t.number || 'Número'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                                    <input type="text" class="form-control" id="dirVia" name="dirVia" value="${direccion.dirVia || ''}" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="paisSelect" class="form-label" data-i18n="direcciones.country">${t.country || 'País'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-globe"></i></span>
                                    <select class="form-select" id="paisSelect" name="paisId" required>
                                        <option value="" data-i18n="direcciones.select_country">${t.select_country || 'Seleccione un país'}</option>
                                        ${paises.map(pais => `
                                            <option value="${pais.id}" ${direccion.paisId == pais.id ? 'selected' : ''}>${pais.nombre}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="provinciaSelect" class="form-label" data-i18n="direcciones.province">${t.province || 'Provincia'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-map"></i></span>
                                    <select class="form-select" id="provinciaSelect" name="provinciaId" required>
                                        <option value="" data-i18n="direcciones.select_province">${t.select_province || 'Seleccione una provincia'}</option>
                                        ${provincias.map(prov => `
                                            <option value="${prov.id}" ${direccion.provinciaId == prov.id ? 'selected' : ''}>${prov.nombre}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="localidadSelect" class="form-label" data-i18n="direcciones.city">${t.city || 'Ciudad'}</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-city"></i></span>
                                    <select class="form-select" id="localidadSelect" name="localidadId" required>
                                        <option value="" data-i18n="direcciones.select_city">${t.select_city || 'Seleccione una ciudad'}</option>
                                        ${localidades.map(loc => `
                                            <option value="${loc.id}" ${direccion.localidadId == loc.id ? 'selected' : ''}>${loc.nombre}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-i18n="direcciones.cancel">${t.cancel || 'Cancelar'}</button>
                        <button type="button" class="btn btn-primary" id="saveEditedAddress" data-i18n="direcciones.save">${t.save || 'Guardar'}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    renderProfileUpdateSuccess(containerId, message, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' no encontrado`);
            return;
        }
        const t = Translations[lang].direcciones || {};
        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert" data-i18n="direcciones.success_message">
                ${message || t.success_message || 'Operación completada con éxito.'}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    },

    renderError(containerId, message, lang = 'pt') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' no encontrado`);
            return;
        }

        const defaultMessage = 'Ocurrió un error. Por favor, intenta de nuevo.';
        let localizedMessage = message;

        try {
            const t = Translations[lang]?.direcciones || {};
            if (!message) {
                localizedMessage = t.error_message || defaultMessage;
            }
        } catch (e) {
            console.warn('Translation not available, using default message');
            localizedMessage = message || defaultMessage;
        }

        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" data-i18n="direcciones.error_message">
                ${localizedMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
};

export default DireccionView;