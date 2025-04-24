import Translations from '../resources/translations.js'; // Adjust path as needed

const ClienteView = {
    renderProfile(containerId, clienteData, lang = 'es') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor no encontrado con ID: ${containerId}`);
            return;
        }

        // Access translations safely
        let t = {};
        try {
            t = Translations[lang]?.cliente || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        container.innerHTML = `
        <div class="container profile-container mt-5">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-md-10">
                    <div class="card profile-card">
                        <div class="card-body p-4">
                            <div class="text-center mb-4">
                                <h2 class="profile-title mt-3" data-i18n="cliente.profile_title">${t.profile_title || 'Mi Perfil'}</h2>
                                <p class="profile-subtitle text-muted">${clienteData.nickname}</p>
                            </div>
                            
                            <div class="profile-info-grid">
                                <div class="profile-info-item">
                                    <i class="fas fa-envelope me-2 text-primary"></i>
                                    <div>
                                        <strong class="d-block" data-i18n="cliente.email">${t.email || 'Correo Electrónico'}</strong>
                                        <span>${clienteData.email}</span>
                                    </div>
                                </div>
                                <div class="profile-info-item">
                                    <i class="fas fa-id-card me-2 text-primary"></i>
                                    <div>
                                        <strong class="d-block" data-i18n="cliente.dni_nie">${t.dni_nie || 'DNI/NIE'}</strong>
                                        <span>${clienteData.dniNie}</span>
                                    </div>
                                </div>
                                <div class="profile-info-item">
                                    <i class="fas fa-phone me-2 text-primary"></i>
                                    <div>
                                        <strong class="d-block" data-i18n="cliente.phone">${t.phone || 'Teléfono'}</strong>
                                        <span>${clienteData.telefono || (t.not_provided || 'No proporcionado')}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="profile-actions mt-4 text-center">
                                <button class="btn btn-primary btn-edit-profile me-2" data-i18n="cliente.edit_profile">${t.edit_profile || 'Editar Perfil'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    renderEditProfileModal(containerId, cliente, lang = 'es') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor no encontrado con ID: ${containerId}`);
            return;
        }

        let t = {};
        try {
            t = Translations[lang]?.cliente || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        container.innerHTML += `
        <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editProfileModalLabel" data-i18n="cliente.edit_modal_title">${t.edit_modal_title || 'Editar Perfil'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm">
                            <input type="hidden" name="id" value="${cliente.id}">
                            <div class="mb-3">
                                <label for="nombre" class="form-label" data-i18n="cliente.first_name">${t.first_name || 'Nombre'}</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" value="${cliente.nombre || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="apellido1" class="form-label" data-i18n="cliente.last_name_1">${t.last_name_1 || 'Primer Apellido'}</label>
                                <input type="text" class="form-control" id="apellido1" name="apellido1" value="${cliente.apellido1 || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="apellido2" class="form-label" data-i18n="cliente.last_name_2">${t.last_name_2 || 'Segundo Apellido'}</label>
                                <input type="text" class="form-control" id="apellido2" name="apellido2" value="${cliente.apellido2 || ''}">
                            </div>
                            <div class="mb-3">
                                <label for="nickname" class="form-label" data-i18n="cliente.nickname">${t.nickname || 'Apodo'}</label>
                                <input type="text" class="form-control" id="nickname" name="nickname" value="${cliente.nickname || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label" data-i18n="cliente.email">${t.email || 'Correo Electrónico'}</label>
                                <input type="email" class="form-control" id="email" name="email" value="${cliente.email || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="dniNie" class="form-label" data-i18n="cliente.dni_nie">${t.dni_nie || 'DNI/NIE'}</label>
                                <input type="text" class="form-control" id="dniNie" name="dniNie" value="${cliente.dniNie || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label" data-i18n="cliente.phone">${t.phone || 'Teléfono'}</label>
                                <input type="text" class="form-control" id="telefono" name="telefono" value="${cliente.telefono || ''}">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label" data-i18n="cliente.password">${t.password || 'Contraseña'}</label>
                                <input type="password" class="form-control" id="password" name="password" placeholder="${t.password_placeholder || 'Dejar en blanco si no desea cambiarla'}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="cliente.cancel">${t.cancel || 'Cancelar'}</button>
                        <button type="button" class="btn btn-primary" id="saveEditedProfile" data-i18n="cliente.save">${t.save || 'Guardar'}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    renderProfileUpdateSuccess(containerId, message, lang = 'es') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' no encontrado`);
            return;
        }

        let t = {};
        try {
            t = Translations[lang]?.cliente || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-success" role="alert" data-i18n="cliente.profile_updated">${message || t.profile_updated || 'Perfil actualizado correctamente.'}</div>
        `;
    },

    renderProfileUpdateError(containerId, message, lang = 'es') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' no encontrado`);
            return;
        }

        let t = {};
        try {
            t = Translations[lang]?.cliente || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-danger" role="alert" data-i18n="cliente.error_updating">${message || t.error_updating || 'Error al actualizar el perfil. Por favor, intenta de nuevo.'}</div>
        `;
    },

    renderError(containerId, message, lang = 'es') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor '${containerId}' no encontrado`);
            return;
        }

        let t = {};
        try {
            t = Translations[lang]?.cliente || {};
        } catch (e) {
            console.warn('Translation not available:', e);
        }

        let messagesContainer = container.querySelector('#messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.id = 'messages';
            container.prepend(messagesContainer);
        }
        messagesContainer.innerHTML = `
            <div class="alert alert-danger" role="alert" data-i18n="cliente.error_loading">${message || t.error_loading || 'No fue posible cargar los datos del perfil.'}</div>
        `;
    }
};

export default ClienteView;