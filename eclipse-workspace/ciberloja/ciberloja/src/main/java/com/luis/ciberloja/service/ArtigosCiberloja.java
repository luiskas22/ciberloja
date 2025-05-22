package com.luis.ciberloja.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.w3c.dom.Element;

import com.luis.ciberloja.model.ProductoDTO;

@Service
public interface ArtigosCiberloja {

	public List<ProductoDTO> getArtigosCiberlojaSite() throws Exception;

	public String serializeNodeToString(Object node) throws Exception;

	public List<ProductoDTO> parseSoapResponse(String xmlResponse) throws Exception;

	public String getElementValue(Element parent, String tagName);

	public String callSoapServiceDirectly() throws Exception;

}
