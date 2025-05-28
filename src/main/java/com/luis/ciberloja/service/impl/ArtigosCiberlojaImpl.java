package com.luis.ciberloja.service.impl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.luis.ciberloja.model.Familia;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.repository.FamiliaRepository;
import com.luis.ciberloja.service.ArtigosCiberloja;

import jakarta.annotation.PostConstruct;
import jakarta.xml.soap.MessageFactory;
import jakarta.xml.soap.SOAPBody;
import jakarta.xml.soap.SOAPConnection;
import jakarta.xml.soap.SOAPConnectionFactory;
import jakarta.xml.soap.SOAPElement;
import jakarta.xml.soap.SOAPEnvelope;
import jakarta.xml.soap.SOAPException;
import jakarta.xml.soap.SOAPMessage;
import jakarta.xml.soap.SOAPPart;

@Service
public class ArtigosCiberlojaImpl implements ArtigosCiberloja {

	private static final Logger logger = LogManager.getLogger(ArtigosCiberlojaImpl.class);

	private final String ENDPOINT;
	private final String EMPRESA;
	private final String UTILIZADOR;
	private final String PASSWORD;

	@Autowired
	private FamiliaRepository familiaRepository;

	public ArtigosCiberlojaImpl() {
		Properties props = new Properties();
		try (InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties")) {
			if (input == null) {
				logger.error("Unable to find application.properties in classpath");
				throw new IllegalStateException("application.properties not found in classpath");
			}
			props.load(input);
			logger.debug("Successfully loaded application.properties");
		} catch (Exception e) {
			logger.error("Failed to load application.properties", e);
			throw new IllegalStateException("Failed to load application.properties", e);
		}

		// Load and validate properties
		ENDPOINT = props.getProperty("soap.service.endpoint");
		if (ENDPOINT == null || ENDPOINT.trim().isEmpty()) {
			logger.error("Missing required property: soap.service.endpoint");
			throw new IllegalStateException("Missing required property: soap.service.endpoint");
		}

		EMPRESA = props.getProperty("soap.service.empresa");
		if (EMPRESA == null || EMPRESA.trim().isEmpty()) {
			logger.error("Missing required property: soap.service.empresa");
			throw new IllegalStateException("Missing required property: soap.service.empresa");
		}

		UTILIZADOR = props.getProperty("soap.service.utilizador");
		if (UTILIZADOR == null || UTILIZADOR.trim().isEmpty()) {
			logger.error("Missing required property: soap.service.utilizador");
			throw new IllegalStateException("Missing required property: soap.service.utilizador");
		}

		PASSWORD = props.getProperty("soap.service.password");
		if (PASSWORD == null || PASSWORD.trim().isEmpty()) {
			logger.error("Missing required property: soap.service.password");
			throw new IllegalStateException("Missing required property: soap.service.password");
		}

		logger.debug("Properties loaded - endpoint: {}, empresa: {}, utilizador: {}, password: [REDACTED]", ENDPOINT,
				EMPRESA, UTILIZADOR);
	}

	@PostConstruct
	public void init() {
		logger.info("ArtigosCiberlojaImpl initialized with endpoint: {}, empresa: {}, utilizador: {}", ENDPOINT,
				EMPRESA, UTILIZADOR);
		if (familiaRepository == null) {
			logger.error("FamiliaRepository is null");
		} else {
			logger.info("FamiliaRepository injected successfully");
		}
	}

	public List<ProductoDTO> getArtigosCiberlojaSite() throws Exception {
		try {
			// Validate properties
			if (ENDPOINT == null || ENDPOINT.trim().isEmpty()) {
				logger.error("SOAP endpoint is not configured");
				throw new IllegalStateException("SOAP endpoint is not configured");
			}
			if (EMPRESA == null || EMPRESA.trim().isEmpty() || UTILIZADOR == null || UTILIZADOR.trim().isEmpty()
					|| PASSWORD == null || PASSWORD.trim().isEmpty()) {
				logger.error("SOAP credentials are not configured");
				throw new IllegalStateException("SOAP credentials are not configured");
			}

			logger.info("Calling SOAP service GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", ENDPOINT,
					EMPRESA);

			// Usar SAAJ directamente en lugar de JAX-WS para evitar problemas de generación
			// de clases
			String xmlResponse = callSoapServiceDirectly();
			logger.debug("SOAP response received: {}", xmlResponse);

			return parseSoapResponse(xmlResponse);
		} catch (SOAPException e) {
			logger.error("SOAP error while calling GetArtigosCiberlojaSite at endpoint: {} for empresa: {}", ENDPOINT,
					EMPRESA, e);
			throw new RuntimeException("SOAP service error", e);
		} catch (Exception e) {
			logger.error("Unexpected error while calling GetArtigosCiberlojaSite at endpoint: {} for empresa: {}",
					ENDPOINT, EMPRESA, e);
			throw e;
		}
	}

	/**
	 * Llama al servicio SOAP directamente usando SAAJ (SOAP with Attachments API
	 * for Java) para evitar problemas con la generación de clases por JAX-WS
	 */
	public String callSoapServiceDirectly() throws Exception {
		// Crear una conexión SOAP
		SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
		SOAPConnection soapConnection = soapConnectionFactory.createConnection();

		// Crear un mensaje SOAP
		MessageFactory messageFactory = MessageFactory.newInstance();
		SOAPMessage soapMessage = messageFactory.createMessage();
		SOAPPart soapPart = soapMessage.getSOAPPart();

		// Configurar el sobre SOAP
		SOAPEnvelope envelope = soapPart.getEnvelope();
		envelope.addNamespaceDeclaration("soap", "http://schemas.xmlsoap.org/soap/envelope/");
		envelope.addNamespaceDeclaration("web", "http://tempuri.org/");

		// Configurar el cuerpo SOAP
		SOAPBody soapBody = envelope.getBody();
		SOAPElement soapBodyElem = soapBody.addChildElement("GetArtigosCiberlojaSite", "web");
		SOAPElement empresa = soapBodyElem.addChildElement("empresa", "web");
		empresa.addTextNode(EMPRESA);
		SOAPElement utilizador = soapBodyElem.addChildElement("utilizador", "web");
		utilizador.addTextNode(UTILIZADOR);
		SOAPElement password = soapBodyElem.addChildElement("password", "web");
		password.addTextNode(PASSWORD);

		// Finalizar el mensaje
		soapMessage.saveChanges();

		// Realizar la llamada SOAP
		SOAPMessage soapResponse = soapConnection.call(soapMessage, ENDPOINT);
		soapConnection.close();

		// Convertir la respuesta a String
		StringWriter sw = new StringWriter();
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		transformer.transform(new DOMSource(soapResponse.getSOAPPart()), new StreamResult(sw));

		return sw.toString();
	}

	public String serializeNodeToString(Object node) throws Exception {
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

	public List<ProductoDTO> parseSoapResponse(String xmlResponse) throws Exception {
		List<ProductoDTO> productos = new ArrayList<>();
		if (xmlResponse == null || xmlResponse.trim().isEmpty()) {
			logger.warn("SOAP service returned empty or null response for empresa: {}", EMPRESA);
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
				.parse(new ByteArrayInputStream(xmlResponse.getBytes(StandardCharsets.UTF_8)));

		// Intenta buscar los nodos ArtigosCiberloja en diferentes estructuras posibles
		// de respuesta
		NodeList rows = document.getElementsByTagNameNS("*", "ArtigosCiberloja");
		if (rows.getLength() == 0) {
			rows = document.getElementsByTagName("ArtigosCiberloja");
			logger.debug("Falling back to non-namespace search for ArtigosCiberloja");
		}

		// Si aún no se encuentra, buscar en otros nodos comunes en respuestas SOAP
		if (rows.getLength() == 0) {
			// Buscar dentro del diffgram si existe
			NodeList diffgrams = document.getElementsByTagNameNS("*", "diffgram");
			if (diffgrams.getLength() > 0) {
				Element diffgram = (Element) diffgrams.item(0);
				rows = diffgram.getElementsByTagName("ArtigosCiberloja");
				logger.debug("Found ArtigosCiberloja elements inside diffgram");
			}
		}

		// Si todavía no encuentra nada, buscar dentro del elemento
		// GetArtigosCiberlojaSiteResult
		if (rows.getLength() == 0) {
			NodeList results = document.getElementsByTagNameNS("*", "GetArtigosCiberlojaSiteResult");
			if (results.getLength() > 0) {
				Element result = (Element) results.item(0);
				rows = result.getElementsByTagName("ArtigosCiberloja");
				logger.debug("Found ArtigosCiberloja elements inside GetArtigosCiberlojaSiteResult");
			}
		}

		if (rows.getLength() == 0) {
			logger.warn("No ArtigosCiberloja elements found in SOAP response for empresa: {}. Raw response: {}",
					EMPRESA, xmlResponse);
			return productos;
		}

		logger.info("Found {} ArtigosCiberloja elements in response", rows.getLength());

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

			// Si el repositorio está disponible, busca la familia
			if (familiaRepository != null) {
				Familia familia = familiaRepository.findById(familiaId).orElse(null);
				if (familia == null) {
					logger.warn("Familia with ID {} not found for product {}. Skipping product.", familiaId,
							producto.getId());
					continue;
				}
				producto.setFamilia(familia.getId());
			} else {
				logger.warn("FamiliaRepository is null, can't set Familia for product: {}", producto.getId());
			}

			String destaqueValue = getElementValue(row, "CDU_DestaqueSite");
			if (destaqueValue == null || destaqueValue.trim().isEmpty()) {
				logger.warn("CDU_DestaqueSite is null or empty for product ID: {}. Defaulting to false.",
						producto.getId());
				producto.setDestaques(false);
			} else {
				producto.setDestaques(Boolean.parseBoolean(destaqueValue));
			}
			
			productos.add(producto);
		}

		logger.info("Parsed {} products from SOAP response for empresa: {}", productos.size(), EMPRESA);
		return productos;
	}

	public String getElementValue(Element parent, String tagName) {
		// Primero intenta con el namespace específico
		NodeList nodeList = parent.getElementsByTagNameNS("*", tagName);
		if (nodeList.getLength() == 0) {
			// Si no funciona, intenta sin namespace
			nodeList = parent.getElementsByTagName(tagName);
		}
		return nodeList.getLength() > 0 ? nodeList.item(0).getTextContent().trim() : "";
	}
}