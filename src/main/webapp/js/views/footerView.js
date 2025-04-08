const FooterView = {
    renderFooter(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="container text-center">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <h5><a href="#contacto" class="contact-link">Entre em contacto connosco</a></h5>
                        <p><i class="fas fa-envelope me-2"></i>Email: geral@ciberloja.pt</p>
                        <p><i class="fas fa-phone me-2"></i>Telefone: +351 252 873 365</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5><a href="#servicos" class="services-link">Os nossos serviços</a></h5>
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

    renderContact(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <main class="contact-container">
                <section class="contact-section">
                    <h2>Contacto</h2>
                    <p>Tem alguma dúvida? Entre em contacto connosco! Estamos aqui para ajudar.</p>
                    <div class="contact-info">
                        <h3>Informações de Contacto</h3>
                        <ul>
                            <li><strong>Telefone:</strong> +351 252 873 365</li>
                            <li><strong>Correio Eletrónico:</strong> <a href="mailto:geral@ciberloja.com">geral@ciberloja.com</a></li>
                            <li><strong>Horário de Atendimento:</strong> Segunda a Sexta, 9:00-12:30 e 14:30-19:00</li>
                        </ul>
                    </div>
                    <div class="location">
                        <h3>A Nossa Localização</h3>
                        <p>Estamos localizados no coração de Vila das Aves, Portugal. Visite-nos em:</p>
                        <p><strong>Endereço:</strong> Rua João Bento Padilha, Edifício do, Loja U, 4795-076 Vila das Aves, Portugal</p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.560841672112!2d-8.408868923383974!3d41.36325847130352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd24f4055752bcc5%3A0x77fb4131104ac957!2sCiberloja%20-%20Sistemas%20Inform%C3%A1ticos%2C%20Lda!5e0!3m2!1ses!2sec!4v1711419999999"
                            width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy">
                        </iframe>
                        <p><a href="https://www.google.com/maps/place/Ciberloja+-+Sistemas+Inform%C3%A1ticos,+Lda/@41.3637932,-8.4062051,1627m/data=!3m1!1e3!4m6!3m5!1s0xd24f4055752bcc5:0x77fb4131104ac957!8m2!3d41.3632557!4d-8.4066802!16s%2Fg%2F1ptxw6xwp" target="_blank">Ver no Google Maps</a></p>
                    </div>
                </section>
            </main>
        `;
    },

    renderServices(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <main class="services-container">
                <section class="services-section">
                    <h2>Os Nossos Serviços</h2>
                    <p>Na Ciberloja, oferecemos uma ampla gama de serviços informáticos concebidos para satisfazer as necessidades de empresas e particulares. A seguir, apresentamos uma lista detalhada do que podemos fazer por si:</p>
                    <ul class="services-list">
                        <li>
                            <h3>Suporte Técnico</h3>
                            <p>Prestamos assistência imediata e eficaz para resolver problemas relacionados com hardware e software. Desde falhas em computadores até configurações de redes, a nossa equipa está disponível para garantir que os seus sistemas funcionem sem interrupções.</p>
                        </li>
                        <li>
                            <h3>Desenvolvimento de Software</h3>
                            <p>Criamos aplicações e sistemas à medida das suas necessidades. Seja uma aplicação móvel, um sistema de gestão empresarial ou uma plataforma web, utilizamos tecnologias modernas como Python, JavaScript e bases de dados avançadas para oferecer soluções robustas e escaláveis.</p>
                        </li>
                        <li>
                            <h3>Consultoria IT</h3>
                            <p>Ajudamo-lo a otimizar a sua infraestrutura tecnológica com estratégias personalizadas. Analisamos os seus processos atuais, recomendamos ferramentas e concebemos planos para melhorar a eficiência, reduzir custos e prepará-lo para o futuro digital.</p>
                        </li>
                        <li>
                            <h3>Manutenção de Equipamentos</h3>
                            <p>Oferecemos serviços preventivos e corretivos para manter os seus dispositivos em ótimas condições. Desde a limpeza de hardware até atualizações de software, prolongamos a vida útil dos seus equipamentos e evitamos falhas inesperadas.</p>
                        </li>
                    </ul>
                </section>
            </main>
        `;
    }
};

export default FooterView;