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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.luis.ciberloja.model.Familia;
import com.luis.ciberloja.soap.GetFamiliasResponse;
import com.luis.ciberloja.soap.Website;
import com.luis.ciberloja.soap.WebsiteSoap;

import jakarta.xml.soap.SOAPException;

@Service
public class FamiliasCiberlojaImpl {

    private static final Logger logger = LogManager.getLogger(FamiliasCiberlojaImpl.class);

    private final String endpoint;
    private final String empresa;
    private final String utilizador;
    private final String password;

    public FamiliasCiberlojaImpl(@Value("${soap.service.endpoint}") String endpoint,
                                @Value("${soap.service.empresa}") String empresa,
                                @Value("${soap.service.utilizador}") String utilizador,
                                @Value("${soap.service.password}") String password) {
        this.endpoint = endpoint;
        this.empresa = empresa;
        this.utilizador = utilizador;
        this.password = password;
    }

    public List<Familia> getFamiliasCiberlojaSite() throws Exception {
        try {
            logger.info("Calling SOAP service GetFamiliasCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa);
            URL url = new URL(endpoint);
            Website website = new Website(url);
            WebsiteSoap port = website.getWebsiteSoap();

            GetFamiliasResponse.GetFamiliasResult result = port.getFamilias(empresa, utilizador, password);
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
                                        && "urn:schemas-microsoft-com:xml-diffgram-v1".equals(element.getNamespaceURI())) {
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

            logger.debug("Final XML response to parse: {}", xmlResponse != null ? xmlResponse : "null");
            return parseSoapResponse(xmlResponse);
        } catch (SOAPException e) {
            logger.error("SOAP error while calling GetFamiliasCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa, e);
            throw new RuntimeException("SOAP service error", e);
        } catch (Exception e) {
            logger.error("Unexpected error while calling GetFamiliasCiberlojaSite at endpoint: {} for empresa: {}", endpoint, empresa, e);
            throw new RuntimeException("Unexpected error while calling SOAP service", e);
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

    private List<Familia> parseSoapResponse(String xmlResponse) throws Exception {
        List<Familia> familias = new ArrayList<>();
        if (xmlResponse == null || xmlResponse.trim().isEmpty()) {
            logger.warn("SOAP service returned empty or null response for empresa: {}", empresa);
            return familias;
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

        NodeList rows = document.getElementsByTagNameNS("urn:schemas-microsoft-com:xml-diffgram-v1", "Familias");
        if (rows.getLength() == 0) {
            rows = document.getElementsByTagName("Familias");
            logger.debug("Falling back to non-diffgram namespace for Familias");
        }

        if (rows.getLength() == 0) {
            logger.warn("No Familias elements found in SOAP response for empresa: {}. Document structure: {}", 
                       empresa, serializeNodeToString(document));
            return familias;
        }

        for (int i = 0; i < rows.getLength(); i++) {
            Element row = (Element) rows.item(i);
            Familia familia = new Familia();
            familia.setId(getElementValue(row, "Familia"));
            familia.setDescricao(getElementValue(row, "Descricao"));
            familias.add(familia);
        }

        logger.info("Parsed {} families from SOAP response for empresa: {}", familias.size(), empresa);
        return familias;
    }

    private String getElementValue(Element parent, String tagName) {
        NodeList nodeList = parent.getElementsByTagNameNS("*", tagName); // Use wildcard namespace
        return nodeList.getLength() > 0 ? nodeList.item(0).getTextContent().trim() : "";
    }
}