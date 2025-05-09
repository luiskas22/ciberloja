package com.luis.ciberloja.soap;

import java.io.File;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

/**
 * Simple utility to validate a WSDL file
 */
public class WsdlValidator {
    public static void main(String[] args) {
        try {
            System.out.println("Validating WSDL file...");
            
            // Path to your WSDL file
            File wsdlFile = new File("src/main/resources/website.wsdl");
            
            if (!wsdlFile.exists()) {
                System.err.println("WSDL file does not exist at: " + wsdlFile.getAbsolutePath());
                System.exit(1);
            }
            
            // Create DocumentBuilder
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            
            // Parse WSDL
            builder.parse(wsdlFile);
            
            System.out.println("WSDL file is valid XML!");
            
            // Print file details
            System.out.println("File size: " + wsdlFile.length() + " bytes");
            System.out.println("Full path: " + wsdlFile.getAbsolutePath());
            
        } catch (Exception e) {
            System.err.println("WSDL validation failed:");
            e.printStackTrace();
        }
    }
}