package com.luis.ciberloja.service;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.swing.Icon;


public interface FileService {

	public BufferedImage scaleImage(File imageFile, int targetWidth, int targetHeight) throws IOException;

	public BufferedImage createThumbnail(BufferedImage image, int width, int height);

	public Icon scaleIcon(Icon icon, int width, int height);

	public Image iconToImage(Icon icon);

	public List<File> getImagesByProductoId(String productoId);

	public void uploadImage(String productoId, InputStream inputStream, String originalFileName) throws IOException;

	public List<File> getProfileImageByClienteId(Long clienteId);

	public void uploadProfileImage(Long clienteId, byte[] arrayImage) throws FileNotFoundException, IOException;
}
