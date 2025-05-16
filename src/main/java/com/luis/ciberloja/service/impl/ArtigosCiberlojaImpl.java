package com.luis.ciberloja.service.impl;

import java.io.StringWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.luis.ciberloja.model.Familia;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.repository.FamiliaRepository;
import com.luis.ciberloja.soap.GetArtigosCiberlojaSiteResponse;
import com.luis.ciberloja.soap.Website;
import com.luis.ciberloja.soap.WebsiteSoap;

import jakarta.annotation.PostConstruct;
import jakarta.xml.soap.SOAPException;

@Service
public class ArtigosCiberlojaImpl {

    private static final Logger logger = LogManager.getLogger(ArtigosCiberlojaImpl.class);

    @Value("${soap.service.endpoint}")
    private String endpoint;

    @Value("${soap.service.empresa}")
    private String empresa;

    @Value("${soap.service.utilizador}")
    private String utilizador;

    @Value("${soap.service.password}")
    private String password;

    @Autowired
    private FamiliaRepository familiaRepository;

    @PostConstruct
    public void init() {
        logger.info("ArtigosCiberlojaImpl initialized with endpoint: {}, empresa: {}, utilizador: {}", 
                    endpoint, empresa, utilizador);
        if (familiaRepository == null) {
            logger.error("FamiliaRepository is null");
        } else {
            logger.info("FamiliaRepository injected successfully");
        }
    }

    public List<ProductoDTO> getArtigosCiberlojaSite() throws Exception {
        try {
            // Validate properties
            if (endpoint == null || endpoint.trim().isEmpty()) {
                logger.error("SOAP endpoint is not configured");
                throw new IllegalStateException("SOAP endpoint is not configured");
            }
            if (empresa == null || empresa.trim().isEmpty() || 
                utilizador == null || utilizador.trim().isEmpty() || 
                password == null || password.trim().isEmpty()) {
                logger.error("SOAP credentials are not configured");
                throw new IllegalStateException("SOAP credentials are not configured");
            }

            logger.info("Calling SOAP service GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa);
            URL url = new URL(endpoint);
            Website website = new Website(url);
            WebsiteSoap port = website.getWebsiteSoap();

            GetArtigosCiberlojaSiteResponse.GetArtigosCiberlojaSiteResult result = port.getArtigosCiberlojaSite(empresa,
                    utilizador, password);
            String xmlResponse = null;
            if (result != null) {
                logger.debug("Raw SOAP result: {}", result.toString());

                Object diffgramAny = result.getDiffgramAny();
                if (diffgramAny != null) {
                    xmlResponse = serializeNodeToString(diffgramAny);
                    logger.debug("DiffgramAny content: {}", xmlResponse);
                } else {
                    List<Object> schemaAny = result.getSchemaAny();
                    if (schemaAny != null && !schemaAny.isEmpty()) {
                        for (Object obj : schemaAny) {
                            if (obj instanceof Element) {
                                Element element = (Element) obj;
                                if ("diffgram".equals(element.getLocalName())
                                        && "urn:schemas-microsoft-com:xml-diffgram-v1"
                                                .equals(element.getNamespaceURI())) {
                                    xmlResponse = serializeNodeToString(element);
                                    logger.debug("SchemaAny diffgram content: {}", xmlResponse);
                                    break;
                                }
                            }
                        }
                        if (xmlResponse == null) {
                            logger.debug("No diffgram found in schemaAny, trying first element");
                            xmlResponse = serializeNodeToString(schemaAny.get(0));
                            logger.debug("SchemaAny first element content: {}", xmlResponse);
                        }
                    } else {
                        logger.warn("Both getDiffgramAny and getSchemaAny are null or empty for empresa: {}", empresa);
                    }
                }
            } else {
                logger.warn("SOAP service returned null result for empresa: {}", empresa);
            }

            return parseSoapResponse(xmlResponse);
        } catch (SOAPException e) {
            logger.error("SOAP error while calling GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", endpoint,
                    empresa, e);
            throw new RuntimeException("SOAP service error", e);
        } catch (Exception e) {
            logger.error("Unexpected error while calling GetArtigosCiberlojaSite at endpoint: {} for empresa: {}",
                    endpoint, empresa, e);
            throw e;
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

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setFeature(javax.xml.XMLConstants.FEATURE_SECURE_PROCESSING, true);
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setXIncludeAware(false);
        factory.setExpandEntityReferences(false);
        var document = factory.newDocumentBuilder()
                .parse(new java.io.ByteArrayInputStream(xmlResponse.getBytes("UTF-8")));

        NodeList rows = document.getElementsByTagNameNS("urn:schemas-microsoft-com:xml-diffgram-v1",
                "ArtigosCiberloja");
        if (rows.getLength() == 0) {
            rows = document.getElementsByTagName("ArtigosCiberloja");
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
            try {
                String pvp3Value = getElementValue(row, "PVP3");
                producto.setPrecio(pvp3Value.isEmpty() ? 0.0 : Double.parseDouble(pvp3Value));
                String stockValue = getElementValue(row, "Stock");
                producto.setStockDisponible(stockValue.isEmpty() ? 0 : Double.parseDouble(stockValue));
            } catch (NumberFormatException e) {
                logger.warn("Invalid number format in response for Producto ID: {}. Skipping product.",
                        producto.getId(), e);
                continue;
            }
            String familiaId = getElementValue(row, "Familia");
            if (familiaId == null || familiaId.trim().isEmpty()) {
                familiaId = "004";
                logger.info("Asignando familia por defecto '004' al producto: {}", producto.getId());
            }
            Familia familia = familiaRepository.findById(familiaId).orElse(null);
            if (familia == null) {
                logger.warn("Familia with ID {} not found for product {}. Skipping product.", familiaId,
                        producto.getId());
                continue;
            }
            producto.setFamilia(familia);
            productos.add(producto);
        }

        logger.info("Parsed {} products from SOAP response for empresa: {}", productos.size(), empresa);
        return productos;
    }

    private String getElementValue(Element parent, String tagName) {
        NodeList nodeList = parent.getElementsByTagNameNS("*", tagName);
        return nodeList.getLength() > 0 ? nodeList.item(0).getTextContent().trim() : "";
    }
}