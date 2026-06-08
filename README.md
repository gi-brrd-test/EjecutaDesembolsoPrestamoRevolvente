# 📘 [EjecutaDesembolsoPrestamoRevolvente]


## 🔐 Autenticación

Este servicio requiere autenticación.

**Tipo de autenticación:**

* [ ] Basic Auth
* [ ] Bearer Token
* [ ] API Key
* [ ] OAuth2

**Headers obligatorios:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

---

## 🌐 Endpoint del Servicio

**Método HTTP:** `GET | POST | PUT | DELETE`

**URL Base:**

```
https://sfconcer.banreservas.com/
```

**Path del servicio:**

```
/v1/[path-del-servicio]
```

**URL completa:**

```
https://sfconcer.banreservas.com/[path-del-servicio]
```

---

## 📥 Request

### Ejemplo de Request Body

```json
{
  "identificationType": "RNC",
  "number": "130842906",
  "dateBegin": "2023-06-19",
  "dateEnds": "2025-05-29"
}
```

---

## 📤 Response

### Ejemplo de Response Body

```json
{
  "header": {
    "responseCode": 400,
    "responseMessage": "El campo 'numero de identificacion' debe contener solo numeros y/o letras"
  },
  "body": null
}
```

### Códigos de respuesta HTTP

| Código | Descripción                    |
| ------ | ------------------------------ |
| 200    | Operación exitosa              |
| 400    | Error en los datos enviados    |
| 401    | No autorizado / Token inválido |
| 500    | Error interno del servidor     |

---

## 🧪 Ejemplo de consumo (cURL)

```bash
curl -X POST "https://sfconcer.banreservas.com/[path-del-servicio]" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
      "identificationType": "RNC",
      "number": "130842906",
      "dateBegin": "2023-06-19",
      "dateEnds": "2025-05-29"
    }'
```

---

## 📌 Notas adicionales

* Incluir consideraciones especiales si aplica.
* Detallar campos opcionales y obligatorios si el servicio lo requiere.