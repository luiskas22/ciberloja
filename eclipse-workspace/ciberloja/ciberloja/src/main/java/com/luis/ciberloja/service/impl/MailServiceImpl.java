package com.luis.ciberloja.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Properties;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.luis.ciberloja.conf.ConfigurationParametersManager;
import com.luis.ciberloja.model.ClienteDTO;
import com.luis.ciberloja.model.DireccionDTO;
import com.luis.ciberloja.model.LineaPedido;
import com.luis.ciberloja.model.Pedido;
import com.luis.ciberloja.service.MailException;
import com.luis.ciberloja.service.MailService;

public class MailServiceImpl implements MailService {

	private Logger logger = LogManager.getLogger(MailServiceImpl.class);
	private static String SERVER_NAME = "mail.server.url";
	private static String SERVER_PORT = "mail.server.port";
	private static String USER = "mail.server.user";
	private static String PASSWORD = "mail.server.password";

	public MailServiceImpl() {
	}

	@Override
	public void sendPasswordResetEmail(String to, String token, Long clientId) throws MailException {
		if (to == null || to.trim().isEmpty()) {
			throw new MailException("Recipient email cannot be null or empty");
		}
		if (!isValidEmail(to)) {
			throw new MailException("Invalid email address: " + to);
		}
		String from = ConfigurationParametersManager.getParameterValue(USER);
		if (from == null || from.trim().isEmpty()) {
			throw new MailException("Sender email is not properly configured");
		}

		String subject = "Ciberloja: Redefinir sua senha"; // Translated subject

		// MODIFICACIÓN: Redirigir a la página frontend de cambio de contraseña
		// Ajusta esta URL para que coincida con la ubicación de tu formulario frontend
		String frontendUrl = "http://192.168.99.40:8080/CiberlojaSPA/";
		String resetUrl = frontendUrl + "#/reset-password?token=" + token + "&id=" + clientId;

		StringBuilder body = new StringBuilder().append("<html>").append("<head>").append("<meta charset=\"UTF-8\">")
				.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">").append("<style>")
				.append("body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #F5F6F5; color: #4A4A4A; padding: 20px; }")
				.append("h2 { color: #2E8B57; }").append("p { color: #4A4A4A; }")
				.append(".container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border: 2px solid #2E8B57; }")
				.append(".header { text-align: center; margin-bottom: 20px; }")
				.append(".button { display: inline-block; padding: 10px 20px; background-color: #2E8B57; color: #FFFFFF; text-decoration: none; border-radius: 5px; }")
				.append("</style>").append("</head>").append("<body>").append("<div class=\"container\">")
				.append("<div class=\"header\">").append("<h2>Redefinir sua senha</h2>").append("</div>")
				.append("<p>Recebemos uma solicitação para redefinir a senha da sua conta na Ciberloja.</p>")
				.append("<p>Por favor, clique no botão abaixo para definir uma nova senha:</p>").append("<p><a href=\"")
				.append(resetUrl).append("\" class=\"button\">Redefinir senha</a></p>")
				.append("<p>Este link é válido por 24 horas. Se você não solicitou esta alteração, ignore este e-mail.</p>")
				.append("<p>Obrigado por confiar na Ciberloja.</p>").append("<p>A equipe da Ciberloja</p>")
				.append("</div>").append("</body>").append("</html>");

		Properties props = new Properties();
		props.put("mail.smtp.host", ConfigurationParametersManager.getParameterValue(SERVER_NAME));
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.port", ConfigurationParametersManager.getParameterValue(SERVER_PORT));
		props.put("mail.smtp.ssl.trust", ConfigurationParametersManager.getParameterValue(SERVER_NAME));
		props.put("mail.smtp.ssl.protocols", "TLSv1.2");

		Session session = Session.getInstance(props, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				String user = ConfigurationParametersManager.getParameterValue(USER);
				String password = ConfigurationParametersManager.getParameterValue(PASSWORD);
				if (user == null || password == null) {
					throw new RuntimeException("SMTP credentials not properly configured");
				}
				return new PasswordAuthentication(user, password);
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
			message.setSubject(subject);

			MimeBodyPart messageBodyPart = new MimeBodyPart();
			messageBodyPart.setContent(body.toString(), "text/html; charset=utf-8");

			MimeMultipart multipart = new MimeMultipart();
			multipart.addBodyPart(messageBodyPart);

			message.setContent(multipart);
			Transport.send(message);
		} catch (MessagingException e) {
			throw new MailException("Error sending password reset email", e);
		}
	}

	public void enviar(String para, String assunto, String msg) throws MailException {
		Properties props = new Properties();
		props.put("mail.smtp.host", ConfigurationParametersManager.getParameterValue(SERVER_NAME));
		props.put("mail.smtp.port", ConfigurationParametersManager.getParameterValue(SERVER_PORT));
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.ssl.trust", "smtp.gmail.com"); // Confía en el certificado de Gmail
		props.put("mail.smtp.ssl.protocols", "TLSv1.2"); // Usa TLS 1.2 (obligatorio)

		Session session = Session.getInstance(props, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(ConfigurationParametersManager.getParameterValue(USER),
						ConfigurationParametersManager.getParameterValue(PASSWORD));
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(ConfigurationParametersManager.getParameterValue(USER)));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(para));
			message.setSubject(assunto);
			message.setText(msg);

			Transport.send(message);
		} catch (MessagingException e) {
			throw new MailException("Error al enviar email", e);
		}
	}

	@Override
	public void sendBienvenida(String to, ClienteDTO cliente) throws MailException {
		// Validaciones iniciales
		if (to == null || to.trim().isEmpty()) {
			throw new MailException("O endereço de email do destinatário não pode ser nulo ou vazio");
		}

		if (cliente == null) {
			throw new MailException("O objeto cliente não pode ser nulo");
		}

		// Validar formato do email
		if (!isValidEmail(to)) {
			throw new MailException("O endereço de email fornecido não é válido: " + to);
		}

		// Validar configuración del remitente
		String from = ConfigurationParametersManager.getParameterValue(USER);
		if (from == null || from.trim().isEmpty()) {
			throw new MailException("O endereço de email do remetente não está configurado corretamente");
		}

		try {
			String subject = "Bem-vindo à Ciberloja!";

			// Construir el cuerpo del mensaje
			StringBuilder body = new StringBuilder().append("<html>").append("<head>")
					.append("<meta charset=\"UTF-8\">")
					.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
					.append("<style>")
					.append("body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #F5F6F5; color: #4A4A4A; padding: 20px; }")
					.append("h2 { color: #2E8B57; }").append("p { color: #4A4A4A; }")
					.append(".container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border: 2px solid #2E8B57; }")
					.append(".header { text-align: center; margin-bottom: 20px; }")
					.append(".logo { max-width: 100px; margin-bottom: 10px; }").append("</style>").append("</head>")
					.append("<body>").append("<div class=\"container\">").append("<div class=\"header\">")
					.append("<img src=\"cid:logo\" alt=\"Ciberloja Logo\" class=\"logo\">")
					.append("<h2>Bem-vindo à Ciberloja! 💻</h2>").append("</div>").append("<p>Olá ")
					.append(cliente.getNombre() != null ? cliente.getNombre() : "").append("!</p>")
					.append("<p>Bem-vindo à Ciberloja, a tua loja online de informática de confiança. Estamos entusiasmados por te ter como parte da nossa comunidade de apaixonados por tecnologia.</p>")
					.append("<p>Na Ciberloja, encontrarás tudo o que precisas para potenciar a tua experiência digital: desde computadores e acessórios até aos mais recentes gadgets. Explora o nosso catálogo e descobre produtos de alta qualidade ao melhor preço.</p>")
					.append("<p>Se tiveres alguma dúvida ou precisares de ajuda para escolher o equipamento perfeito, a nossa equipa de suporte está pronta para te ajudar a qualquer momento.</p>")
					.append("<p>Obrigado por nos escolheres. Esperamos que desfrutes das tuas compras e que a Ciberloja seja o teu aliado no mundo tecnológico!</p>")
					.append("<p>Saudações tecnológicas,</p>").append("<p>A equipa da Ciberloja</p>").append("</div>")
					.append("</body>").append("</html>");

			// Configuración SMTP
			Properties props = new Properties();
			props.put("mail.smtp.host", ConfigurationParametersManager.getParameterValue(SERVER_NAME));
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.starttls.enable", "true");
			props.put("mail.smtp.port", ConfigurationParametersManager.getParameterValue(SERVER_PORT));
			props.put("mail.smtp.ssl.trust", ConfigurationParametersManager.getParameterValue(SERVER_NAME));

			// Crear sesión
			Session session = Session.getInstance(props, new Authenticator() {
				@Override
				protected PasswordAuthentication getPasswordAuthentication() {
					String user = ConfigurationParametersManager.getParameterValue(USER);
					String password = ConfigurationParametersManager.getParameterValue(PASSWORD);
					if (user == null || password == null) {
						throw new RuntimeException("Credenciais SMTP não configuradas corretamente");
					}
					return new PasswordAuthentication(user, password);
				}
			});

			// Crear y enviar mensaje
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
			message.setSubject(subject);

			MimeBodyPart messageBodyPart = new MimeBodyPart();
			messageBodyPart.setContent(body.toString(), "text/html; charset=utf-8");

			Multipart multipart = new MimeMultipart();
			multipart.addBodyPart(messageBodyPart);

			message.setContent(multipart);
			Transport.send(message);

		} catch (AddressException e) {
			throw new MailException("Endereço de email inválido: " + to, e);
		} catch (MessagingException e) {
			throw new MailException("Erro ao enviar o email de boas-vindas", e);
		} catch (Exception e) {
			throw new MailException("Erro inesperado ao enviar email", e);
		}
	}

	// Método auxiliar para validar formato de email
	private boolean isValidEmail(String email) {
		if (email == null)
			return false;
		String regex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
		return email.matches(regex);
	}

	@Override
	public void sendPedidoRealizado(String to, ClienteDTO cliente, Pedido pedido) throws MailException {
		String subject = "Confirmação do seu pedido #" + pedido.getId();

		StringBuilder body = new StringBuilder().append("<html>").append("<head>").append("<style>")
				.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }")
				.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }")
				.append(".header { color: #2E8B57; text-align: center; }").append(".section { margin: 15px 0; }")
				.append(".product-table { width: 100%; border-collapse: collapse; margin: 15px 0; }")
				.append(".product-table th { background: #f5f5f5; text-align: left; padding: 8px; }")
				.append(".product-table td { padding: 8px; border-bottom: 1px solid #ddd; }")
				.append(".total { font-weight: bold; }").append("</style>").append("</head>").append("<body>")
				.append("<div class=\"container\">").append("<div class=\"header\">")
				.append("<h2>Obrigado pelo seu pedido na Ciberloja!</h2>").append("<p>Nº do pedido: ")
				.append(pedido.getId()).append("</p>").append("</div>")

				.append("<div class=\"section\">").append("<p>Olá ").append(cliente.getNombre()).append(",</p>")
				.append("<p>Aqui estão os detalhes do seu pedido realizado em ").append(pedido.getFechaRealizacion())
				.append(":</p>").append("</div>")

				.append("<div class=\"section\">").append("<h3>Detalhes do pedido</h3>")
				.append(obtenerDetallesProductos(pedido)).append("</div>")

				.append("<div class=\"section\">").append("<h3>Endereço de entrega</h3>").append("<p>")
				.append(obtenerDireccionEntrega(cliente)).append("</p>").append("</div>")

				.append("<div class=\"section\">").append("<h3>Estado atual</h3>").append("<p>")
				.append(pedido.getTipoEstadoPedidoNombre()).append("</p>").append("</div>")

				.append("<div class=\"section\">")
				.append("<p>Pode entrar em contacto connosco a qualquer momento respondendo a este e-mail.</p>")
				.append("<p>Obrigado por confiar na Ciberloja!</p>").append("</div>").append("</div>").append("</body>")
				.append("</html>");

		// Resto del código para enviar el correo...
		Properties props = new Properties();
		props.put("mail.smtp.host", ConfigurationParametersManager.getParameterValue(SERVER_NAME));
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.port", ConfigurationParametersManager.getParameterValue(SERVER_PORT));

		Session session = Session.getInstance(props, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(ConfigurationParametersManager.getParameterValue(USER),
						ConfigurationParametersManager.getParameterValue(PASSWORD));
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(ConfigurationParametersManager.getParameterValue(USER)));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
			message.setSubject(subject);

			MimeBodyPart messageBodyPart = new MimeBodyPart();
			messageBodyPart.setContent(body.toString(), "text/html; charset=utf-8");

			Multipart multipart = new MimeMultipart();
			multipart.addBodyPart(messageBodyPart);

			message.setContent(multipart);
			Transport.send(message);
		} catch (MessagingException e) {
			throw new MailException("Erro ao enviar o e-mail de confirmação do pedido", e);
		}
	}

	private String obtenerDetallesProductos(Pedido pedido) {
		StringBuilder sb = new StringBuilder().append("<table class=\"product-table\">")
				.append("<tr><th>Produto</th><th>Quantidade</th><th>Preço unitário</th><th>Subtotal</th></tr>");

		for (LineaPedido linea : pedido.getLineas()) {
			sb.append("<tr>").append("<td>").append(linea.getNombreProducto()).append("</td>").append("<td>")
					.append(linea.getUnidades()).append("</td>").append("<td>")
					.append(String.format("%.2f €", linea.getPrecio())).append("</td>").append("<td>")
					.append(String.format("%.2f €", linea.getPrecio() * linea.getUnidades())).append("</td>")
					.append("</tr>");
		}

		sb.append("<tr class=\"total\">").append("<td colspan=\"3\"><strong>Total</strong></td>").append("<td>")
				.append(String.format("%.2f €", pedido.getPrecio())).append("</td>").append("</tr>").append("</table>");

		return sb.toString();
	}

	private String obtenerDireccionEntrega(ClienteDTO cliente) {
		if (cliente.getDirecciones() == null || cliente.getDirecciones().isEmpty()) {
			return "Recolha na loja";
		}

		DireccionDTO direccion = cliente.getDirecciones().get(0);

		StringBuilder sb = new StringBuilder();
		sb.append(cliente.getNombre()).append(" ").append(cliente.getApellido1());

		if (cliente.getApellido2() != null && !cliente.getApellido2().isEmpty()) {
			sb.append(" ").append(cliente.getApellido2());
		}

		sb.append("<br>").append(direccion.getDirVia()).append("<br>").append(direccion.getLocalidadNombre())
				.append(", ").append(direccion.getProvinciaNombre());

		return sb.toString();
	}
}