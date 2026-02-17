'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
export function CashflowChart({ data }: { data: { day: string; income: number; expense: number }[] }) {
  return <div className='h-64 bg-white p-2 rounded border'><ResponsiveContainer><LineChart data={data}><XAxis dataKey='day'/><YAxis/><Tooltip/><Line dataKey='income' stroke='#16a34a'/><Line dataKey='expense' stroke='#dc2626'/></LineChart></ResponsiveContainer></div>;
}
export function CategoryChart({ data }: { data: { name: string; amount: number }[] }) {
  return <div className='h-64 bg-white p-2 rounded border'><ResponsiveContainer><BarChart data={data}><XAxis dataKey='name'/><YAxis/><Tooltip/><Bar dataKey='amount' fill='#2563eb'/></BarChart></ResponsiveContainer></div>;
}
