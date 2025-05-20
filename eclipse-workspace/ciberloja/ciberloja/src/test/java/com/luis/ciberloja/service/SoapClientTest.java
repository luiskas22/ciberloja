//package com.luis.ciberloja.service;
//
//import com.luis.ciberloja.model.ProductoDTO;
//import com.luis.ciberloja.service.impl.ArtigosCiberlojaImpl;
//
//import java.util.ArrayList;
//import java.util.Comparator;
//import java.util.List;
//
//public class SoapClientTest {
//    public static void main(String[] args) {
//        System.out.println("Iniciando prueba de cliente SOAP...");
//
//        // Configuración de credenciales y endpoint
//        String endpoint = "https://ns4.ciberloja.com:8081/website.asmx";
//        String empresa = "ciberloja";
//        String utilizador = "website";
//        String password = "Website2025*";
//
//        // Crear instancia de SoapServiceIntegration
//        ArtigosCiberlojaImpl soapService = new ArtigosCiberlojaImpl(endpoint, empresa, utilizador, password);
//
//        System.out.println("Llamando al método getArtigosCiberlojaSite...");
//
//        try {
//            // Llamar al servicio SOAP y obtener los resultados
//            List<ProductoDTO> productos = soapService.getArtigosCiberlojaSite();
//
//            // Verificar si se obtuvieron productos
//            if (productos != null && !productos.isEmpty()) {
//                System.out.println("¡Éxito! Total productos recibidos: " + productos.size());
//                System.out.println("Mostrando hasta 15 productos con stock y precio mayor a 0, ordenados por stock (mayor a menor):");
//                System.out.println();
//
//                // Lista para almacenar productos filtrados
//                List<ProductoDTO> productosFiltrados = new ArrayList<>();
//
//                // Filtrar productos con stock > 0 y precio > 0
//                for (ProductoDTO producto : productos) {
//                    if (producto.getStockDisponible() > 0 && producto.getPrecio() > 0) {
//                        productosFiltrados.add(producto);
//                    }
//                }
//
//                // Ordenar por stock de mayor a menor
//                productosFiltrados.sort(Comparator.comparingDouble(ProductoDTO::getStockDisponible).reversed());
//
//                // Imprimir encabezado de la tabla
//                System.out.println("=====================================================================================");
//                System.out.printf("| %-15s | %-30s | %-15s | %-10s | %-10s |%n",
//                        "ID", "Nombre", "Familia", "Precio", "Stock");
//                System.out.println("=====================================================================================");
//
//                int count = 0;
//                for (ProductoDTO producto : productosFiltrados) {
//                    // Manejar Familia nula o vacía
//                    String familia = (producto.getFamilia() == null || producto.getFamilia().trim().isEmpty())
//                            ? "Sin familia" : producto.getFamilia();
//
//                    // Truncar nombre si es demasiado largo para mantener el formato
//                    String nombre = producto.getNombre() != null ? producto.getNombre() : "";
//                    if (nombre.length() > 30) {
//                        nombre = nombre.substring(0, 27) + "...";
//                    }
//
//                    // Imprimir fila de producto
//                    System.out.printf("| %-15s | %-30s | %-15s | %-10.2f | %-10.2f |%n",
//                            producto.getId() != null ? producto.getId() : "",
//                            nombre,
//                            familia,
//                            producto.getPrecio(),
//                            producto.getStockDisponible());
//                    count++;
//
//                    // Limitar a 15 productos
//                    if (count >= 15) {
//                        System.out.println("=====================================================================================");
//                        System.out.println("... (más productos disponibles)");
//                        break;
//                    }
//                }
//
//                // Imprimir línea final si se mostraron productos
//                if (count > 0) {
//                    System.out.println("=====================================================================================");
//                }
//
//                // Mensaje si no se encontraron productos válidos
//                if (count == 0) {
//                    System.out.println("No se encontraron productos con stock y precio mayor a 0.");
//                }
//            } else {
//                System.out.println("No se obtuvieron productos del servicio SOAP.");
//                System.out.println("Es posible que el servidor haya devuelto un error. Revise los logs para más detalles.");
//            }
//        } catch (Exception e) {
//            System.err.println("Error al llamar al servicio SOAP: " + e.getMessage());
//            e.printStackTrace();
//            System.out.println("Revise los logs para más detalles del error.");
//        }
//    }
//}