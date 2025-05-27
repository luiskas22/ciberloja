package com.luis.ciberloja.service.impl;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import javax.swing.Icon;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.PinguelaException;
import com.luis.ciberloja.conf.ConfigurationParametersManager;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.service.FileService;
import com.luis.ciberloja.service.ProductoService;

public class FileServiceImpl implements FileService {

	private static final String BASE_PATH = "base.image.path";
	private static final String BASE_PROFILE_IMAGE_PATH = "base.profile.image.path";
	private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

	private static Logger logger = LogManager.getLogger(FileServiceImpl.class);
	private ProductoService productoService = new ProductoServiceImpl();

	private int getNextImageNumber(File folder) {
		File[] files = folder.listFiles();
		int maxNumber = 0;

		if (files != null) {
			for (File file : files) {
				String name = file.getName();
				if (name.matches("g(\\d+)\\..*")) {
					int number = Integer.parseInt(name.replaceAll("g(\\d+)\\..*", "$1"));
					maxNumber = Math.max(maxNumber, number);
				}
			}
		}
		return maxNumber + 1;
	}

	@Override
	public List<File> getImagesByProductoId(String productoId) {
		if (productoId == null || productoId.trim().isEmpty()) {
			throw new IllegalArgumentException("El ID del producto no puede ser nulo o vacío");
		}

		// Sanitize productoId for file system safety
		String safeProductoId = sanitizeProductoId(productoId);

		List<File> imageFiles = new ArrayList<>();
		try {

			// Construct the folder path using the sanitized productoId
			File folder = new File(
					ConfigurationParametersManager.getParameterValue(BASE_PATH) + File.separator + safeProductoId);

			if (!folder.exists()) {
				logger.info("La carpeta para el producto {} no existe, se creará una nueva", safeProductoId);
				folder.mkdirs();
			}

			File[] filesInFolder = folder.listFiles();

			if (filesInFolder != null) {
				for (File file : filesInFolder) {
					if (file.isFile() && file.getName().matches("g\\d+\\.(jpg|png|jpeg|webp)")) {
						imageFiles.add(file);
					}
				}
			}
		} catch (Exception e) {
			logger.error("Error al obtener imágenes para el producto {}: {}", safeProductoId, e.getMessage(), e);
			throw new RuntimeException("No se pudieron recuperar las imágenes", e);
		}
		return imageFiles;
	}

	@Override
	public void uploadImage(String productoId, InputStream inputStream, String originalFileName) throws IOException {
		if (productoId == null || productoId.trim().isEmpty() || inputStream == null) {
			throw new IllegalArgumentException("El ID del producto y el InputStream son obligatorios");
		}

		// Sanitize productoId for file system safety
		String safeProductoId = sanitizeProductoId(productoId);

		if (inputStream.available() > MAX_FILE_SIZE) {
			throw new IOException("El archivo excede el tamaño máximo permitido de " + MAX_FILE_SIZE + " bytes");
		}

		// Create the base folder if it doesn't exist
		File baseFolder = new File(ConfigurationParametersManager.getParameterValue(BASE_PATH));
		if (!baseFolder.exists()) {
			baseFolder.mkdirs();
		}

		// Create the product-specific folder
		File productoFolder = new File(baseFolder, safeProductoId);
		if (!productoFolder.exists()) {
			productoFolder.mkdir();
			logger.info("Carpeta creada para el producto ID: {}", safeProductoId);
		}

		String extension = getFileExtension(originalFileName);
		if (extension == null || !extension.matches("jpg|png|jpeg|webp")) {
			extension = "jpg";
		}

		int nextImageNumber = getNextImageNumber(productoFolder);
		String newFileName = "g" + nextImageNumber + "." + extension;
		File destinationFile = new File(productoFolder, newFileName);

		try (inputStream) {
			Files.copy(inputStream, destinationFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
			logger.info("Imagen subida exitosamente: {}", destinationFile.getAbsolutePath());
		} catch (IOException e) {
			logger.error("Error al subir la imagen para el producto {}: {}", safeProductoId, e.getMessage(), e);
			throw e;
		}
	}

	private String getFileExtension(String fileName) {
		if (fileName == null || !fileName.contains(".")) {
			return null;
		}
		return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
	}

	private String sanitizeProductoId(String productoId) {
		// Replace invalid file system characters with underscores
		// Allow letters, numbers, hyphens, and dots; replace others
		return productoId.replaceAll("[^a-zA-Z0-9\\-\\.]+", "_");
	}

	// Methods unchanged or not relevant to productoId
	public void uploadProfileImage(Long clienteId, byte[] arrayImage) throws IOException {
		Path path = Paths.get(ConfigurationParametersManager.getParameterValue(BASE_PROFILE_IMAGE_PATH) + File.separator
				+ clienteId + File.separator + "g1.jpg");

		if (!Files.exists(path.getParent())) {
			Files.createDirectory(path.getParent());
		}

		Files.write(path, arrayImage);
	}

	@Override
	public BufferedImage scaleImage(File imageFile, int targetWidth, int targetHeight) throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BufferedImage createThumbnail(BufferedImage image, int width, int height) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Icon scaleIcon(Icon icon, int width, int height) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Image iconToImage(Icon icon) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<File> getProfileImageByClienteId(Long clienteId) {
		// TODO Auto-generated method stub
		return null;
	}
}