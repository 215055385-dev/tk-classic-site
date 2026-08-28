"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, RefreshCw, Search, UsersRound } from "lucide-react";

type Customer = { id:string; name:string; email:string; firstChannel:string; lastChannel:string; firstSourcePage:string; lastSourcePage:string; inquiryCount:number; chatCount:number; firstSeenAt:string; lastSeenAt:string; isTest:boolean };
const formatDate = (value:string) => new Intl.DateTimeFormat("zh-CN", { dateStyle:"medium", timeStyle:"short" }).format(new Date(value));
const channelLabel = (value:string) => ({"Website chat":"站内聊天","Direct":"直接访问"}[value] || value);

export function CustomerWorkspace() {
  const [rows,setRows]=useState<Customer[]>([]); const [query,setQuery]=useState(""); const [channel,setChannel]=useState(""); const [showTests,setShowTests]=useState(false); const [loading,setLoading]=useState(true); const [notice,setNotice]=useState("");
  const load=useCallback(async()=>{setLoading(true);setNotice("");try{const response=await fetch("/api/admin/customers",{cache:"no-store"});const body=await response.json();if(!response.ok||!body.ok)throw new Error(body.error||"客户数据加载失败。");setRows(body.customers||[]);}catch(error){setNotice(error instanceof Error?error.message:"客户数据加载失败。");}finally{setLoading(false);}},[]);
  useEffect(()=>{const timer=window.setTimeout(()=>void load(),0);return()=>window.clearTimeout(timer);},[load]);
  const realRows=useMemo(()=>rows.filter((row)=>!row.isTest),[rows]);
  const channels=useMemo(()=>Array.from(new Set((showTests?rows:realRows).map((row)=>row.lastChannel).filter(Boolean))),[rows,realRows,showTests]);
  const visible=useMemo(()=>{const term=query.trim().toLowerCase();return rows.filter((row)=>(showTests||!row.isTest)&&(!channel||row.lastChannel===channel)&&(!term||[row.name,row.email,row.firstChannel,row.lastChannel].some((value)=>value.toLowerCase().includes(term))));},[rows,query,channel,showTests]);
  const returning=realRows.filter((row)=>row.inquiryCount+row.chatCount>1).length;
  return <section className="customer-workspace"><header className="cms-page-heading"><div><span>邮箱唯一身份</span><h1>客户管理</h1><p>同一邮箱只保留一个客户主档，询盘与聊天记录继续分别保留并累计到该客户。</p></div><button className="cms-secondary" onClick={()=>void load()} disabled={loading}><RefreshCw size={16}/>{loading?"加载中":"刷新"}</button></header>
    <div className="customer-summary"><div><UsersRound/><strong>{realRows.length}</strong><span>真实客户</span></div><div><strong>{returning}</strong><span>回访客户</span></div><div><strong>{realRows.reduce((sum,row)=>sum+row.inquiryCount,0)}</strong><span>真实询盘</span></div><div><strong>{realRows.reduce((sum,row)=>sum+row.chatCount,0)}</strong><span>真实聊天</span></div></div>
    <div className="cms-toolbar"><label><Search size={16}/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="搜索姓名、邮箱或渠道"/></label><select value={channel} onChange={(event)=>setChannel(event.target.value)}><option value="">全部渠道</option>{channels.map((value)=><option key={value} value={value}>{channelLabel(value)}</option>)}</select><label className="customer-test-toggle"><input type="checkbox" checked={showTests} onChange={(event)=>setShowTests(event.target.checked)}/>显示测试数据</label><span>{visible.length} 位客户</span></div>
    {notice?<p className="cms-notice">{notice}</p>:null}
    <div className="customer-list">{visible.map((row)=><article key={row.id}><div className="customer-identity"><span>{(row.name||row.email).slice(0,1).toUpperCase()}</span><div><h2>{row.name||"未填写姓名"}{row.isTest?<small>测试数据</small>:null}</h2><a href={`mailto:${row.email}`}><Mail size={14}/>{row.email}</a></div></div><div><small>渠道</small><strong>{channelLabel(row.lastChannel)}</strong><p>首次：{channelLabel(row.firstChannel)}</p></div><div><small>业务记录</small><strong>{row.inquiryCount} 次询盘 · {row.chatCount} 次聊天</strong><p>{row.inquiryCount+row.chatCount>1?"回访客户":"新客户"}</p></div><div><small>联系时间</small><strong>{formatDate(row.lastSeenAt)}</strong><p>首次：{formatDate(row.firstSeenAt)}</p></div></article>)}</div>
    {!loading&&!visible.length?<div className="cms-empty">暂无符合条件的客户。</div>:null}
  </section>;
}
