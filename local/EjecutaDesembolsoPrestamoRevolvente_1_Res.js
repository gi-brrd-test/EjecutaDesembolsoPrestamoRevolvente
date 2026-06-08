var common = require("local:///shared/common.js");

//Se lee el mensaje como tipo xml
session.input.readAsXML(function (error, NodeList) {
    //Mensaje en caso de error al leer el mensaje
    if (error) {
        var msj = {};
        msj.mensaje = 'Transaccion no pudo ser procesada. Intente nuevamente';
        var statusCode = '500 Internal Server Error';
        common.generaError(msj, statusCode);
    } else {
        //AQUI VA EL CODIGO

        var jsonResp = {};
        //Se toma el valor de Control.Tipo de la respuesta del IIB
        var resultado = NodeList.item(0).getElementsByTagName('Control').item(0).getElementsByTagName('Tipo').item(0).textContent;

        //Resultado 0
        if (resultado == '0') {
            //Mapeo response header estandar
            jsonResp.id_consumidor = NodeList.item(0).getElementsByTagName('Metadata').item(0).getElementsByTagName('Canal').item(0).textContent;
            jsonResp.usuario = NodeList.item(0).getElementsByTagName('Metadata').item(0).getElementsByTagName('Usuario').item(0).textContent;
            jsonResp.terminal = NodeList.item(0).getElementsByTagName('Metadata').item(0).getElementsByTagName('Terminal').item(0).textContent;
            jsonResp.fechaHora = common.getFechaHora();
            jsonResp.TRNID  = NodeList.item(0).getElementsByTagName('Control').item(0).getElementsByTagName('TransactionId').item(0).textContent;
            jsonResp.version = parseInt(NodeList.item(0).getElementsByTagName('Metadata').item(0).getElementsByTagName('Version').item(0).textContent);

			jsonResp.cuota = 0;
			jsonResp.cargos = 0;
			jsonResp.balanceDisponible = 0;
			jsonResp.balancePendiente = 0;
			jsonResp.plazo = 0;
			
			jsonResp.mensaje = 'Satisfactorio';

            session.output.write(jsonResp);

        //FIN DEL CODIGO

        //Resultado 1
        } else if(resultado == '1'){
            var msj = {};
            msj.mensaje = NodeList.item(0).getElementsByTagName('Control').item(0).getElementsByTagName('Mensaje').item(0).textContent;
            var statusCode = '400 Bad Request';
            common.generaError(msj, statusCode);

        //Resultado 2
        } else {
            var msj = {};
            msj.mensaje = 'Transaccion no pudo ser procesada. Intente nuevamente';
            var statusCode = '500 Internal Server Error';
            common.generaError(msj, statusCode);
        }
    }
});