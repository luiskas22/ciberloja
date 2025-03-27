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
			Class configurationParametersManagerClass = ConfigurationParametersManager.class;

			ClassLoader classLoader = configurationParametersManagerClass.getClassLoader();
			InputStream inputStream = classLoader.getResourceAsStream(CONFIG_FILE);

			propertiesCfg = new Properties();
			propertiesCfg.load(inputStream);
			inputStream.close();
		} catch (Throwable t) {

		}
	}

	public static final String getParameterValue(String parameterName) {
		return propertiesCfg.getProperty(parameterName);
	}
}
