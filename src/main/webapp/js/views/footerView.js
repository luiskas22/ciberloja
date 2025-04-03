const FooterView = {
    renderFooter(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="container text-center">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <h5>Contato</h5>
                        <p><i class="fas fa-envelope me-2"></i>Email: geral@ciberloja.pt</p>
                        <p><i class="fas fa-phone me-2"></i>Telefone: +351 252 873 365</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5>Endereço</h5>
                        <p><i class="fas fa-map-marker-alt me-2"></i>Rua João Bento Padilha Edifício do, Loja U, 4795-076 Vila das Aves</p>
                        <p>Vila das Aves, Portugal</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5>Redes Sociais</h5>
                        <div class="social-links">
                            <a href="https://www.facebook.com/p/Ciberloja-Sistemas-Inform%C3%A1ticos-100052847127155/" class="me-2" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://www.instagram.com/ciberloja/" class="me-2" target="_blank"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <hr>
                <p class="mb-0">© 2025 Ciberloja. Todos os direitos reservados.</p>
            </div>
        `;
    },
};

export default FooterView;