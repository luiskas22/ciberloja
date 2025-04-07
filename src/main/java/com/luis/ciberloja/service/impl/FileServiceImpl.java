package com.luis.ciberloja.service.impl;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.Icon;
import javax.swing.ImageIcon;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.PinguelaException;
import com.luis.ciberloja.conf.ConfigurationParametersManager;
import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.ProductoDTO;
import com.luis.ciberloja.service.ClienteService;
import com.luis.ciberloja.service.FileService;
import com.luis.ciberloja.service.ProductoService;

public class FileServiceImpl implements FileService {

	private static final String BASE_PATH = "base.image.path";
	private static final String BASE_PROFILE_IMAGE_PATH = "base.profile.image.path";
	private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

	private static Logger logger = LogManager.getLogger(FileServiceImpl.class);
	private ProductoService productoService = new ProductoServiceImpl();
	private ClienteService clienteService = new ClienteServiceImpl();

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

	public void uploadProfileImage(Long clienteId, byte[] arrayImage) throws FileNotFoundException, IOException {
		Path path = Paths.get(ConfigurationParametersManager.getParameterValue(BASE_PROFILE_IMAGE_PATH) + File.separator
				+ clienteId + File.separator + "g1.jpg");

		if (!Files.exists(path.getParent())) {
			Files.createDirectory(path.getParent());
		}

		Files.write(path, arrayImage);
	}

	@Override
	public List<File> getImagesByProductoId(Long productoId) {
		if (productoId == null) {
			throw new IllegalArgumentException("El ID del producto no puede ser nulo");
		}

		List<File> imageFiles = new ArrayList<>();
		try {
			ProductoDTO producto = productoService.findById(productoId);
			if (producto == null) {
				logger.warn("No se encontró el producto con ID: {}", productoId);
				return imageFiles;
			}

			// Construir la ruta de la carpeta usando el ID del producto
			File folder = new File(
					ConfigurationParametersManager.getParameterValue(BASE_PATH) + File.separator + productoId);

			if (!folder.exists()) {
				logger.info("La carpeta para el producto {} no existe, se creará una nueva", productoId);
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
			logger.error("Error al obtener imágenes para el producto {}: {}", productoId, e.getMessage(), e);
			throw new RuntimeException("No se pudieron recuperar las imágenes", e);
		}
		return imageFiles;
	}

	@Override
	public void uploadImage(Long productoId, InputStream inputStream, String originalFileName) throws IOException {
		if (productoId == null || inputStream == null) {
			throw new IllegalArgumentException("El ID del producto y el InputStream son obligatorios");
		}

		if (inputStream.available() > MAX_FILE_SIZE) {
			throw new IOException("El archivo excede el tamaño máximo permitido de " + MAX_FILE_SIZE + " bytes");
		}

		// Crear la carpeta base si no existe
		File baseFolder = new File(ConfigurationParametersManager.getParameterValue(BASE_PATH));
		if (!baseFolder.exists()) {
			baseFolder.mkdirs();
		}

		// Crear la carpeta específica para el producto
		File productoFolder = new File(baseFolder, productoId.toString());
		if (!productoFolder.exists()) {
			productoFolder.mkdir();
			logger.info("Carpeta creada para el producto ID: {}", productoId);
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
			logger.error("Error al subir la imagen para el producto {}: {}", productoId, e.getMessage(), e);
			throw e;
		}
	}

	private String getFileExtension(String fileName) {
		if (fileName == null || !fileName.contains(".")) {
			return null;
		}
		return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
	}

	@Override
	public BufferedImage createThumbnail(BufferedImage image, int width, int height) {
		return null;
	}

	@Override
	public BufferedImage scaleImage(File imageFile, int targetWidth, int targetHeight) throws IOException {
		return null;
	}

	public Image iconToImage(Icon icon) {
		return null;
	}

	public Icon scaleIcon(Icon icon, int width, int height) {
		return null;
	}

	public List<File> getProfileImageByClienteId(Long clienteId) {
		return null;
	}
}