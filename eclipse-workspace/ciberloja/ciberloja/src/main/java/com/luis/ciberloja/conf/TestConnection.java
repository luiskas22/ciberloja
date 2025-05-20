package com.luis.ciberloja.conf;
import java.sql.Connection;
import java.sql.DriverManager;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/ciberloja?useSSL=false&serverTimezone=UTC";
        String user = "ciberloja";
        String password = "Predator22_ciberloja@.";
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Conexión exitosa!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}