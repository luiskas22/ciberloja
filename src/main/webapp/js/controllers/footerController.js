import FooterView from '../views/footerView.js';

const FooterController = {
    init() {
        console.log("FooterController.init()...");
        this.render();
        this.setupEvents();
    },

    render() {
        try {
            FooterView.renderFooter("footer-content");
        } catch (error) {
            console.error("Error rendering footer:", error);
        }
    },

    setupEvents() {
        console.log("FooterController.setupEvents()...");
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("contact-link")) {
                e.preventDefault();
                this.showContactPage();
            } else if (e.target.classList.contains("services-link")) {
                e.preventDefault();
                this.showServicesPage();
            }
        });

        window.addEventListener("hashchange", () => {
            if (window.location.hash === "#contacto") {
                this.showContactPage();
            } else if (window.location.hash === "#servicos") {
                this.showServicesPage();
            }
        });
    },

    showContactPage() {
        console.log("Showing contact page...");
        const app = document.getElementById("pro-inventario");
        const homeContent = document.getElementById("home-content");

        if (homeContent) homeContent.style.display = "none";
        if (app) {
            FooterView.renderContact("pro-inventario");
            app.style.display = "block";
        }
    },

    showServicesPage() {
        console.log("Showing services page...");
        const app = document.getElementById("pro-inventario");
        const homeContent = document.getElementById("home-content");

        if (homeContent) homeContent.style.display = "none";
        if (app) {
            FooterView.renderServices("pro-inventario");
            app.style.display = "block";
        }
    }
};

export default FooterController;