const mySheet = SpreadsheetApp.getActive();
const defaultSheet:any = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');
const sheetHead = ["title", "content"];

const postTestItem = {
  item: {
    title: 'タイトル',
    content: 'タイトル'
  }
}

function Test(){
  // insertTemplate('2020-06')
  onPost({
    item: {
      title: '支出サンプル',
      content: '支出サンプル',
    }
  })
}

function insertTemplate (yearMonth:string) {
  const { SOLID_MEDIUM, DOUBLE } = SpreadsheetApp.BorderStyle

  
  const sheet = mySheet.insertSheet(yearMonth, 0);
  const [year, month] = yearMonth.split('-');

  // 収支確認エリア
  defaultSheet.getRange('A1:B1').setValues([sheetHead])

  return sheet
}

function onPost({item} : any) {
  const { title, content } = item;
  const row = ["'" + title, "'" + content]
  defaultSheet.appendRow(row)
}