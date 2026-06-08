var hm = require('header-metadata');
var jwt = require('jwt');
var sm = require("service-metadata");

var common = require("local:///shared/common.js");

//Se lee el mensaje como tipo json
session.input.readAsJSON(function (error, json) {
    //Mensaje en caso de error al leer el mensaje de entrada
    if (error) {
        var msj = {};
        msj.mensaje = 'Transaccion no pudo ser procesada. Intente nuevamente';
        var statusCode = '500 Internal Server Error';
        common.generaError(msj, statusCode);

    } else {
        //Se obtiene el Token jwt de seguridad en header Authorization
        var bearertoken = hm.current.get('Authorization');
        if (bearertoken) {
            var buff = bearertoken.substring(7);

            var jwttoken = buff.toString();

            try {
                var decoder = new jwt.Decoder(jwttoken);
                //Validacion del Token
                decoder.addOperation('verify', 'tokenKeySISALRIL')
                    .addOperation('validate', {
                        'aud': 'datapower'
                    })
                    .decode(function (error, claims) {
                        //Si el Token no es valido
                        if (error) {
                            var msj = {};
                            msj.mensaje = 'Credenciales invalidas';
                            var statusCode = '401 Unauthorized';
                            common.generaError(msj, statusCode);

                        } else {
                            //Si el token es valido

                            //AQUI VA EL CODIGO

                            let Gateway = session.parameters[json.id_consumidor + '_Gateway'];
                            let Consumer = session.parameters[json.id_consumidor + '_Consumer'];
							
							//Dynamic Backend
							let requestQueue = session.parameters[`${json.id_consumidor}_RequestQueue`];
							let replyQueue = session.parameters[`${json.id_consumidor}_ReplyQueue`];
							if (typeof(requestQueue) != "undefined" && typeof(replyQueue) != "undefined"){
								sm.setVar("var://service/routing-url", "dpmq://QMBR");
								sm.setVar("var://service/URI", `/?RequestQueue=${requestQueue};ReplyQueue=${replyQueue};SetReplyTo=true`);
							  }
							//End Dynamic Backend

                            var xml = '<IntegrationMessage>'
											+'<Metadata>'
												+'<Canal>' + json.id_consumidor + '</Canal>'
												+'<Usuario>' + json.usuario + '</Usuario>'
												+'<Terminal>' + json.terminal + '</Terminal>'
												+'<FechaHora>' + json.fechaHora + '</FechaHora>'
												+'<Version>' + json.version + '</Version>'
												+'<Gateway>' + Gateway + '</Gateway>'
												+'<Consumer>' + Consumer + '</Consumer>'
												+'<Control>'
													+'<Servicio>EjecutaDesembolsoPrestamoRevolvente</Servicio>'
												+'</Control>'
												+'<Opciones>'
													+'<IncluirRelacionado>true</IncluirRelacionado>'
													+'<IncluirMontosBloqueado>true</IncluirMontosBloqueado>'
													+'<IncluirDatosCliente>true</IncluirDatosCliente>'
													+'<TipoRequest>Detallado</TipoRequest>'
													+'<CriteriosProducto><![CDATA[<CriterioProducto><TipoProducto>LN</TipoProducto><Estado>OpenAndClosed</Estado></CriterioProducto>]]></CriteriosProducto>'
												+'</Opciones>'
											+'</Metadata>'
											+'<Data>'
											   +'<Productos>'				      
													+'<Producto>'
														+'<Orden>DESTINO</Orden>'
														+'<Numero>'+ json.producto.numero +'</Numero>'
														+'<LineaProducto>'+ json.producto.lineaProducto +'</LineaProducto>'
														+'<Moneda>'+ json.producto.moneda +'</Moneda>'
													+'</Producto>'
													+'<Producto>'
														+'<Orden>ORIGEN</Orden>'
														+'<Numero>'+ json.creditoAcreditar.numero +'</Numero>'
														+'<LineaProducto>'+ json.creditoAcreditar.lineaProducto +'</LineaProducto>'
														+'<Moneda>'+ json.creditoAcreditar.moneda +'</Moneda>'
													+'</Producto>' 
												+'</Productos>'
												+'<Transacciones>'
													+'<Transaccion>'
														+'<Nombre>NORMAL</Nombre>'
														+'<NumeroProductoOrigen>'+ json.creditoAcreditar.numero +'</NumeroProductoOrigen>'
														+'<LineaProductoOrigen>'+ json.creditoAcreditar.lineaProducto +'</LineaProductoOrigen>'
														+'<Moneda>'+ json.creditoAcreditar.moneda +'</Moneda>'
														+'<Monto>'+ json.importe.monto +'</Monto>'
														+'<Estado>INITIAL</Estado>'
														+'<Descripciones>'
															+'<Descripcion>Cobro Pendiente Por Seguro De Prestamo</Descripcion>'
														+'</Descripciones>'
													+'</Transaccion>'
												+'</Transacciones>'
												+'<DesembolsarPrestamo>'
													+'<LoanAcctId>'
														+'<NumeroProducto>'+ json.producto.numero +'</NumeroProducto>'
														+'<TipoProducto>'+ json.producto.lineaProducto +'</TipoProducto>'
														+'<Moneda>'+ json.producto.moneda +'</Moneda>'
													+'</LoanAcctId>'
													+'<DisbType>Internal</DisbType>'
													+'<InitialDisbDtl>'
														+'<Producto>'
															+'<NumeroProducto>'+ json.creditoAcreditar.numero +'</NumeroProducto>'
															+'<TipoProducto>'+ json.creditoAcreditar.lineaProducto +'</TipoProducto>'
															+'<Moneda>'+ json.creditoAcreditar.moneda +'</Moneda>'
															+'<CostCenter></CostCenter>'
														+'</Producto>'
														+'<DisbAmt>'
															+'<Moneda>'+ json.importe.moneda +'</Moneda>'
															+'<Monto>'+ json.importe.monto +'</Monto>'
														+'</DisbAmt>'
														+'<Description>'+ json.concepto +'</Description>'
													+'</InitialDisbDtl>'
													+'<AdditionalDisbDtl>'
														+'<Producto>'
															+'<NumeroProducto>'+ json.creditoAcreditar.numero +'</NumeroProducto>'
															+'<TipoProducto>'+ json.creditoAcreditar.lineaProducto +'</TipoProducto>'
															+'<Moneda>'+ json.creditoAcreditar.moneda +'</Moneda>'
															+'<CostCenter></CostCenter>'
														+'</Producto>'
														+'<DisbAmt>'
															+'<Moneda>'+ json.importe.moneda +'</Moneda>'
															+'<Monto>'+ json.importe.monto +'</Monto>'
														+'</DisbAmt>'
														+'<Description>'+ json.concepto +'</Description>'
													+'</AdditionalDisbDtl>'
												+'</DesembolsarPrestamo>'
												+'<Importes>'
													+'<Importe>'
														+'<Tipo>MontoDesembolso</Tipo>'
														+'<Moneda>'+ json.importe.moneda +'</Moneda>'
														+'<Monto>'+ json.importe.monto +'</Monto>'
													+'</Importe>'
												+'</Importes>'
												+'<Seguros>'
													+'<Seguro>'
														+'<Deudores>1</Deudores>'
														+'<PlazoSeguro>'+ json.plazo +'</PlazoSeguro>'
														+'<EdadCoDeudor>0</EdadCoDeudor>'
													+'</Seguro>'
												+'</Seguros>'
												+'<PlanesPagos>'
													+'<PlanPago>'
														+'<Monto>'+ json.cuota +'</Monto>'
													+'</PlanPago>'
												+'</PlanesPagos>'
											+'</Data>'
                                        +'</IntegrationMessage>';

                            session.output.write(xml);

                            //FIN DEL CODIGO
                        }
                    });

            } catch (err) {
                //Mensaje en caso de error al intentar validar el Token
                var msj = {};
                msj.mensaje = 'Credenciales invalidas';
                var statusCode = '401 Unauthorized';
                common.generaError(msj, statusCode);
            }
        } else {
            //Mensaje en caso no se provea un Token en el header
            var msj = {};
            msj.mensaje = 'Transaccion no pudo ser procesada. Intente nuevamente';
            var statusCode = '500 Internal Server Error';
            common.generaError(msj, statusCode);
        }

    }
});