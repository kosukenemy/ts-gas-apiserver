

interface AppsScriptHttpRequestEvent {
  parameter: { [key: string]: string };
  contextPath: string;
  contentLength: number;
  queryString: string;
  parameters: { [key: string]: string[] };
}

interface AppsScriptHttpRequestEventPostData {
  length: number;
  type: string;
  contents: string;
  name: string;
}

interface DoPost extends AppsScriptHttpRequestEvent {
  postData: AppsScriptHttpRequestEventPostData;
}

interface DoGet extends AppsScriptHttpRequestEvent {
  pathInfo: string;
}

interface AppUsersType {
  user_id: string;
  user_name: string;
  user_email: string;
  user_password: string;
}

interface ObjectType {
  id: string;
  title: string;
  content: string;
}

const sheetName = "シート1";
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

const bookItems = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('books');
const loginUsers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('appUsers');
const authToken = PropertiesService.getScriptProperties().getProperty('authToken') || ''
const logger = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");

function test () {
  onPut({
    id: "1333f5942eeaf38b",
    title: "更新",
    content: "更新"
  })
}

function response(message: object){
  const res = ContentService.createTextOutput();
  res.setMimeType(ContentService.MimeType.JSON);
  res.setContent(JSON.stringify(message));
}

function doGet(e: DoGet){
  const path = e.pathInfo; 

  const logger = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");
  logger!.getRange('A4').setValue(e);
  

  if ( path === "users" ) {
      return ContentService.createTextOutput(JSON.stringify(getUsers(), null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if ( path === "items" ) {
      return ContentService.createTextOutput(JSON.stringify(getItem(), null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify(getItem(), null, 2))
  .setMimeType(ContentService.MimeType.JSON);
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

function getUsers(){
  const rows = loginUsers!.getDataRange().getValues();
  const keys = rows.splice(0,1)[0];
  return rows.map((row) => {
    const obj = {} as AppUsersType;
    row.forEach((item, index) => {
      const key: keyof AppUsersType = keys[index];
      obj[key] = item;
    });
    return obj;
  })
}



function doPost(event: DoPost) {
  let contents;

  
  logger!.getRange('A1').setValue(event);

  try {
    contents = JSON.parse(event.postData.contents);
  } catch(event){
    return response({ error: 'JSONの形式が正しくありません' })
  }

  if (contents.authToken !== authToken) {
    return response({ error: '認証に失敗しました' })
  }

  const { method = '', params = {}, state = '' } = contents;

  logger!.getRange('A5').setValue(state);

  let result;
  if ( method === "POST" ) {
    result = onPost(params);
  }
  if ( method === "POST" && state === "login" ) {
    result = onLogin(params)
  }
  if ( method === "DELETE" ) {
    result = onDelete(params);
  }
  if ( method === "PUT" ) {
    result = onPut(params);
  }
  return result;
}


function onLogin(params: AppUsersType) {
  const { user_id, user_name, user_email, user_password } = params;
  logger!.getRange('A5').setValue("ログインされました");
  logger!.getRange('B5').setValue(user_name);

  return ContentService.createTextOutput(user_id);
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
  const idArray = sheet!.getRange('A2:A'+lastRow).getValues().flat();

  const index = idArray.indexOf(id);  
  const titleColumn = 2;
  const contentColumn = 3;
  const startRow = 2;


  sheet!.getRange(startRow + index, titleColumn).setValue(title);
  sheet!.getRange(startRow + index, contentColumn).setValue(content);
  sheet!.getRange(7,7).setValue('test')

  return ContentService.createTextOutput('ok');
}