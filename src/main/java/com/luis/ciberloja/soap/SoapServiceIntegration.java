package com.luis.ciberloja.soap;

import jakarta.xml.soap.SOAPException;
import jakarta.xml.ws.BindingProvider;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.luis.ciberloja.model.ProductoDTO;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class SoapServiceIntegration {
 
    private static final Logger logger = LogManager.getLogger(SoapServiceIntegration.class);
    private static final String SOAP_ACTION = "http://tempuri.org/GetArtigosCiberlojaSite"; // Adjust based on WSDL

    private final String endpoint;
    private final String empresa;
    private final String utilizador;
    private final String password;

    public SoapServiceIntegration(String endpoint, String empresa, String utilizador, String password) {
        this.endpoint = endpoint;
        this.empresa = empresa;
        this.utilizador = utilizador;
        this.password = password;
    }

    public List<ProductoDTO> getArtigosCiberlojaSite() throws Exception {
        try {
            logger.info("Calling SOAP service GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa);
            URL url = new URL(endpoint);
            Website website = new Website(url);
            WebsiteSoap port = website.getWebsiteSoap();

            // Set SOAP Action header
            BindingProvider bindingProvider = (BindingProvider) port;
            bindingProvider.getRequestContext().put(BindingProvider.SOAPACTION_USE_PROPERTY, true);
            bindingProvider.getRequestContext().put(BindingProvider.SOAPACTION_URI_PROPERTY, SOAP_ACTION);

            // Call SOAP service
            GetArtigosCiberlojaSiteResponse.GetArtigosCiberlojaSiteResult result = port.getArtigosCiberlojaSite(empresa, utilizador, password);
            String xmlResponse = null;
            if (result != null) {
                logger.debug("Raw SOAP result: {}", result.toString());

                // Use diffgramAny as the primary data container
                Object diffgramAny = result.getDiffgramAny();
                if (diffgramAny != null) {
                    xmlResponse = serializeNodeToString(diffgramAny);
                    logger.debug("DiffgramAny content: {}", xmlResponse);
                } else {
                    logger.warn("diffgramAny is null for empresa: {}", empresa);
                }
            } else {
                logger.warn("SOAP service returned null result for empresa: {}", empresa);
            }

            // Parse XML response
            return parseSoapResponse(xmlResponse);
        } catch (SOAPException e) {
            logger.error("SOAP error while calling GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa, e);
            throw new RuntimeException("SOAP service error", e);
        } catch (Exception e) {
            logger.error("Unexpected error while calling GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa, e);
            throw new RuntimeException("Error calling SOAP service", e);
        }
    }

    private String serializeNodeToString(Object node) throws Exception {
        if (node == null) {
            return null;
        }
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        StringWriter writer = new StringWriter();
        if (node instanceof Node) {
            transformer.transform(new DOMSource((Node) node), new StreamResult(writer));
        } else {
            writer.write(node.toString());
        }
        return writer.toString();
    }

    private List<ProductoDTO> parseSoapResponse(String xmlResponse) throws Exception {
        List<ProductoDTO> productos = new ArrayList<>();
        if (xmlResponse == null || xmlResponse.trim().isEmpty()) {
            logger.warn("SOAP service returned empty or null response for empresa: {}", empresa);
            return productos;
        }

        // Parse XML response
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        var document = factory.newDocumentBuilder().parse(new java.io.ByteArrayInputStream(xmlResponse.getBytes("UTF-8")));

        // Handle XML diffgram structure
        NodeList rows = document.getElementsByTagNameNS("urn:schemas-microsoft-com:xml-diffgram-v1", "ArtigosCiberloja");
        if (rows.getLength() == 0) {
            rows = document.getElementsByTagName("ArtigosCiberloja"); // Fallback for non-diffgram
            logger.debug("Falling back to non-diffgram namespace for ArtigosCiberloja");
        }

        if (rows.getLength() == 0) {
            logger.warn("No ArtigosCiberloja elements found in SOAP response for empresa: {}", empresa);
            return productos;
        }

        for (int i = 0; i < rows.getLength(); i++) {
            Element row = (Element) rows.item(i);
            ProductoDTO producto = new ProductoDTO();
            producto.setId(getElementValue(row, "Artigo"));
            producto.setNombre(getElementValue(row, "Descricao"));
            producto.setFamilia(getElementValue(row, "Familia"));
            try {
                String pvp3Value = getElementValue(row, "PVP3");
                producto.setPrecio(pvp3Value.isEmpty() ? 0.0 : Double.parseDouble(pvp3Value));
                String stockValue = getElementValue(row, "Stock");
                producto.setStockDisponible(stockValue.isEmpty() ? 0 : Double.parseDouble(stockValue));
                productos.add(producto);
            } catch (NumberFormatException e) {
                logger.warn("Invalid number format in response for Producto ID: {}. Skipping product.", producto.getId(), e);
                continue;
            }
        }

        logger.info("Parsed {} products from SOAP response for empresa: {}", productos.size(), empresa);
        return productos;
    }

    private String getElementValue(Element parent, String tagName) {
        NodeList nodeList = parent.getElementsByTagNameNS("*", tagName); // Use wildcard namespace
        return nodeList.getLength() > 0 ? nodeList.item(0).getTextContent().trim() : "";
    }
}