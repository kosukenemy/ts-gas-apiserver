type PostType = {
  id?: string;
  title: string;
  content: string;
}

const mySheet = SpreadsheetApp.getActive();
const sheetName = "シート1"
const defaultSheet:any = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
const authToken = PropertiesService.getScriptProperties().getProperty('authToken') || ''


function getUniqueStr(myStrong?: number): string {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}
const id = getUniqueStr();

function Test(){
  // onPost({
  //   id: id,
  //   title: 'gas',
  //   content: 'gasを学習する',
  // });
  doGet();
  // onDelete("17f147b040c2ae");
  // onPut({
  //   id: "17f14a154e62ff",
  //   title: 'js',
  //   content: 'jsを学習する',
  // })
}


function onPost(item : PostType ) {
  const { id, title, content } = item;
  const row = ["'" + id,"'" + title, "'" + content];
  defaultSheet.appendRow(row);
}

function getItems(){
  const rows = defaultSheet.getDataRange().getValues();
  const keys = rows.splice(0,1)[0];

  return rows.map((row: string[]) => {
    const obj = {};
    row.forEach((item:string, index: number) => {
      // @ts-ignore
      obj[keys[index]] = item;
    });
    console.log(obj)
    return obj;
  })
}

function doGet(){
  return ContentService.createTextOutput(JSON.stringify(getItems(), null, 2))
  .setMimeType(ContentService.MimeType.JSON);
}

function onDelete(id: string){
  const lastRow = defaultSheet.getLastRow();
  const idArray = defaultSheet.getRange('A2:A'+lastRow).getValues().flat();

  const index = idArray.indexOf(id);
  defaultSheet.deleteRow(2 + index );
}

function onPut(item : PostType ){
  const { id, title, content } = item;
  const lastRow = defaultSheet.getLastRow();
  const idArray = defaultSheet.getRange('A1:A'+lastRow).getValues().flat();

  const index = idArray.indexOf(id);
  
  defaultSheet.getRange(2, (index + 1)).setValue(title);
  defaultSheet.getRange(2, (index + 2)).setValue(content);  
}