package com.luis.ciberloja.model;

import org.apache.commons.lang3.builder.ToStringBuilder;

public abstract class AbstractValueObject implements ValueObject {

	public AbstractValueObject() {

	}

	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
