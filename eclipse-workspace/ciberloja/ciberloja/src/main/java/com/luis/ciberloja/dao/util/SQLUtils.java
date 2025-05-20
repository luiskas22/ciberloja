package com.luis.ciberloja.dao.util;

public class SQLUtils {
	public static final String wrapLike (String pattern) {
		StringBuilder a = new StringBuilder();
		a.append("%").append(pattern).append("%");
		return a.toString();
	}
}
