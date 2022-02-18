
function doGet(e: Record<string, unknown>){
  const result = executeDoGet(e);
  return converterObjectToJsonString(result);
}

function doPost(e: Record<string, unknown>){
  const result = executeDoGet(e);
  return converterObjectToJsonString(result);
}

function executeDoGet(e: Record<string, unknown>) {
    console.log("start executeDoGet")
    return { status: 'ok', method: 'get' }
}

function executeDoPost(e: Record<string, unknown>) {
    console.log("start executeDoPost")
    return { status: 'ok', method: 'post' }
}


function converterObjectToJsonString(result: Record<string, unknown>) {
    //@ts-ignore
  const payload = ContentService.createTextOutput( JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
  return payload
}