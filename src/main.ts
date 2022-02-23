const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1");
const authToken = PropertiesService.getScriptProperties().getProperty('authToken') || ''


function test () {
  PropertiesService.getScriptProperties().setProperties({
    authToken: authToken
  })
  console.log(authToken);
}

function response(message: object){
  const res = ContentService.createTextOutput();
  res.setMimeType(ContentService.MimeType.JSON);
  res.setContent(JSON.stringify(message));
}

function doGet(){
  return ContentService.createTextOutput(JSON.stringify(getItem(), null, 2))
  .setMimeType(ContentService.MimeType.JSON);
}

interface ObjectType {
  id: string;
  title: string;
  content: string;
}

function getItem(){
  const rows = sheet!.getDataRange().getValues();
  const keys = rows.splice(0,1)[0];
  return rows.map((row) => {
    const obj = {} as ObjectType;
    row.forEach((item, index) => {
      const key: keyof ObjectType = keys[index];
      obj[key] = item;
    });
    return obj;
  })
}

function doPost(event: any) {
  let contents;
  try {
    contents = JSON.parse(event.postData.contents);
    const logger = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");
    logger!.getRange('A1').setValue(event);

    const title = event.parameters["title"];
    logger!.getRange('A3').setValue(title)

  } catch(event){
    return response({ error: 'JSONの形式が正しくありません' })
  }

  if (contents.authToken !== authToken) {
    return response({ error: '認証に失敗しました' })
  }

  const { method = '', params = {} } = contents;

  let result;
  if ( method === "POST" ) {
    result = onPost(params);
  }
  if ( method === "DELETE" ) {
    result = onDelete(params);
  }
  if ( method === "PUT" ) {
    result = onPut(params);
  }
  return result;
}


function onPost(params: ObjectType){
  const { id, title, content } = params;
  sheet!.appendRow([id, title, content]);

  return ContentService.createTextOutput('ok');
}

function onDelete(id: string){
  const lastRow = sheet!.getLastRow();
  const idArray = sheet!.getRange('A2:A'+lastRow).getValues().flat();

  
  const index = idArray.indexOf(id);
  if ( index === -1 ) return response({ error: 'idが見つかりません' }) 
  sheet!.deleteRow(2 + index );

  return ContentService.createTextOutput('ok');
}

function onPut(params: ObjectType){
  const { id, title, content } = params;
  const lastRow = sheet!.getLastRow();
  const idArray = sheet!.getRange('A1:A'+lastRow).getValues().flat();

  const index = idArray.indexOf(id);
  
  sheet!.getRange(2, (index + 1)).setValue(title);
  sheet!.getRange(2, (index + 2)).setValue(content);  

  return ContentService.createTextOutput('ok');
}