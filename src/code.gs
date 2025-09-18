function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Consulta UCSP");
}

// ------------------ UTIL ------------------
function _getSheet_() {
  var ss = SpreadsheetApp.openById("1q3MIHTq4pOrdXgpNjU8mNDJl8WCIDrV_aD87bIJ5G6M");
  return ss.getSheetByName("Sheet1");
}

function _idx(headers, name) {
  return headers.indexOf(name);
}

function _toNumber(x) {
  var n = parseFloat(String(x).toString().replace(',', '.'));
  return isNaN(n) ? -Infinity : n; // NaN al final del ranking
}

// ------------------ RANKING ------------------
/**
 * Calcula el ranking (posición 1-based) del documento dentro de su OP1,
 * ordenado por Puntaje de mayor a menor. No modifica la hoja.
 */
function calcularRanking(documento) {
  documento = String(documento).trim();
  if (!documento) return null;

  var sheet = _getSheet_();
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return null;

  var headers = data[0];
  var colDoc = _idx(headers, "Nro_Documento");
  var colOP1 = _idx(headers, "OP1");
  var colPuntaje = _idx(headers, "Puntaje");

  if ([colDoc, colOP1, colPuntaje].some(i => i < 0)) return null;

  // 1) Encontrar la fila del documento para leer su OP1
  var op1 = null;
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (String(row[colDoc]).trim() === documento) {
      op1 = String(row[colOP1]).trim();
      break;
    }
  }
  if (op1 === null || op1 === "") return null;

  // 2) Filtrar toda la tabla por ese OP1 (tabla "como pandas")
  var tablaOP1 = [];
  for (var j = 1; j < data.length; j++) {
    var r = data[j];
    if (String(r[colOP1]).trim() === op1) {
      tablaOP1.push({
        doc: String(r[colDoc]).trim(),
        puntaje: _toNumber(r[colPuntaje])
      });
    }
  }

  if (tablaOP1.length === 0) return null;

  // 3) Ordenar por puntaje DESC (tie-break por doc para estabilidad)
  tablaOP1.sort(function(a, b) {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    return a.doc.localeCompare(b.doc);
  });

  // 4) Encontrar el índice del documento y devolver posición 1-based
  var idx = tablaOP1.findIndex(function(x){ return x.doc === documento; });
  return (idx === -1) ? null : (idx + 1);
}

// ------------------ LOGIN + RANKING ------------------
function validarLogin(documento, contrasena) {
  documento = String(documento).trim();
  contrasena = String(contrasena).trim();

  var sheet = _getSheet_();
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return null;

  var headers = data[0];

  var colNroDocumento  = _idx(headers, "Nro_Documento");
  var colNombre        = _idx(headers, "Nombre Completo");
  var colPuntaje       = _idx(headers, "Puntaje");
  var colIngresa       = _idx(headers, "Ingresa");
  var colPuntajeMinimo = _idx(headers, "Puntaje minimo");
  var colPrograma      = _idx(headers, "OP1");

  if ([colNroDocumento, colNombre, colPuntaje, colIngresa, colPuntajeMinimo, colPrograma].some(i => i < 0)) {
    return null;
  }

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var docRow = String(row[colNroDocumento]).trim();

    // (según tu lógica actual) contraseña == documento
    if (docRow === documento && contrasena === documento) {
      var ranking = calcularRanking(documento); // <-- NUEVO

      return {
        documento: docRow,
        nombre: row[colNombre],
        puntaje: row[colPuntaje],
        puntajeMinimo: row[colPuntajeMinimo],
        resultado: row[colIngresa],
        programa: row[colPrograma],
        ranking: ranking // <-- NUEVO
      };
    }
  }
  return null;
}
