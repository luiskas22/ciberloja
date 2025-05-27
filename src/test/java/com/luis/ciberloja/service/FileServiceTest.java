//package com.luis.ciberloja.service;
//
//import com.luis.ciberloja.service.impl.FileServiceImpl;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileNotFoundException;
//import java.io.IOException;
//import java.util.List;
//
//public class FileServiceTest {
//
//	private static final FileService fileService = new FileServiceImpl();
//	private static final Logger logger = LogManager.getLogger(FileServiceTest.class);
//
//	// Ruta relativa o configurable para evitar problemas en diferentes entornos
//    private static final String SAMPLE_IMAGE_PATH = "src/main/resources/basra.jpg";
//
//	public static void main(String[] args) {
//		try {
//			// Caso de prueba 1: Subir imagen a un producto nuevo
//			testUploadImageToNewProduct();
//
////			// Caso de prueba 2: Subir múltiples imágenes
////			testUploadMultipleImages();
////
////			// Caso de prueba 3: Intentar subir imagen a ID nulo
////			testUploadWithNullProductId();
//
//		} catch (IOException e) {
//			logger.error("Error en las pruebas de FileService", e);
//		}
//	}
//
//	private static void testUploadImageToNewProduct() throws IOException {
//		logger.info("=== TEST 1: Subir imagen a producto nuevo ===");
//		Long productoId = 17L;
//		subirImagenEjemplo(productoId, SAMPLE_IMAGE_PATH);
//		listarImagenesPorProducto(productoId);
//	}
//
//	private static void testUploadMultipleImages() throws IOException {
//		logger.info("=== TEST 2: Subir múltiples imágenes ===");
//		Long productoId = 14L;
//
//		// Primera imagen
//		subirImagenEjemplo(productoId, SAMPLE_IMAGE_PATH);
//
//		// Segunda imagen (mismo producto)
//		subirImagenEjemplo(productoId, SAMPLE_IMAGE_PATH);
//
//		listarImagenesPorProducto(productoId);
//	}
//
//	private static void testUploadWithNullProductId() {
//		logger.info("=== TEST 3: Intentar subir imagen con ID nulo ===");
//		try {
//			File sourceFile = new File(SAMPLE_IMAGE_PATH);
//			try (FileInputStream inputStream = new FileInputStream(sourceFile)) {
//				fileService.uploadImage(null, inputStream, sourceFile.getName());
//				logger.error("TEST FALLIDO: Se permitió subir imagen con ID nulo");
//			}
//		} catch (IllegalArgumentException e) {
//			logger.info("Test pasado correctamente: {}", e.getMessage());
//		} catch (Exception e) {
//			logger.error("Error inesperado: {}", e.getMessage());
//		}
//	}
//
//	private static void subirImagenEjemplo(Long productoId, String imagePath) throws IOException {
//		logger.info("Subiendo imagen de prueba para producto ID: {}", productoId);
//		File sourceFile = new File(imagePath);
//		if (!sourceFile.exists()) {
//			logger.error("El archivo de prueba no existe: {}", imagePath);
//			throw new FileNotFoundException("Archivo de prueba no encontrado: " + imagePath);
//		}
//
//		try (FileInputStream inputStream = new FileInputStream(sourceFile)) {
//			logger.info("Subiendo imagen con nombre: {}", sourceFile.getName());
//			fileService.uploadImage(productoId, inputStream, sourceFile.getName());
//			logger.info("Imagen subida con éxito para producto ID: {}", productoId);
//		} catch (IOException e) {
//			logger.error("No se pudo subir la imagen para producto ID {}: {}", productoId, e.getMessage());
//			throw e;
//		}
//	}
//
//	private static void listarImagenesPorProducto(Long productoId) throws IOException {
//		logger.info("Listando imágenes para producto ID: {}", productoId);
//		List<File> imagenes = fileService.getImagesByProductoId(productoId);
//		if (imagenes == null || imagenes.isEmpty()) {
//			logger.warn("No se encontraron imágenes para producto ID: {}", productoId);
//		} else {
//			logger.info("Imágenes encontradas para producto ID: {} (total: {})", productoId, imagenes.size());
//			imagenes.forEach(f -> logger.info(" - {} (tamaño: {} bytes)", f.getName(), f.length()));
//		}
//	}
//}