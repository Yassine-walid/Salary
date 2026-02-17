export async function GET(){
  return new Response('date,amount,type,category,notes\n2026-02-01,99.5,expense,Food,Lunch',{headers:{'Content-Type':'text/csv','Content-Disposition':'attachment; filename=template.csv'}});
}
