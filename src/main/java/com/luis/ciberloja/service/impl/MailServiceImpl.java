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
		String subject = "Bem-vindo à Ciberloja!";

		StringBuilder body = new StringBuilder().append("<html>").append("<head>").append("<meta charset=\"UTF-8\">")
				.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">").append("<style>")
				.append("body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #F5F6F5; color: #4A4A4A; padding: 20px; }")
				.append("h2 { color: #2E8B57; }").append("p { color: #4A4A4A; }")
				.append(".container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border: 2px solid #2E8B57; }")
				.append(".header { text-align: center; margin-bottom: 20px; }")
				.append(".logo { max-width: 100px; margin-bottom: 10px; }").append("</style>").append("</head>")
				.append("<body>").append("<div class=\"container\">").append("<div class=\"header\">")
				.append("<img src=\"cid:logo\" alt=\"Ciberloja Logo\" class=\"logo\">")
				.append("<h2>Bem-vindo à Ciberloja! 💻</h2>").append("</div>")
				.append("<p>Olá " + cliente.getNombre() + "!</p>")
				.append("<p>Bem-vindo à Ciberloja, a tua loja online de informática de confiança. Estamos entusiasmados por te ter como parte da nossa comunidade de apaixonados por tecnologia.</p>")
				.append("<p>Na Ciberloja, encontrarás tudo o que precisas para potenciar a tua experiência digital: desde computadores e acessórios até aos mais recentes gadgets. Explora o nosso catálogo e descobre produtos de alta qualidade ao melhor preço.</p>")
				.append("<p>Se tiveres alguma dúvida ou precisares de ajuda para escolher o equipamento perfeito, a nossa equipa de suporte está pronta para te ajudar a qualquer momento.</p>")
				.append("<p>Obrigado por nos escolheres. Esperamos que desfrutes das tuas compras e que a Ciberloja seja o teu aliado no mundo tecnológico!</p>")
				.append("<p>Saudações tecnológicas,</p>").append("<p>A equipa da Ciberloja</p>").append("</div>")
				.append("</body>").append("</html>");

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
			throw new MailException("Erro ao enviar o email de boas-vindas", e);
		}
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