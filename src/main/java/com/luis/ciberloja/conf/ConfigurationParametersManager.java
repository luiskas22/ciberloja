package com.luis.ciberloja.conf;

import java.io.InputStream;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ConfigurationParametersManager {
    private static final String CONFIG_FILE = "ciberloja-cfg.properties";
    private static Properties propertiesCfg = null;
    private static Logger logger = LogManager.getLogger(ConfigurationParametersManager.class);

    static {
        try {
            Class<?> configurationParametersManagerClass = ConfigurationParametersManager.class;
            ClassLoader classLoader = configurationParametersManagerClass.getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream(CONFIG_FILE);

            if (inputStream == null) {
                logger.fatal("No se pudo encontrar el archivo de configuración: {}", CONFIG_FILE);
                throw new RuntimeException("Archivo de configuración " + CONFIG_FILE + " no encontrado en el classpath");
            }

            propertiesCfg = new Properties();
            propertiesCfg.load(inputStream);
            inputStream.close();

            logger.debug("Propiedades cargadas exitosamente: url={}, driver={}", 
                propertiesCfg.getProperty("db.url"), propertiesCfg.getProperty("db.driver"));

        } catch (Exception e) { // Cambiamos Throwable por Exception para ser más específicos
            logger.fatal("Error al cargar el archivo de configuración {}", CONFIG_FILE, e);
            throw new RuntimeException("No se pudo inicializar ConfigurationParametersManager", e);
        }
    }

    public static String getParameterValue(String parameterName) {
        if (propertiesCfg == null) {
            throw new IllegalStateException("Las propiedades no han sido inicializadas");
        }
        String value = propertiesCfg.getProperty(parameterName);
        if (value == null) {
            logger.warn("No se encontró el parámetro {} en las propiedades", parameterName);
        }
        return value;
    }
}