
package com.luis.ciberloja.soap;

import java.util.ArrayList;
import java.util.List;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlAnyElement;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;
import org.w3c.dom.Element;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="GetFamiliasResult" minOccurs="0"&gt;
 *           &lt;complexType&gt;
 *             &lt;complexContent&gt;
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *                 &lt;sequence&gt;
 *                   &lt;any processContents='lax' namespace='http://www.w3.org/2001/XMLSchema' maxOccurs="unbounded" minOccurs="0"/&gt;
 *                   &lt;any processContents='lax' namespace='urn:schemas-microsoft-com:xml-diffgram-v1'/&gt;
 *                 &lt;/sequence&gt;
 *               &lt;/restriction&gt;
 *             &lt;/complexContent&gt;
 *           &lt;/complexType&gt;
 *         &lt;/element&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "getFamiliasResult"
})
@XmlRootElement(name = "GetFamiliasResponse")
public class GetFamiliasResponse {

    @XmlElement(name = "GetFamiliasResult")
    protected GetFamiliasResponse.GetFamiliasResult getFamiliasResult;

    /**
     * Gets the value of the getFamiliasResult property.
     * 
     * @return
     *     possible object is
     *     {@link GetFamiliasResponse.GetFamiliasResult }
     *     
     */
    public GetFamiliasResponse.GetFamiliasResult getGetFamiliasResult() {
        return getFamiliasResult;
    }

    /**
     * Sets the value of the getFamiliasResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link GetFamiliasResponse.GetFamiliasResult }
     *     
     */
    public void setGetFamiliasResult(GetFamiliasResponse.GetFamiliasResult value) {
        this.getFamiliasResult = value;
    }


    /**
     * <p>Java class for anonymous complex type.
     * 
     * <p>The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType&gt;
     *   &lt;complexContent&gt;
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
     *       &lt;sequence&gt;
     *         &lt;any processContents='lax' namespace='http://www.w3.org/2001/XMLSchema' maxOccurs="unbounded" minOccurs="0"/&gt;
     *         &lt;any processContents='lax' namespace='urn:schemas-microsoft-com:xml-diffgram-v1'/&gt;
     *       &lt;/sequence&gt;
     *     &lt;/restriction&gt;
     *   &lt;/complexContent&gt;
     * &lt;/complexType&gt;
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "schemaAny",
        "diffgramAny"
    })
    public static class GetFamiliasResult {

        @XmlAnyElement(lax = true)
        protected List<Object> schemaAny;
        @XmlAnyElement(lax = true)
        protected Object diffgramAny;

        /**
         * Gets the value of the schemaAny property.
         * 
         * <p>
         * This accessor method returns a reference to the live list,
         * not a snapshot. Therefore any modification you make to the
         * returned list will be present inside the Jakarta XML Binding object.
         * This is why there is not a <CODE>set</CODE> method for the schemaAny property.
         * 
         * <p>
         * For example, to add a new item, do as follows:
         * <pre>
         *    getSchemaAny().add(newItem);
         * </pre>
         * 
         * 
         * <p>
         * Objects of the following type(s) are allowed in the list
         * {@link Object }
         * {@link Element }
         * 
         * 
         */
        public List<Object> getSchemaAny() {
            if (schemaAny == null) {
                schemaAny = new ArrayList<Object>();
            }
            return this.schemaAny;
        }

        /**
         * Gets the value of the diffgramAny property.
         * 
         * @return
         *     possible object is
         *     {@link Object }
         *     {@link Element }
         *     
         */
        public Object getDiffgramAny() {
            return diffgramAny;
        }

        /**
         * Sets the value of the diffgramAny property.
         * 
         * @param value
         *     allowed object is
         *     {@link Object }
         *     {@link Element }
         *     
         */
        public void setDiffgramAny(Object value) {
            this.diffgramAny = value;
        }

    }

}
