import FooterView from '../views/footerView.js';

const FooterController = {
    init() {
        console.log("FooterController.init()...");
        this.render();
    },

    render() {
        try {
            FooterView.renderFooter("footer-content");
        } catch (error) {
            console.error("Error rendering footer:", error);
        }
    }
};

export default FooterController;