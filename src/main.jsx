import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  Ban,
  Download,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import './styles.css';

const watchlist = [
  { sym: '2330', name: '台積電', price: '980.00', change: '+1.24%', up: true },
  { sym: '2317', name: '鴻海', price: '168.50', change: '-2.03%', up: false },
  { sym: '2454', name: '聯發科', price: '1,240.00', change: '-0.48%', up: false },
  { sym: '2881', name: '富邦金', price: '82.30', change: '0.00%', up: null },
  { sym: '0050', name: '台灣50', price: '186.20', change: '+0.65%', up: true },
];

const positions = [
  { sym: '2330', name: '台積電', account: '永豐A', accountClass: 'blue', qty: 10, cost: '950.00', price: '980.00', costTotal: '9,500,000', value: '9,800,000', pnl: '+$300,000', pnlRate: '+3.16%', up: true, trend: '成本97%' },
  { sym: '2317', name: '鴻海', account: '永豐A', accountClass: 'blue', qty: 20, cost: '172.00', price: '168.50', costTotal: '3,440,000', value: '3,370,000', pnl: '-$70,000', pnlRate: '-2.03%', up: false, trend: '虧損中' },
  { sym: '2454', name: '聯發科', account: '富邦B', accountClass: 'green', qty: 5, cost: '1,200.00', price: '1,240.00', costTotal: '6,000,000', value: '6,200,000', pnl: '+$200,000', pnlRate: '+3.33%', up: true, trend: '成本97%' },
  { sym: '0050', name: '台灣50', account: '永豐A', accountClass: 'blue', qty: 30, cost: '182.50', price: '186.20', costTotal: '5,475,000', value: '5,586,000', pnl: '+$111,000', pnlRate: '+2.03%', up: true, trend: '成本98%' },
];

const traderGroups = [
  { name: '小王', avatar: '王', avatarClass: 'blue', category: 'proprietary', accounts: '永豐A + 富邦B', unrealized: '+$541,000', realized: '+$40,500', total: '+$581,500', rows: positions },
  {
    name: '小李',
    avatar: '李',
    avatarClass: 'green',
    category: 'proprietary',
    accounts: '永豐A + 群益C',
    unrealized: '+$614,000',
    realized: '-$6,500',
    total: '+$607,500',
    rows: [
      { sym: '2330', name: '台積電', account: '永豐A', accountClass: 'blue', qty: 15, cost: '940.00', price: '980.00', costTotal: '14,100,000', value: '14,700,000', pnl: '+$600,000', pnlRate: '+4.26%', up: true, trend: '成本96%' },
      { sym: '2881', name: '富邦金', account: '群益C', accountClass: 'purple', qty: 50, cost: '84.50', price: '82.30', costTotal: '4,225,000', value: '4,115,000', pnl: '-$110,000', pnlRate: '-2.60%', up: false, trend: '虧損中' },
      { sym: '0050', name: '台灣50', account: '永豐A', accountClass: 'blue', qty: 20, cost: '180.00', price: '186.20', costTotal: '3,600,000', value: '3,724,000', pnl: '+$124,000', pnlRate: '+3.44%', up: true, trend: '成本97%' },
    ],
  },
  {
    name: '小陳',
    avatar: '陳',
    avatarClass: 'purple',
    category: 'external',
    accounts: '富邦B',
    unrealized: '+$182,500',
    realized: '+$18,000',
    total: '+$200,500',
    rows: [
      { sym: '2454', name: '聯發科', account: '富邦B', accountClass: 'green', qty: 8, cost: '1,210.00', price: '1,240.00', costTotal: '9,680,000', value: '9,920,000', pnl: '+$240,000', pnlRate: '+2.48%', up: true, trend: '成本98%' },
      { sym: '2317', name: '鴻海', account: '富邦B', accountClass: 'green', qty: 25, cost: '170.80', price: '168.50', costTotal: '4,270,000', value: '4,212,500', pnl: '-$57,500', pnlRate: '-1.35%', up: false, trend: '虧損中' },
    ],
  },
  {
    name: '小林',
    avatar: '林',
    avatarClass: 'blue',
    category: 'external',
    accounts: '群益C + 富邦B',
    unrealized: '+$96,000',
    realized: '+$12,800',
    total: '+$108,800',
    rows: [
      { sym: '0050', name: '台灣50', account: '群益C', accountClass: 'purple', qty: 18, cost: '181.00', price: '186.20', costTotal: '3,258,000', value: '3,351,600', pnl: '+$93,600', pnlRate: '+2.87%', up: true, trend: '成本97%' },
      { sym: '2881', name: '富邦金', account: '富邦B', accountClass: 'green', qty: 30, cost: '82.20', price: '82.30', costTotal: '2,466,000', value: '2,469,000', pnl: '+$3,000', pnlRate: '+0.12%', up: true, trend: '成本99%' },
    ],
  },
];

const traderCategoryMeta = {
  proprietary: { label: '自有操盤', desc: '公司自有資金與正式授權帳號', color: 'blue' },
  external: { label: '丙種操盤', desc: '丙種授權、分級監控與獨立風控', color: 'purple' },
};

const traderCategories = ['proprietary', 'external'].map((id) => ({
  id,
  ...traderCategoryMeta[id],
  traders: traderGroups.filter((trader) => trader.category === id),
}));

const adminMatrix = {
  小王: { cells: ['+$32,500', '+$8,000', '—', '+$40,500', '+$541,000', '+$581,500', '正常'] },
  小李: { cells: ['-$12,000', '—', '+$5,500', '-$6,500', '+$614,000', '+$607,500', '注意'], warn: true },
  小陳: { cells: ['—', '+$18,000', '—', '+$18,000', '+$182,500', '+$200,500', '正常'] },
  小林: { cells: ['—', '+$7,800', '+$5,000', '+$12,800', '+$96,000', '+$108,800', '正常'] },
};

const traderAccountOptions = [
  {
    id: 'sinopac-a',
    label: '永豐 證-敦南0388939-王震宇',
    shortName: '永豐A',
    broker: '永豐證券',
    type: '證券',
    status: '連線正常',
    remaining: '$12,000,000',
    quotaUsedLabel: '帳號額度 60%',
    quotaValue: '$12M / $20M',
    quotaPercent: 60,
    quotaColor: 'amber',
    realized: '+$32,500',
    unrealized: '+$541,000',
    turnover: '$8,200,000',
  },
  {
    id: 'fubon-b',
    label: '富邦 證-台北8822144-王震宇',
    shortName: '富邦B',
    broker: '富邦證券',
    type: '證券',
    status: '連線正常',
    remaining: '$9,750,000',
    quotaUsedLabel: '帳號額度 35%',
    quotaValue: '$5.25M / $15M',
    quotaPercent: 35,
    quotaColor: 'green',
    realized: '+$8,000',
    unrealized: '+$200,000',
    turnover: '$5,250,000',
  },
];

const futuresAccountOptions = [
  {
    id: 'sinopac-fut-tpe',
    label: '永豐 期-台北3240627-王震宇',
    shortName: '永豐期',
    status: '連線正常',
    currency: '新台幣',
    equity: '$57,271,461',
    availableMargin: '$29,873,072',
    riskRatio: '225%',
  },
  {
    id: 'sinopac-fut-intl',
    label: '永豐 期-海外7788123-王震宇',
    shortName: '海外期',
    status: '連線正常',
    currency: '美元',
    equity: '$428,600',
    availableMargin: '$188,200',
    riskRatio: '184%',
  },
];

const futuresPositions = [
  ['旺宏期056', '買進', '145.5s', '10口', '167.75', '-445,000'],
  ['旺宏期066', '買進', '146.5s', '40口', '166.15', '-1,572,000'],
  ['華通期066', '買進', '259.5s', '43口', '247.63', '+1,020,820'],
  ['漢唐期066', '買進', '1,035s', '9口', '1,041.11', '-109,980'],
  ['威剛期066', '買進', '392.0s', '33口', '413.23', '-1,401,180'],
  ['台耀期066', '買進', '1,225s', '6口', '1,297.5', '-870,000'],
  ['台半期066', '買進', '87.4s', '10口', '82.02', '+107,600'],
  ['台股指數056', '賣出', '40,240', '2口', '40,283', '+17,200'],
];

const futuresEquityRows = [
  ['前日餘額', '61,725,290.00'],
  ['存提', '0.00'],
  ['手續費', '1,880.00'],
  ['期交稅', '1,949.00'],
  ['本日期貨平倉損益淨額', '-4,450,000.00'],
  ['本日餘額', '57,271,461.00'],
  ['未沖銷期貨浮動損益', '-3,588,220.07'],
  ['原始保證金', '23,810,169.00'],
  ['維持保證金', '16,998,366.00'],
  ['可動用(出金)保證金', '29,873,072.00'],
  ['風險指標', '225%'],
];

function Badge({ color = 'gray', children }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

function Dot({ color }) {
  return <span className={`dot dot-${color}`} />;
}

function IconButton({ children, variant = '', title }) {
  return (
    <button className={`icon-btn ${variant}`} title={title} aria-label={title}>
      {children}
    </button>
  );
}

const marginAlerts = [
  { trader: '小王', symbol: '2317', name: '鴻海', ratio: 134, line: 130, gap: 4, level: 'danger', status: '接近追繳線' },
  { trader: '小李', symbol: '2881', name: '富邦金', ratio: 141, line: 130, gap: 11, level: 'warn', status: '偏低觀察' },
  { trader: '小陳', symbol: '2454', name: '聯發科', ratio: 168, line: 130, gap: 38, level: 'ok', status: '正常' },
  { trader: '小林', symbol: '0050', name: '台灣50', ratio: 152, line: 130, gap: 22, level: 'ok', status: '正常' },
];

const marginGroups = [
  {
    trader: '小王',
    rows: [
      { sym: '2317', name: '鴻海', account: '永豐A', qty: 20, cost: '172.00', price: '168.50', marketValue: '$3,370,000', financeAmount: '$2,240,000', equity: '$1,130,000', interest: '$1,850', marginRatio: 134, gap: 4, pnl: '-$70,000', pnlRate: '-2.03%' },
      { sym: '0050', name: '台灣50', account: '永豐A', qty: 10, cost: '182.50', price: '186.20', marketValue: '$1,862,000', financeAmount: '$1,050,000', equity: '$812,000', interest: '$920', marginRatio: 177, gap: 47, pnl: '+$37,000', pnlRate: '+2.03%' },
    ],
    totals: { finance: '$3,290,000', equity: '$1,942,000', minRatio: '134%', value: '$5,232,000', pnl: '-$33,000' },
    settlement: { cashT2: '$6,980,000', marginSelfPay: '$1,942,000', interest: '$2,770' },
  },
  {
    trader: '小李',
    rows: [
      { sym: '2881', name: '富邦金', account: '群益C', qty: 50, cost: '84.50', price: '82.30', marketValue: '$4,115,000', financeAmount: '$2,920,000', equity: '$1,195,000', interest: '$2,430', marginRatio: 141, gap: 11, pnl: '-$110,000', pnlRate: '-2.60%' },
    ],
    totals: { finance: '$2,920,000', equity: '$1,195,000', minRatio: '141%', value: '$4,115,000', pnl: '-$110,000' },
    settlement: { cashT2: '$3,724,000', marginSelfPay: '$1,195,000', interest: '$2,430' },
  },
  {
    trader: '小陳',
    rows: [
      { sym: '2454', name: '聯發科', account: '富邦B', qty: 3, cost: '1,210.00', price: '1,240.00', marketValue: '$3,720,000', financeAmount: '$2,210,000', equity: '$1,510,000', interest: '$1,670', marginRatio: 168, gap: 38, pnl: '+$90,000', pnlRate: '+2.48%' },
    ],
    totals: { finance: '$2,210,000', equity: '$1,510,000', minRatio: '168%', value: '$3,720,000', pnl: '+$90,000' },
    settlement: { cashT2: '$4,212,500', marginSelfPay: '$1,510,000', interest: '$1,670' },
  },
  {
    trader: '小林',
    rows: [
      { sym: '0050', name: '台灣50', account: '群益C', qty: 12, cost: '181.00', price: '186.20', marketValue: '$2,234,400', financeAmount: '$1,470,000', equity: '$764,400', interest: '$1,120', marginRatio: 152, gap: 22, pnl: '+$62,400', pnlRate: '+2.87%' },
    ],
    totals: { finance: '$1,470,000', equity: '$764,400', minRatio: '152%', value: '$2,234,400', pnl: '+$62,400' },
    settlement: { cashT2: '$2,469,000', marginSelfPay: '$764,400', interest: '$1,120' },
  },
];

function MarginWarningBar() {
  return (
    <div className="margin-warning-bar">
      <div className="margin-warning-title">
        <AlertTriangle size={16} />
        <span>融資警示</span>
      </div>
      <div className="margin-warning-items">
        {marginAlerts.map((item) => (
          <div className={`margin-warning-item ${item.level}`} key={`${item.trader}-${item.symbol}`}>
            <strong>{item.trader}</strong>
            <span>{item.symbol} {item.name}</span>
            <span>維持率 <b>{item.ratio}%</b></span>
            <span>追繳線 {item.line}% 差 {item.gap}%</span>
            <Badge color={item.level === 'danger' ? 'red' : item.level === 'warn' ? 'amber' : 'green'}>{item.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="system-title">TRADING DESK RMS</span>
        <span className="status-chip"><Dot color="green" />風控引擎正常</span>
        <span className="status-chip"><Dot color="green" />永豐A</span>
        <span className="status-chip"><Dot color="green" />富邦B</span>
        <span className="status-chip"><Dot color="amber" />群益C 重連中</span>
      </div>
      <div className="top-bar-right">
        <span className="phase-badge">PHASE 1 — 模擬模式</span>
        <span>最後同步 09:32:15</span>
        <span>操盤手：小王</span>
      </div>
    </div>
  );
}

function Tabs({ active, setActive }) {
  const tabs = [
    ['trader', '操盤手主畫面'],
    ['positions', '持倉管理'],
    ['admin', '管理員總覽'],
    ['accounts', '帳號管理'],
    ['risk', '風控規則'],
    ['audit', '稽核紀錄'],
  ];
  return (
    <div className="tab-nav">
      {tabs.map(([id, label]) => (
        <button key={id} className={`tab-btn ${active === id ? 'active' : ''}`} onClick={() => setActive(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function MiniChart({ up }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.offsetWidth || 500;
    const h = 120;
    canvas.width = w;
    canvas.height = h;
    const base = up
      ? [100, 102, 99, 101, 104, 102, 106, 108, 105, 110, 108, 112, 110, 114, 112]
      : [114, 112, 110, 108, 110, 106, 108, 104, 106, 102, 104, 100, 102, 98, 100];
    const min = Math.min(...base) - 2;
    const max = Math.max(...base) + 2;
    const toY = (v) => h - ((v - min) / (max - min)) * h;
    const toX = (i) => (i / (base.length - 1)) * w;
    const color = up ? '#2ecc8a' : '#ff4d6a';
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    base.forEach((p, i) => (i === 0 ? ctx.moveTo(toX(i), toY(p)) : ctx.lineTo(toX(i), toY(p))));
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, up ? 'rgba(46,204,138,0.18)' : 'rgba(255,77,106,0.18)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }, [up]);

  return <canvas ref={canvasRef} className="mini-chart" />;
}

function PositionTable({ rows, subtotal = true }) {
  return (
    <div className="scroll-x">
      <table className="data-table positions-table">
        <thead>
          <tr>
            <th>股票</th><th>帳號</th><th className="right">庫存（張）</th><th className="right">持倉成本</th><th className="right">現價</th>
            <th className="right">成本總額</th><th className="right">現值</th><th className="right">未實現損益</th><th className="right">損益率</th><th>走勢</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.sym}-${row.account}-${row.qty}`}>
              <td><strong>{row.sym}</strong><br /><span className="tiny muted">{row.name}</span></td>
              <td><Badge color={row.accountClass}>{row.account}</Badge></td>
              <td className="right"><strong>{row.qty}</strong></td>
              <td className="right">{row.cost}</td>
              <td className={`right ${row.up ? 'pnl-pos' : 'pnl-neg'}`}><strong>{row.price}</strong></td>
              <td className="right secondary">{row.costTotal}</td>
              <td className="right">{row.value}</td>
              <td className={`right ${row.up ? 'pnl-pos' : 'pnl-neg'}`}><strong>{row.pnl}</strong></td>
              <td className={`right ${row.up ? 'pnl-pos' : 'pnl-neg'}`}>{row.pnlRate}</td>
              <td>
                <div className="cost-bar-track"><div className={`cost-bar-fill ${row.up ? 'fill-green' : 'fill-red'}`} style={{ width: row.up ? '97%' : '100%' }} /></div>
                <div className="tiny muted">{row.trend}</div>
              </td>
            </tr>
          ))}
          {subtotal && (
            <tr className="subtotal">
              <td colSpan="5">小計</td>
              <td className="right secondary">24,415,000</td>
              <td className="right"><strong>24,956,000</strong></td>
              <td className="right pnl-pos"><strong>+$541,000</strong></td>
              <td className="right pnl-pos"><strong>+2.21%</strong></td>
              <td />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MarginPositionTable({ rows, totals }) {
  return (
    <div className="scroll-x">
      <table className="data-table margin-table">
        <thead>
          <tr>
            <th>股票</th>
            <th>帳號</th>
            <th className="right">融資庫存</th>
            <th className="right">成本</th>
            <th className="right">現價</th>
            <th className="right">市值</th>
            <th className="right">融資金額</th>
            <th className="right">自備款</th>
            <th className="right">利息</th>
            <th className="right">維持率</th>
            <th className="right">差追繳線</th>
            <th className="right">損益</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const risk = row.marginRatio <= 135 ? 'danger' : row.marginRatio <= 145 ? 'warn' : 'ok';
            return (
              <tr className={`margin-risk-${risk}`} key={`${row.sym}-${row.account}-${row.qty}`}>
                <td><strong>{row.sym}</strong><br /><span className="tiny muted">{row.name}</span></td>
                <td><Badge color={row.account === '群益C' ? 'purple' : row.account === '富邦B' ? 'green' : 'blue'}>{row.account}</Badge></td>
                <td className="right"><strong>{row.qty}</strong></td>
                <td className="right">{row.cost}</td>
                <td className={`right ${row.pnl.startsWith('-') ? 'pnl-neg' : 'pnl-pos'}`}><strong>{row.price}</strong></td>
                <td className="right">{row.marketValue}</td>
                <td className="right val-amber">{row.financeAmount}</td>
                <td className="right">{row.equity}</td>
                <td className="right secondary">{row.interest}</td>
                <td className="right"><span className={`maintain-pill ${risk}`}>{row.marginRatio}%</span></td>
                <td className={`right ${risk === 'danger' ? 'pnl-neg' : risk === 'warn' ? 'val-amber' : 'pnl-pos'}`}>{row.gap}%</td>
                <td className={`right ${row.pnl.startsWith('-') ? 'pnl-neg' : 'pnl-pos'}`}><strong>{row.pnl}</strong><br /><span className="tiny">{row.pnlRate}</span></td>
              </tr>
            );
          })}
          <tr className="subtotal">
            <td colSpan="5">融資小計</td>
            <td className="right">{totals.value}</td>
            <td className="right val-amber">{totals.finance}</td>
            <td className="right">{totals.equity}</td>
            <td />
            <td className="right val-amber">{totals.minRatio}</td>
            <td />
            <td className={`right ${totals.pnl.startsWith('-') ? 'pnl-neg' : 'pnl-pos'}`}>{totals.pnl}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SettlementSplit({ settlement }) {
  return (
    <div className="settlement-split">
      <div>
        <span className="stat-label">現股 T+2 應付全額</span>
        <strong className="val-blue">{settlement.cashT2}</strong>
      </div>
      <div>
        <span className="stat-label">融資自備款差額</span>
        <strong className="val-amber">{settlement.marginSelfPay}</strong>
      </div>
      <div>
        <span className="stat-label">預估融資利息</span>
        <strong>{settlement.interest}</strong>
      </div>
    </div>
  );
}

function parseAmount(value) {
  return Number(String(value).replace(/[^\d.-]/g, '')) || 0;
}

function formatAmount(value, withSign = false) {
  const sign = value > 0 && withSign ? '+' : '';
  return `${sign}$${Math.round(value).toLocaleString()}`;
}

function accountColor(account) {
  if (account.includes('群益')) return 'purple';
  if (account.includes('富邦')) return 'green';
  return 'blue';
}

function AccountSummaryStrip({ rows, type = 'cash' }) {
  const summaries = rows.reduce((acc, row) => {
    const account = row.account;
    if (!acc[account]) {
      acc[account] = { account, marketValue: 0, pnl: 0, cost: 0 };
    }
    const marketValue = parseAmount(type === 'margin' ? row.marketValue : row.value);
    const pnl = parseAmount(row.pnl);
    const cost = type === 'margin' ? parseAmount(row.financeAmount) + parseAmount(row.equity) : parseAmount(row.costTotal);
    acc[account].marketValue += marketValue;
    acc[account].pnl += pnl;
    acc[account].cost += cost;
    return acc;
  }, {});

  return (
    <div className="account-summary-strip">
      {Object.values(summaries).map((summary) => {
        const rate = summary.cost ? (summary.pnl / summary.cost) * 100 : 0;
        return (
          <div className="account-summary-card" key={`${type}-${summary.account}`}>
            <div className="account-summary-title">
              <Badge color={accountColor(summary.account)}>{summary.account}</Badge>
              <span>{type === 'margin' ? '融資加總' : '現股加總'}</span>
            </div>
            <div className="account-summary-values">
              <Stat label="股票市值" value={formatAmount(summary.marketValue)} tone="val-blue" />
              <Stat label="未實現損益" value={formatAmount(summary.pnl, true)} tone={summary.pnl < 0 ? 'pnl-neg' : 'pnl-pos'} />
              <Stat label="損益率" value={`${rate >= 0 ? '+' : ''}${rate.toFixed(2)}%`} tone={rate < 0 ? 'pnl-neg' : 'pnl-pos'} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TraderInquiryPanel({ trader, settlement }) {
  const [activeInquiry, setActiveInquiry] = useState('realized');

  return (
    <div className="trader-inquiry-panel">
      <div className="inquiry-tabs" role="tablist" aria-label={`${trader.name} 查詢面板`}>
        <button className={activeInquiry === 'realized' ? 'active' : ''} onClick={() => setActiveInquiry('realized')}>已實現損益查詢</button>
        <button className={activeInquiry === 'statement' ? 'active' : ''} onClick={() => setActiveInquiry('statement')}>對帳單查詢</button>
        <button className={activeInquiry === 'settlement' ? 'active' : ''} onClick={() => setActiveInquiry('settlement')}>交割款（三日內）</button>
      </div>
      <div className="inquiry-content">
        {activeInquiry === 'realized' && <RealizedInquiry trader={trader} />}
        {activeInquiry === 'statement' && <StatementInquiry />}
        {activeInquiry === 'settlement' && <SettlementInquiry settlement={settlement} />}
      </div>
    </div>
  );
}

function RealizedInquiry({ trader }) {
  const rows = [
    ['05/19', '2330 台積電', '賣出', '5', '940.00', '978.00', '$3,868', '+$186,132', '永豐A'],
    ['05/17', '0050 台灣50', '賣出', '10', '179.00', '185.00', '$1,850', '+$58,150', '永豐A'],
    ['05/15', '2317 鴻海', '賣出', '8', '175.00', '168.50', '$812', '-$52,812', '永豐A'],
    ['05/12', '2454 聯發科', '賣出', '3', '1,180.00', '1,240.00', '$2,232', '+$177,768', '富邦B'],
  ];
  return (
    <>
      <InquiryToolbar exportLabel="匯出 CSV" presets={['今日', '本週', '本月', '近三個月']} />
      <div className="inquiry-metrics four">
        <MetricBox label="區間已實現" value={trader.realized} tone={trader.realized.startsWith('-') ? 'pnl-neg' : 'pnl-pos'} />
        <MetricBox label="成交筆數" value="12 筆" tone="val-blue" />
        <MetricBox label="獲利筆數" value="9 筆（75%）" tone="pnl-pos" />
        <MetricBox label="最大單筆虧損" value="-$18,000" tone="pnl-neg" />
      </div>
      <div className="scroll-x">
        <table className="data-table inquiry-table">
          <thead><tr><th>日期</th><th>商品</th><th>方向</th><th className="right">數量</th><th className="right">成本均價</th><th className="right">賣出均價</th><th className="right">手續費+稅</th><th className="right">已實現損益</th><th>帳號</th></tr></thead>
          <tbody>{rows.map((row) => <InquiryRow row={row} key={row.join('-')} />)}</tbody>
        </table>
      </div>
    </>
  );
}

function StatementInquiry() {
  const rows = [
    ['05/19', '2330', '買進', '10', '978.00', '9,780,000', '$9,780', '—', '-$9,789,780', '永豐A', '05/21'],
    ['05/19', '2330', '賣出', '5', '978.00', '4,890,000', '$4,890', '$4,890', '+$4,880,220', '永豐A', '05/21'],
    ['05/17', '0050', '賣出', '10', '185.00', '1,850,000', '$1,850', '$1,850', '+$1,846,300', '永豐A', '05/19'],
    ['05/15', '2317', '賣出', '8', '168.50', '1,348,000', '$1,348', '$1,348', '+$1,345,304', '永豐A', '05/17'],
  ];
  return (
    <>
      <InquiryToolbar exportLabel="匯出 PDF" presets={['本月', '上月', '近三個月']} />
      <div className="inquiry-metrics three">
        <MetricBox label="買進總金額" value="$45,820,000" tone="val-blue" detail="含手續費 $91,640" />
        <MetricBox label="賣出總金額" value="$46,235,000" tone="val-blue" detail="含手續費+稅 $104,028" />
        <MetricBox label="區間淨損益" value="+$219,332" tone="pnl-pos" detail="扣除手續費、交易稅後" />
      </div>
      <div className="scroll-x">
        <table className="data-table inquiry-table">
          <thead><tr><th>日期</th><th>商品</th><th>方向</th><th className="right">成交量</th><th className="right">成交價</th><th className="right">成交金額</th><th className="right">手續費</th><th className="right">交易稅</th><th className="right">淨金額</th><th>帳號</th><th>交割日</th></tr></thead>
          <tbody>{rows.map((row) => <InquiryRow row={row} key={row.join('-')} />)}</tbody>
        </table>
      </div>
    </>
  );
}

function SettlementInquiry({ settlement }) {
  return (
    <div className="settlement-content">
      <p className="settlement-note">台股 T+2 交割制度，以下為未來三個交割日應付 / 應收金額</p>
      <div className="settlement-days full">
        <SettlementDay day="T+0 今日 05/19" label="今日應付款（需資金到位）" amount="+$1,846,300" tone="pnl-pos" details={['0050 台灣50 賣出 10張 × $185.00｜永豐A｜05/17成交']} />
        <SettlementDay day="T+1 明日 05/20" label="明日交割" amount="-$1,331,500" tone="pnl-neg" details={['2317 鴻海 買進 8張 × $168.00｜永豐A｜05/18成交', '2317 鴻海 賣出 12張 × $169.50｜永豐A｜05/18成交']} />
        <SettlementDay day="T+2 後日 05/21" label="後日交割" amount={settlement.cashT2.startsWith('$') ? `-${settlement.cashT2}` : settlement.cashT2} tone="pnl-neg" details={['2330 台積電 買進 10張 × $978.00｜永豐A｜05/19成交', '2330 台積電 賣出 5張 × $978.00｜永豐A｜05/19成交']} />
      </div>
    </div>
  );
}

function InquiryToolbar({ exportLabel, presets }) {
  return (
    <div className="inquiry-toolbar">
      <div className="date-range-line">
        <span>日期區間</span>
        <DateRange />
        <button className="query-btn">查詢</button>
      </div>
      <button className="export-btn">{exportLabel}</button>
      <div className="preset-row">
        {presets.map((preset, index) => <button className={index === 0 ? 'active' : ''} key={preset}>{preset}</button>)}
      </div>
    </div>
  );
}

function MetricBox({ label, value, tone, detail }) {
  return (
    <div className="metric-box">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function InquiryRow({ row }) {
  return (
    <tr>
      {row.map((cell, index) => {
        const isAmount = String(cell).startsWith('+$') || String(cell).startsWith('-$');
        const isDirection = cell === '買進' || cell === '賣出';
        const className = [
          index >= 3 && index <= 8 ? 'right' : '',
          isAmount ? (String(cell).startsWith('-') ? 'pnl-neg' : 'pnl-pos') : '',
          isDirection ? (cell === '買進' ? 'pnl-pos' : 'pnl-neg') : '',
        ].join(' ');
        return <td className={className} key={`${cell}-${index}`}>{cell.includes('永豐') || cell.includes('富邦') ? <Badge color={accountColor(cell)}>{cell}</Badge> : cell}</td>;
      })}
    </tr>
  );
}

function DateRange() {
  return (
    <div className="date-range">
      <input type="date" defaultValue="2026-05-01" />
      <span>至</span>
      <input type="date" defaultValue="2026-05-19" />
    </div>
  );
}

function SettlementDay({ day, label, amount, tone, details = [] }) {
  return (
    <div className="settlement-day">
      <div className="settlement-day-main">
        <div>
          <span className="settlement-day-tag">{day}</span>
          <span className="settlement-day-label">{label}</span>
        </div>
        {details.map((detail) => <small key={detail}>{detail}</small>)}
      </div>
      <strong className={tone}>{amount}</strong>
    </div>
  );
}

function TraderPositionBlock({ trader, compactHeader = false }) {
  const marginGroup = marginGroups.find((group) => group.trader === trader.name) || {
    rows: [],
    totals: { value: '$0', finance: '$0', equity: '$0', minRatio: '-', pnl: '$0' },
    settlement: { cashT2: '$0', marginSelfPay: '$0', interest: '$0' },
  };

  return (
    <section className="trader-section">
      {!compactHeader && (
        <div className="trader-header">
          <TraderChip {...trader} />
          <div className="stat-group">
            <Stat label="未實現" value={trader.unrealized} tone="pnl-pos" />
            <Stat label="已實現" value={trader.realized} tone={trader.realized.startsWith('-') ? 'pnl-neg' : 'pnl-pos'} />
            <Stat label="總損益" value={trader.total} tone="pnl-pos" />
          </div>
        </div>
      )}
      <PositionSubsection title={`${trader.name} — 現股部位`} meta="T+2 交割以成交全額計算">
        <PositionTable rows={trader.rows} />
        <AccountSummaryStrip rows={trader.rows} />
      </PositionSubsection>
      <PositionSubsection title={`${trader.name} — 融資部位`} meta="維持率低於 145% 進入觀察，低於 135% 高風險閃爍">
        <MarginPositionTable rows={marginGroup.rows} totals={marginGroup.totals} />
        <AccountSummaryStrip rows={marginGroup.rows} type="margin" />
        <SettlementSplit settlement={marginGroup.settlement} />
      </PositionSubsection>
      <TraderInquiryPanel trader={trader} settlement={marginGroup.settlement} />
    </section>
  );
}

function TraderTab() {
  const [tradeEntry, setTradeEntry] = useState('stock');
  const [sub, setSub] = useState('chart');
  const [selected, setSelected] = useState(watchlist[0]);
  const [lightningOpen, setLightningOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(traderAccountOptions[0].id);
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('limit');
  const [tradeSession, setTradeSession] = useState('regular');
  const [productType, setProductType] = useState('cash');
  const [timeInForce, setTimeInForce] = useState('ROD');
  const [qty, setQty] = useState('10');
  const [price, setPrice] = useState('980');
  const [modalOpen, setModalOpen] = useState(false);
  const [orderSubmitMode, setOrderSubmitMode] = useState('normal');
  const [submitted, setSubmitted] = useState(false);
  const numericPrice = Number(String(price).replace(',', '')) || 0;
  const amount = Number(qty || 0) * numericPrice * 1000;
  const selectedAccount = traderAccountOptions.find((account) => account.id === selectedAccountId) || traderAccountOptions[0];
  const subTabs = [['chart', 'K 線圖'], ['my-pos', '我的持倉'], ['orders', '委託記錄'], ['trades', '成交記錄']];

  const selectSymbol = (item) => {
    setSelected(item);
    setPrice(String(item.price).replace(',', ''));
  };

  const confirmOrder = () => {
    setModalOpen(false);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2200);
  };

  const openOrderModal = (mode) => {
    setOrderSubmitMode(mode);
    setModalOpen(true);
  };

  if (lightningOpen) {
    return (
      <LightningTradePage
        selected={selected}
        setSelected={setSelected}
        accountOptions={traderAccountOptions}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        selectedAccount={selectedAccount}
        onBack={() => setLightningOpen(false)}
      />
    );
  }

  return (
    <div>
      <div className="trade-entry-bar">
        <button className={tradeEntry === 'stock' ? 'active' : ''} onClick={() => setTradeEntry('stock')}>股票</button>
        <button className={tradeEntry === 'futures' ? 'active' : ''} onClick={() => setTradeEntry('futures')}>期貨</button>
      </div>
      {tradeEntry === 'stock' && (
      <div className="acct-status-banner">
        <div className="acct-status-row">
          <div className="acct-name-group">
            <Dot color="green" />
            <select className="account-inline-select" value={selectedAccountId} onChange={(event) => setSelectedAccountId(event.target.value)}>
              {traderAccountOptions.map((account) => (
                <option value={account.id} key={account.id}>{account.label}</option>
              ))}
            </select>
            <Badge color="green">連線正常</Badge>
            <Badge color="amber">PHASE 1 模擬</Badge>
          </div>
          <div className="stat-group">
            <Stat label="今日已實現" value={selectedAccount.realized} tone="pnl-pos" />
            <Stat label="未實現損益" value={selectedAccount.unrealized} tone="pnl-pos" />
            <Stat label="今日成交額" value={selectedAccount.turnover} tone="val-blue" />
            <Stat label="風控狀態" value="● 正常" tone="pnl-pos" />
          </div>
          <QuotaBar label={selectedAccount.quotaUsedLabel} value={selectedAccount.quotaValue} percent={selectedAccount.quotaPercent} color={selectedAccount.quotaColor} />
        </div>
      </div>
      )}

      {tradeEntry === 'futures' ? (
        <FuturesDesk />
      ) : (
      <div className="trader-layout">
        <aside className="trader-sidebar">
          <SidebarQuotes selected={selected} onSelect={selectSymbol} />
          <Divider />
          <SideSummary title="今日損益" rows={[
            ['永豐A 已實現', '+$32,500', 'pnl-pos'],
            ['富邦B 已實現', '+$8,000', 'pnl-pos'],
            ['群益C 已實現', '-$2,100', 'pnl-neg'],
            ['已實現合計', '+$38,400', 'pnl-pos'],
            ['未實現合計', '+$541,000', 'pnl-pos'],
          ]} total={['總損益', '+$579,400', 'pnl-pos']} />
          <Divider />
          <SideSummary title="持倉概覽" rows={[
            ['2330 台積電', '+$300,000', 'pnl-pos'],
            ['2317 鴻海', '-$70,000', 'pnl-neg'],
            ['2454 聯發科', '+$200,000', 'pnl-pos'],
            ['0050 台灣50', '+$111,000', 'pnl-pos'],
          ]} total={['合計市值', '$24,956,000', 'val-blue']} />
        </aside>

        <main className="trader-main">
          <div className="main-sub-nav">
            {subTabs.map(([id, label]) => (
              <button key={id} className={`sub-tab ${sub === id ? 'active' : ''}`} onClick={() => setSub(id)}>{label}</button>
            ))}
          </div>
          {sub === 'chart' && <ChartBox selected={selected} />}
          {sub === 'my-pos' && <PositionTable rows={positions} />}
          {sub === 'orders' && <OrdersTable />}
          {sub === 'trades' && <TradesTable />}
        </main>

        <aside className="trader-order">
          <OrderPanel
            selected={selected}
            side={side}
            setSide={setSide}
            orderType={orderType}
            setOrderType={setOrderType}
            tradeSession={tradeSession}
            setTradeSession={setTradeSession}
            productType={productType}
            setProductType={setProductType}
            timeInForce={timeInForce}
            setTimeInForce={setTimeInForce}
            qty={qty}
            setQty={setQty}
            price={price}
            setPrice={setPrice}
            amount={amount}
            accountOptions={traderAccountOptions}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
            selectedAccount={selectedAccount}
            submitted={submitted}
            openModal={openOrderModal}
            openLightning={() => setLightningOpen(true)}
          />
        </aside>
      </div>
      )}

      {tradeEntry === 'stock' && <Ticker />}
      {modalOpen && (
        <ConfirmModal
          selected={selected}
          side={side}
          orderType={orderType}
          tradeSession={tradeSession}
          productType={productType}
          timeInForce={timeInForce}
          qty={qty}
          price={price}
          amount={amount}
          selectedAccount={selectedAccount}
          submitMode={orderSubmitMode}
          close={() => setModalOpen(false)}
          confirm={confirmOrder}
        />
      )}
    </div>
  );
}

function FuturesDesk() {
  const [selectedAccountId, setSelectedAccountId] = useState(futuresAccountOptions[0].id);
  const [view, setView] = useState('positions');
  const [currency, setCurrency] = useState('twd');
  const account = futuresAccountOptions.find((item) => item.id === selectedAccountId) || futuresAccountOptions[0];
  const viewTitle = {
    positions: '未平倉總覽',
    equity: '期權帳戶權益',
    pnl: '平倉損益',
    trades: '歷史成交',
    statement: '對帳單',
    margin: '維持率',
  }[view];

  return (
    <section className="futures-desk">
      <div className="futures-top">
        <div className="futures-account-select">
          <span>期</span>
          <select value={selectedAccountId} onChange={(event) => setSelectedAccountId(event.target.value)}>
            {futuresAccountOptions.map((item) => (
              <option value={item.id} key={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="futures-action-grid">
        {[
          ['positions', '未平倉'],
          ['equity', '權益數'],
          ['pnl', '平倉損益'],
          ['trades', '歷史成交'],
          ['statement', '對帳單'],
          ['margin', '維持率'],
        ].map(([id, label]) => (
          <button className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)}>{label}</button>
        ))}
      </div>

      <div className="futures-panel">
        <div className="futures-panel-head">
          <div>
            <span className="stat-label">{account.shortName}</span>
            <h2>{viewTitle}</h2>
          </div>
          <div className="futures-currency-tabs">
            {[
              ['twd', '新台幣'],
              ['usd', '美金'],
              ['cny', '人民幣'],
              ['jpy', '日圓'],
            ].map(([id, label]) => (
              <button className={currency === id ? 'active' : ''} key={id} onClick={() => setCurrency(id)}>{label}</button>
            ))}
          </div>
        </div>

        {view === 'positions' && <FuturesPositionsTable />}
        {view === 'equity' && <FuturesEquityPanel account={account} />}
        {view !== 'positions' && view !== 'equity' && <FuturesPlaceholder view={view} />}
      </div>

      <div className="futures-footer">
        <div>
          <span>參考損益：台幣</span>
          <strong className="pnl-neg">-3,768,140</strong>
        </div>
        <button>交易帳號管理</button>
      </div>
    </section>
  );
}

function FuturesPositionsTable() {
  return (
    <div className="futures-position-table">
      <div className="futures-row futures-head">
        <span>商品/類別</span>
        <span>現價/口數</span>
        <span>均價/參考損益</span>
      </div>
      {futuresPositions.map(([name, side, price, qty, avg, pnl]) => (
        <div className="futures-row" key={name}>
          <span><strong>{name}</strong><em className={side === '賣出' ? 'pnl-pos' : 'pnl-neg'}>{side}</em></span>
          <span><strong>{price}</strong><em>{qty}</em></span>
          <span><strong>{avg}</strong><em className={pnl.startsWith('-') ? 'pnl-neg' : 'pnl-pos'}>{pnl}</em></span>
        </div>
      ))}
    </div>
  );
}

function FuturesEquityPanel({ account }) {
  return (
    <div className="futures-equity-panel">
      <div className="futures-equity-summary">
        <Stat label="權益數" value={account.equity} tone="val-blue" />
        <Stat label="可動用保證金" value={account.availableMargin} tone="pnl-pos" />
        <Stat label="風險指標" value={account.riskRatio} tone="val-amber" />
      </div>
      <div className="futures-equity-list">
        <div className="futures-equity-head"><span>項目</span><span>資料</span></div>
        {futuresEquityRows.map(([label, value]) => (
          <div className="futures-equity-row" key={label}>
            <span>{label}</span>
            <strong className={String(value).startsWith('-') ? 'pnl-neg' : ''}>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function FuturesPlaceholder({ view }) {
  const content = {
    pnl: ['區間平倉損益', '-4,450,000', '可選日期區間並匯出 CSV'],
    trades: ['歷史成交', '18 筆', '期貨成交回報與手續費明細'],
    statement: ['對帳單', '本月', '買賣、入出金、保證金變動'],
    margin: ['維持率', '225%', '低於 150% 進入風控觀察'],
  }[view];
  return (
    <div className="futures-placeholder">
      <span className="stat-label">{content[0]}</span>
      <strong className={String(content[1]).startsWith('-') ? 'pnl-neg' : 'val-blue'}>{content[1]}</strong>
      <p>{content[2]}</p>
    </div>
  );
}

function Stat({ label, value, tone = '' }) {
  return <div className="stat-item"><span className="stat-label">{label}</span><span className={`stat-val ${tone}`}>{value}</span></div>;
}

function QuotaBar({ label, value, percent, color }) {
  return (
    <div className="quota-bar-wrap">
      <div className="quota-label"><span>{label}</span><span className="val-amber">{value}</span></div>
      <div className="quota-track"><div className={`quota-fill fill-${color}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

function Divider() {
  return <div className="divider" />;
}

function SidebarQuotes({ onSelect }) {
  return (
    <div className="sidebar-section">
      <div className="section-title">自選報價</div>
      {watchlist.map((item) => (
        <button className="quote-row" key={item.sym} onClick={() => onSelect(item)}>
          <span><strong className="quote-sym">{item.sym}</strong><span className="tiny muted">{item.name}</span></span>
          <span className="quote-right">
            <strong className={`quote-price ${item.up === true ? 'pnl-pos' : item.up === false ? 'pnl-neg' : 'pnl-zero'}`}>{item.price}</strong>
            <span className={`quote-chg tiny ${item.up === true ? 'pnl-pos' : item.up === false ? 'pnl-neg' : 'pnl-zero'}`}>{item.up === true ? '▲' : item.up === false ? '▼' : '—'}{item.change}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function SideSummary({ title, rows, total }) {
  return (
    <div className="sidebar-section">
      <div className="section-title">{title}</div>
      <table className="pnl-tbl"><tbody>
        {rows.map(([label, value, tone]) => <tr key={label}><td className="muted tiny">{label}</td><td className={`${tone} small`}>{value}</td></tr>)}
        <tr className="total-row"><td className="muted tiny">{total[0]}</td><td className={total[2]}>{total[1]}</td></tr>
      </tbody></table>
    </div>
  );
}

function ChartBox({ selected }) {
  const tone = selected.up === false ? 'pnl-neg' : 'pnl-pos';
  return (
    <div className="chart-box">
      <div className="chart-header">
        <div className="chart-title"><span>{selected.sym}</span><small>{selected.name}</small></div>
        <div className="chart-price-wrap">
          <span className={`chart-price ${tone}`}>{selected.price}</span>
          <span className={tone}>{selected.up === false ? '▼ 下跌' : '▲ 上漲'}</span>
        </div>
      </div>
      <MiniChart up={selected.up !== false} />
      <div className="chart-stat"><span>開 968.00</span><span>高 982.00</span><span>低 964.00</span><span>昨收 968.00</span><span>量 42,851</span></div>
    </div>
  );
}

function OrderPanel({
  selected,
  side,
  setSide,
  orderType,
  setOrderType,
  tradeSession,
  setTradeSession,
  productType,
  setProductType,
  timeInForce,
  setTimeInForce,
  qty,
  setQty,
  price,
  setPrice,
  amount,
  accountOptions,
  selectedAccountId,
  setSelectedAccountId,
  selectedAccount,
  submitted,
  openModal,
  openLightning,
}) {
  const amountLabel = orderType === 'market' ? '市價單' : `$${Math.round(amount).toLocaleString()}`;
  const orderAction = getOrderAction(productType, side);
  return (
    <>
      <Field label="商品代號"><input className="form-input" value={selected.sym} readOnly /></Field>
      <Field label="交易時段">
        <SegmentedControl
          value={tradeSession}
          onChange={setTradeSession}
          options={[
            ['regular', '整股'],
            ['after', '盤後'],
            ['odd', '盤後零股'],
          ]}
        />
      </Field>
      <Field label="交易種類">
        <SegmentedControl
          value={productType}
          onChange={setProductType}
          options={[
            ['cash', '現股'],
            ['margin', '融資'],
            ['short', '融券'],
          ]}
        />
      </Field>
      <Field label="委託條件">
        <SegmentedControl
          value={timeInForce}
          onChange={setTimeInForce}
          options={[
            ['ROD', 'ROD'],
            ['IOC', 'IOC'],
            ['FOK', 'FOK'],
          ]}
        />
      </Field>
      <Field label="價格類型">
        <div className="radio-group">
          <button className={`radio-btn ${orderType === 'limit' ? 'buy-active' : ''}`} onClick={() => setOrderType('limit')}>限價</button>
          <button className={`radio-btn ${orderType === 'market' ? 'sell-active' : ''}`} onClick={() => setOrderType('market')}>市價</button>
        </div>
      </Field>
      <Field label="買賣">
        <div className="radio-group">
          <button className={`radio-btn ${side === 'buy' ? 'buy-active' : ''}`} onClick={() => setSide('buy')}>{productType === 'short' ? '買回' : '買進'}</button>
          <button className={`radio-btn ${side === 'sell' ? 'sell-active' : ''}`} onClick={() => setSide('sell')}>{productType === 'margin' ? '賣出/償還' : '賣出'}</button>
        </div>
      </Field>
      <Field label="委託價格"><input className="form-input" value={orderType === 'market' ? '市價' : price} disabled={orderType === 'market'} onChange={(e) => setPrice(e.target.value)} /></Field>
      <Field label="數量（張）"><input className="form-input" value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
      <Field label="使用帳號" right={`剩餘：${selectedAccount.remaining}`}>
        <select className="form-select" value={selectedAccountId} onChange={(event) => setSelectedAccountId(event.target.value)}>
          {accountOptions.map((account) => (
            <option value={account.id} key={account.id}>{account.shortName} — {account.broker}</option>
          ))}
        </select>
      </Field>
      <div className="estimated-amt"><span className="est-label">預估金額</span><span className="est-val">{amountLabel}</span></div>
      <OrderRiskPreview productType={productType} side={side} amount={amount} orderType={orderType} />
      <div className="submit-actions">
        <button className={`submit-btn ${side === 'buy' ? 'submit-buy' : 'submit-sell'}`} onClick={() => openModal('normal')}>
          {submitted ? '已記錄' : '一般下單'}
        </button>
        <button className="submit-btn submit-lightning" onClick={openLightning}>
          閃電交易
        </button>
      </div>
      <div className="submit-hint">目前委託：{orderAction} · {orderType === 'market' ? '市價' : '限價'} · {timeInForce}</div>
      <Divider />
      <div className="section-title">未成交委託</div>
      <PendingOrder tone="pnl-pos" text="買進 2317 鴻海" detail="限價 168.00 × 8張 | 永豐A" />
      <PendingOrder tone="pnl-neg" text="賣出 0050 台灣50" detail="限價 188.00 × 10張 | 永豐A" />
    </>
  );
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="radio-group segmented">
      {options.map(([id, label]) => (
        <button key={id} className={`radio-btn ${value === id ? 'active-neutral' : ''}`} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function getOrderAction(productType, side) {
  if (productType === 'margin') return side === 'buy' ? '融資買進' : '融資賣出/償還';
  if (productType === 'short') return side === 'buy' ? '融券買回' : '融券賣出';
  return side === 'buy' ? '現股買進' : '現股賣出';
}

function LightningTradePage({ selected, setSelected, accountOptions, selectedAccountId, setSelectedAccountId, selectedAccount, onBack }) {
  const [query, setQuery] = useState(selected.sym);
  const [productType, setProductType] = useState('cash');
  const [timeInForce, setTimeInForce] = useState('ROD');
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState('');
  const quote = watchlist.find((item) => item.sym === query.trim()) || selected;
  const numericPrice = Number(String(quote.price).replace(',', '')) || 100;
  const steps = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  const ladder = steps.map((step, index) => {
    const price = Math.max(1, numericPrice + (step * 0.5));
    return {
      price: price.toFixed(price >= 1000 ? 0 : 1),
      bid: step <= 0 ? [34, 140, 191, 169, 107][Math.abs(step)] || '' : '',
      ask: step >= 1 ? [27, 13, 59, 27, 11][index % 5] || '' : '',
      current: step === 0,
    };
  }).reverse();

  function searchSymbol() {
    const found = watchlist.find((item) => item.sym === query.trim());
    if (found) {
      setSelected(found);
      setNotice(`已載入 ${found.sym} ${found.name} 即時報價`);
    } else {
      setNotice('找不到此代號，可試 2330、2317、2454、2881、0050');
    }
  }

  function sendLightningOrder(side, price) {
    const action = side === 'buy' ? '買進' : '賣出';
    setNotice(`閃電交易已送出：${selectedAccount.shortName} · ${quote.sym} ${quote.name} ${action} ${qty} 張 @ ${price}（模擬）`);
  }

  return (
    <div className="lightning-page">
      <div className="lightning-top">
        <button className="lightning-back" onClick={onBack}>‹</button>
        <div>
          <div className="lightning-title">證券閃電下單</div>
          <div className="lightning-account">{selectedAccount.label}</div>
        </div>
        <Badge color="amber">快速模式</Badge>
      </div>

      <div className="lightning-account-row">
        <span>{selectedAccount.type}</span>
        <select value={selectedAccountId} onChange={(event) => setSelectedAccountId(event.target.value)}>
          {accountOptions.map((account) => (
            <option value={account.id} key={account.id}>{account.label}</option>
          ))}
        </select>
      </div>

      <div className="lightning-search-row">
        <label className="lightning-search">
          <span>搜尋商品</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && searchSymbol()} placeholder="請輸入股票代號" />
        </label>
        <button className="action-btn primary" onClick={searchSymbol}>查詢</button>
      </div>

      <div className="lightning-quote">
        <div>
          <span className="stat-label">商品</span>
          <strong>{quote.name} {quote.sym}</strong>
        </div>
        <div>
          <span className="stat-label">成交價</span>
          <strong className={quote.up === false ? 'pnl-neg' : 'pnl-pos'}>{quote.price}</strong>
        </div>
        <div>
          <span className="stat-label">漲跌</span>
          <strong className={quote.up === false ? 'pnl-neg' : 'pnl-pos'}>{quote.up === false ? '▼' : '▲'} {quote.change}</strong>
        </div>
        <div>
          <span className="stat-label">成交量</span>
          <strong>42,851</strong>
        </div>
      </div>

      <div className="lightning-note">本頁面為閃電下單模式，點擊價格會直接送出該價格之模擬委託單。</div>

      <div className="lightning-ladder">
        <div className="ladder-head ladder-cancel">買全刪</div>
        <div className="ladder-head ladder-buy">委買</div>
        <div className="ladder-head ladder-price">價格</div>
        <div className="ladder-head ladder-sell">委賣</div>
        <div className="ladder-head ladder-cancel">賣全刪</div>
        {ladder.map((row) => (
          <React.Fragment key={row.price}>
            <button className="ladder-cell ladder-cancel" onClick={() => setNotice('買方刪單功能已記錄（模擬）')}>{row.bid ? '×' : ''}</button>
            <button className="ladder-cell ladder-buy" onClick={() => sendLightningOrder('buy', row.price)}>{row.bid}</button>
            <button className={`ladder-cell ladder-price ${row.current ? 'current' : ''}`} onClick={() => sendLightningOrder('buy', row.price)}>{row.price}</button>
            <button className="ladder-cell ladder-sell" onClick={() => sendLightningOrder('sell', row.price)}>{row.ask}</button>
            <button className="ladder-cell ladder-cancel" onClick={() => setNotice('賣方刪單功能已記錄（模擬）')}>{row.ask ? '×' : ''}</button>
          </React.Fragment>
        ))}
      </div>

      <div className="lightning-bottom">
        <select value={productType} onChange={(event) => setProductType(event.target.value)}>
          <option value="cash">現股</option>
          <option value="margin">融資</option>
          <option value="short">融券</option>
        </select>
        <select value={timeInForce} onChange={(event) => setTimeInForce(event.target.value)}>
          <option>ROD</option>
          <option>IOC</option>
          <option>FOK</option>
        </select>
        <div className="lightning-stepper">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <strong>{qty}</strong>
          <button onClick={() => setQty(qty + 1)}>＋</button>
        </div>
      </div>

      <div className="lightning-status">
        <span>{productType === 'cash' ? '現股' : productType === 'margin' ? '融資' : '融券'} · {timeInForce} · {qty} 張</span>
        <strong>{notice || '等待點擊價格送出委託'}</strong>
      </div>
    </div>
  );
}

function OrderRiskPreview({ productType, side, amount, orderType }) {
  const financeAmount = amount * 0.6;
  const selfPay = amount - financeAmount;
  const collateral = amount * 0.9;
  const borrowable = side === 'sell' ? '42 張' : '已持有 18 張';
  const rows = productType === 'margin'
    ? [
        ['成交金額', orderType === 'market' ? '市價估算' : formatAmount(amount)],
        ['融資成數', '60%'],
        ['融資金額', formatAmount(financeAmount)],
        ['自備款', formatAmount(selfPay)],
        ['預估維持率', side === 'buy' ? '156%' : '償還後 178%'],
        ['追繳線距離', side === 'buy' ? '26%' : '48%'],
      ]
    : productType === 'short'
      ? [
          ['成交金額', orderType === 'market' ? '市價估算' : formatAmount(amount)],
          ['融券保證金', formatAmount(collateral)],
          ['可借券量', borrowable],
          ['預估維持率', side === 'sell' ? '148%' : '回補後解除'],
          ['回補風險', side === 'sell' ? '偏高觀察' : '降低'],
        ]
      : [
          ['成交金額', orderType === 'market' ? '市價估算' : formatAmount(amount)],
          ['交割款', side === 'buy' ? `T+2 應付 ${formatAmount(amount)}` : `T+2 應收 ${formatAmount(amount)}`],
          ['可用額度', '$12,000,000'],
          ['風控狀態', '通過'],
        ];

  return (
    <div className={`order-risk-preview ${productType}`}>
      <div className="order-risk-head">
        <span>{productType === 'margin' ? '融資風控預估' : productType === 'short' ? '融券風控預估' : '現股交割預估'}</span>
        <Badge color={productType === 'cash' ? 'blue' : productType === 'margin' ? 'amber' : 'purple'}>{getOrderAction(productType, side)}</Badge>
      </div>
      <div className="order-risk-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, right, children }) {
  return <label className="form-field"><span className="form-line"><span className="form-label">{label}</span>{right && <span className="acct-remain">{right}</span>}</span>{children}</label>;
}

function PendingOrder({ tone, text, detail }) {
  return (
    <div className="pending-order">
      <div><div className={`pending-title ${tone}`}>{text}</div><div className="tiny muted">{detail}</div></div>
      <IconButton variant="danger" title="撤單"><X size={14} /></IconButton>
    </div>
  );
}

function ConfirmModal({ selected, side, orderType, tradeSession, productType, timeInForce, qty, price, amount, selectedAccount, submitMode, close, confirm }) {
  const numericPrice = Number(String(price).replace(',', '')) || 0;
  const action = getOrderAction(productType, side);
  const productLabel = productType === 'margin' ? '融資' : productType === 'short' ? '融券' : '現股';
  const sessionLabel = tradeSession === 'after' ? '盤後' : tradeSession === 'odd' ? '盤後零股' : '整股';
  const submitModeLabel = submitMode === 'lightning' ? '閃電交易' : '一般下單';
  const reason = orderType === 'market'
    ? '原因：市價單，Phase 1 模擬模式強制確認'
    : productType === 'margin'
      ? '原因：融資委託，需確認自備款與維持率'
      : productType === 'short'
        ? '原因：融券委託，需確認可借券量與回補風險'
    : amount > 5000000
      ? `原因：預估金額 $${Math.round(amount).toLocaleString()} 超過 $5,000,000 門檻`
      : '風控全數通過，請確認委託內容後送出';
  return (
    <div className="modal-overlay show">
      <div className="modal-box">
        <div className="modal-header"><span className="modal-warn-icon"><AlertTriangle size={18} /></span><span className="modal-title">確認{submitModeLabel}</span></div>
        <div className="modal-reason">{reason}</div>
        <div className="modal-grid">
          <ModalField label="使用帳號" value={selectedAccount.label} />
          <ModalField label="下單模式" value={submitModeLabel} tone={submitMode === 'lightning' ? 'val-amber' : ''} />
          <ModalField label="商品" value={`${selected.sym} ${selected.name}`} />
          <ModalField label="交易種類" value={productLabel} tone={productType === 'margin' ? 'val-amber' : productType === 'short' ? 'val-blue' : ''} />
          <ModalField label="交易時段" value={sessionLabel} />
          <ModalField label="買賣" value={action} tone={side === 'buy' ? 'pnl-pos' : 'pnl-neg'} />
          <ModalField label="數量" value={`${qty} 張`} />
          <ModalField label="委託條件" value={timeInForce} />
          <ModalField label="價格類型" value={orderType === 'limit' ? '限價單' : '市價單'} />
          <ModalField label="委託價格" value={`$${numericPrice.toLocaleString()}`} />
        </div>
        <Divider />
        <div className="modal-grid">
          <ModalField label="預估金額" value={`$${Math.round(amount).toLocaleString()}`} tone="big" />
          <ModalField label="帳號剩餘額度" value={selectedAccount.remaining} />
          <ModalField label="今日已實現損益" value={selectedAccount.realized} tone="pnl-pos" />
          <ModalField label="風控狀態" value="通過" tone="pnl-pos" />
        </div>
        <div className="modal-phase-note">PHASE 1 模擬模式 — 此委託不會送至真實券商，僅記錄稽核 log</div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={close}>取消</button>
          <button className="modal-confirm" onClick={confirm}>確認{submitModeLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ModalField({ label, value, tone = '' }) {
  return <div className="modal-field"><span className="modal-field-label">{label}</span><span className={`modal-field-val ${tone}`}>{value}</span></div>;
}

function OrdersTable() {
  const rows = [
    ['09:31:22', '2330', '買進', '限價', '10', '978.00', '永豐A', '已成交', '主帳號'],
    ['09:28:15', '2317', '買進', '限價', '20', '170.00', '永豐A', '部分成交 12/20', '主帳號'],
    ['09:15:03', '0050', '買進', '限價', '30', '183.00', '永豐A', '已成交', '主帳號'],
    ['09:02:44', '2454', '買進', '限價', '5', '1,198.00', '富邦B', '已成交', '手動切換'],
  ];
  return <SimpleTable headers={['時間', '商品', '方向', '類型', '數量', '價格', '帳號', '狀態', '路由原因']} rows={rows} />;
}

function TradesTable() {
  const rows = [
    ['09:31:25', '2330', '買進', '10', '978.00', '$2,934', '—', '永豐A'],
    ['09:28:18', '2317', '買進', '12', '169.50', '$814', '—', '永豐A'],
    ['09:15:07', '0050', '買進', '30', '182.80', '$2,742', '—', '永豐A'],
    ['09:02:50', '2454', '買進', '5', '1,198.00', '$2,396', '—', '富邦B'],
  ];
  return <SimpleTable headers={['時間', '商品', '方向', '成交量', '成交價', '手續費', '稅', '帳號']} rows={rows} />;
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="scroll-x">
      <table className="data-table simple-table">
        <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => <tr key={row.join('-')}>{row.map((cell, i) => <td key={`${cell}-${i}`} className={i === 2 ? 'pnl-pos' : i === 0 ? 'muted' : ''}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Ticker() {
  return (
    <div className="ticker-bar">
      <span className="ticker-label">最新報價</span>
      <div className="ticker-items">{watchlist.map((item) => <span key={item.sym} className={`ticker-item ${item.up === false ? 'pnl-neg' : item.up ? 'pnl-pos' : 'pnl-zero'}`}>{item.sym} {item.up === false ? '▼' : item.up ? '▲' : '—'}{item.price} {item.change}</span>)}</div>
    </div>
  );
}

function PositionsTab() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(traderGroups[0].category);
  const categoryTraders = traderGroups.filter((trader) => trader.category === selectedCategoryId);
  const [selectedTraderName, setSelectedTraderName] = useState(categoryTraders[0].name);
  const visibleTraders = categoryTraders.length ? categoryTraders : traderGroups;
  const selectedTrader = traderGroups.find((trader) => trader.name === selectedTraderName) || traderGroups[0];
  const selectedCategory = traderCategoryMeta[selectedTrader.category];
  const selectedMarginGroup = marginGroups.find((group) => group.trader === selectedTrader.name);
  const selectedAlert = marginAlerts.find((alert) => alert.trader === selectedTrader.name);

  function changeCategory(categoryId) {
    const nextTraders = traderGroups.filter((trader) => trader.category === categoryId);
    setSelectedCategoryId(categoryId);
    setSelectedTraderName(nextTraders[0]?.name || traderGroups[0].name);
  }

  return (
    <div className="positions-layout">
      <div className="summary-grid">
        <SummaryCard label="全場總市值" value="$61,627,500" detail="現股 + 融資合併觀察" tone="val-blue" />
        <SummaryCard label="融資總額" value="$8,420,000" detail="最低維持率 134%" tone="val-amber" />
        <SummaryCard label="追繳線最近距離" value="4%" detail="小王 · 2317 鴻海" tone="pnl-neg" />
        <SummaryCard label="今日已實現合計" value="+$38,400" detail="三位操盤手合計" tone="pnl-pos" />
      </div>
      <div className="positions-workspace">
        <aside className="trader-switcher">
          <div className="trader-switcher-title">篩選操盤手</div>
          <label className="filter-field">
            <span>操盤類別</span>
            <select value={selectedCategoryId} onChange={(event) => changeCategory(event.target.value)}>
              {traderCategories.map((category) => (
                <option value={category.id} key={category.id}>{category.label}</option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <span>操盤手</span>
            <select value={selectedTraderName} onChange={(event) => setSelectedTraderName(event.target.value)}>
              {visibleTraders.map((trader) => (
                <option value={trader.name} key={trader.name}>{trader.name} · {trader.accounts}</option>
              ))}
            </select>
          </label>
          <div className="selected-trader-card">
            <div className="trader-category-head">
              <span>{selectedCategory.label}</span>
              <Badge color={selectedCategory.color}>{visibleTraders.length} 人</Badge>
            </div>
            <div className="trader-category-desc">{selectedCategory.desc}</div>
            <TraderChip {...selectedTrader} />
            <div className="trader-switch-stats">
              <span>總損益 <strong className="pnl-pos">{selectedTrader.total}</strong></span>
              <span>融資維持率 <strong className={selectedAlert?.level === 'danger' ? 'pnl-neg' : selectedAlert?.level === 'warn' ? 'val-amber' : 'pnl-pos'}>{selectedAlert?.ratio || '-'}%</strong></span>
            </div>
            <Badge color={selectedAlert?.level === 'danger' ? 'red' : selectedAlert?.level === 'warn' ? 'amber' : 'green'}>{selectedAlert?.status || '正常'}</Badge>
          </div>
        </aside>
        <main className="trader-detail-panel">
          <div className="selected-trader-summary">
            <div>
              <span className="stat-label">目前檢視</span>
              <h2>{selectedTrader.name} <Badge color={selectedCategory.color}>{selectedCategory.label}</Badge></h2>
              <p>{selectedTrader.accounts}</p>
            </div>
            <div className="stat-group">
              <Stat label="未實現" value={selectedTrader.unrealized} tone="pnl-pos" />
              <Stat label="已實現" value={selectedTrader.realized} tone={selectedTrader.realized.startsWith('-') ? 'pnl-neg' : 'pnl-pos'} />
              <Stat label="總損益" value={selectedTrader.total} tone="pnl-pos" />
              <Stat label="最低維持率" value={`${selectedAlert?.ratio || selectedMarginGroup?.totals.minRatio || '-'}%`} tone={selectedAlert?.level === 'danger' ? 'pnl-neg' : selectedAlert?.level === 'warn' ? 'val-amber' : 'pnl-pos'} />
            </div>
          </div>
          <TraderPositionBlock trader={selectedTrader} compactHeader />
        </main>
      </div>
      <div className="grand-total-bar">
        <strong>全場持倉與融資合計</strong>
        <div className="stat-group">
          <Stat label="現股 T+2 全額" value="$14,916,500" tone="val-blue" />
          <Stat label="融資總額" value="$8,420,000" tone="val-amber" />
          <Stat label="融資自備款" value="$4,647,000" tone="val-amber" />
          <Stat label="最低維持率" value="134%" tone="pnl-neg" />
          <Stat label="整體損益率" value="+2.22%" tone="pnl-pos" />
        </div>
      </div>
    </div>
  );
}

function PositionSubsection({ title, meta, children }) {
  return (
    <div className="position-subsection">
      <div className="position-subsection-head">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      {children}
    </div>
  );
}

function SummaryCard({ label, value, detail, tone }) {
  return <div className="summary-card"><span className="stat-label">{label}</span><div className={`big-val ${tone}`}>{value}</div><div className="tiny muted">{detail}</div></div>;
}

function TraderChip({ name, avatar, avatarClass, accounts }) {
  return <div className="trader-chip"><span className={`avatar av-${avatarClass}`}>{avatar}</span><span><strong>{name}</strong><small>{accounts}</small></span></div>;
}

function AdminTab() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const adminTraderOptions = categoryFilter === 'all'
    ? traderGroups
    : traderGroups.filter((trader) => trader.category === categoryFilter);
  const [traderFilter, setTraderFilter] = useState('all');
  const visibleCategories = traderCategories
    .map((category) => ({
      ...category,
      traders: category.traders.filter((trader) => (
        (categoryFilter === 'all' || trader.category === categoryFilter)
        && (traderFilter === 'all' || trader.name === traderFilter)
      )),
    }))
    .filter((category) => category.traders.length);

  function changeAdminCategory(categoryId) {
    setCategoryFilter(categoryId);
    setTraderFilter('all');
  }

  return (
    <div className="admin-layout">
      <div className="admin-head">
        <div><h2>操盤室損益矩陣</h2><span className="tiny muted">即時更新 · 09:32:15</span></div>
        <div className="icon-actions">
          <IconButton variant="danger" title="緊急熔斷全場"><Ban size={16} /></IconButton>
          <IconButton variant="primary" title="匯出報表"><Download size={16} /></IconButton>
        </div>
      </div>
      <div className="admin-filter-bar">
        <label className="filter-field">
          <span>操盤類別</span>
          <select value={categoryFilter} onChange={(event) => changeAdminCategory(event.target.value)}>
            <option value="all">全部類別</option>
            {traderCategories.map((category) => (
              <option value={category.id} key={category.id}>{category.label}</option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>操盤手</span>
          <select value={traderFilter} onChange={(event) => setTraderFilter(event.target.value)}>
            <option value="all">全部操盤手</option>
            {adminTraderOptions.map((trader) => (
              <option value={trader.name} key={trader.name}>{trader.name} · {traderCategoryMeta[trader.category].label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-summary-grid">
        {visibleCategories.map((category) => (
          <div className="category-summary-card" key={category.id}>
            <div>
              <span className="stat-label">操盤類別</span>
              <strong>{category.label}</strong>
            </div>
            <Badge color={category.color}>{category.traders.map((trader) => trader.name).join(' · ')}</Badge>
          </div>
        ))}
      </div>
      <div className="scroll-x">
        <table className="matrix-table">
          <thead><tr><th>類別 / 操盤手</th><th>永豐A</th><th>富邦B</th><th>群益C</th><th>已實現合計</th><th>未實現</th><th>總損益</th><th>風控</th></tr></thead>
          <tbody>
            {visibleCategories.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="matrix-category-row">
                  <td colSpan="8">
                    <span>{category.label}</span>
                    <small>{category.desc}</small>
                  </td>
                </tr>
                {category.traders.map((trader) => {
                  const row = adminMatrix[trader.name];
                  return <MatrixRow trader={trader} cells={row.cells} warn={row.warn} key={trader.name} />;
                })}
              </React.Fragment>
            ))}
            <tr className="total-row"><td>全場合計</td><td className="pnl-pos">+$20,500</td><td className="pnl-pos">+$33,800</td><td className="pnl-pos">+$10,500</td><td className="pnl-pos">+$64,800</td><td className="pnl-pos">+$1,433,500</td><td className="pnl-pos">+$1,498,300</td><td /></tr>
          </tbody>
        </table>
      </div>
      <div className="acct-cards-grid">
        <AccountMini name="永豐A" status="正常" percent={60} amount="$12,000,000 / $20,000,000" note="連線品質優 | RTT 4ms" color="amber" />
        <AccountMini name="富邦B" status="正常" percent={35} amount="$5,250,000 / $15,000,000" note="連線品質優 | RTT 6ms" color="green" />
        <AccountMini name="群益C" status="重連中" percent={20} amount="$2,000,000 / $10,000,000" note="重連 3/5 | 最後同步 09:28" color="green" warn />
      </div>
    </div>
  );
}

function MatrixRow({ trader, cells, warn }) {
  return <tr><td><TraderChip {...trader} /></td>{cells.map((cell, i) => <td key={`${cell}-${i}`} className={cell.startsWith('-') ? 'pnl-neg' : cell === '—' ? 'muted' : i === 6 ? '' : 'pnl-pos'}>{i === 6 ? <Badge color={warn ? 'amber' : 'green'}>{cell}</Badge> : cell}</td>)}</tr>;
}

function AccountMini({ name, status, percent, amount, note, color, warn }) {
  return (
    <div className={`acct-mini-card ${warn ? 'warn' : ''}`}>
      <div className="mini-head"><strong>{name}</strong><Badge color={warn ? 'amber' : 'green'}>● {status}</Badge></div>
      <span className="stat-label">今日已用 / 額度</span>
      <div className="mini-amount">{amount}</div>
      <div className="quota-track"><div className={`quota-fill fill-${color}`} style={{ width: `${percent}%` }} /></div>
      <div className={`tiny ${warn ? 'val-amber' : 'muted'}`}>{note}</div>
    </div>
  );
}

function AccountsTab() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const accounts = [
    {
      name: '永豐證券 A',
      status: '啟用',
      meta: '012-345678 · 台股現貨 · 新台幣 · Adapter: SinoPacAdapter',
      bindings: [
        { category: 'proprietary', text: '自有操盤：小王(主1) · 小李(備援1)' },
      ],
      quota: '$20,000,000',
      used: '$12,000,000',
      pnl: '+$20,500',
      warn: false,
    },
    {
      name: '富邦證券 B',
      status: '啟用',
      meta: '988-221144 · 台股現貨 · 新台幣 · Adapter: FubonAdapter',
      bindings: [
        { category: 'proprietary', text: '自有操盤：小王(備援1)' },
        { category: 'external', text: '丙種操盤：小陳(主1) · 小林(備援1)' },
      ],
      quota: '$15,000,000',
      used: '$5,250,000',
      pnl: '+$33,800',
      warn: false,
    },
    {
      name: '群益證券 C',
      status: '重連中',
      meta: 'KGI-779900 · 台股現貨/期貨 · 新台幣 · Adapter: KGIAdapter',
      bindings: [
        { category: 'proprietary', text: '自有操盤：小李(備援2)' },
        { category: 'external', text: '丙種操盤：小林(主1)' },
      ],
      quota: '$10,000,000',
      used: '$2,000,000',
      pnl: '+$10,500',
      warn: true,
      note: '連線錯誤：TCP timeout (09:28:44) · 重連嘗試 3/5',
    },
  ];
  const visibleAccounts = accounts.filter((account) => (
    categoryFilter === 'all' || account.bindings.some((binding) => binding.category === categoryFilter)
  ));
  return (
    <div className="accounts-layout">
      <SectionHeader title="券商帳號管理" action={<button className="add-btn"><Plus size={14} />新增帳號</button>} />
      <div className="account-category-filter">
        <button className={categoryFilter === 'all' ? 'active' : ''} onClick={() => setCategoryFilter('all')}>全部帳號</button>
        {traderCategories.map((category) => (
          <button
            className={categoryFilter === category.id ? 'active' : ''}
            key={category.id}
            onClick={() => setCategoryFilter(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      {visibleAccounts.map((account) => <AccountCard key={account.name} data={account} activeCategory={categoryFilter} />)}
    </div>
  );
}

function AccountCard({ data, activeCategory }) {
  const { name, status, meta, bindings, note, quota, used, pnl, warn } = data;
  const shownBindings = activeCategory === 'all'
    ? bindings
    : bindings.filter((binding) => binding.category === activeCategory);
  return (
    <div className={`account-card ${warn ? 'warn' : ''}`}>
      <div className="account-card-info">
        <div className="account-card-name">{name} <Badge color={warn ? 'amber' : 'green'}>{status}</Badge></div>
        <div className="account-card-meta">{meta}</div>
        <div className="account-binding-list">
          {shownBindings.map((binding) => (
            <div className="account-binding-line" key={binding.text}>
              <Badge color={traderCategoryMeta[binding.category].color}>{traderCategoryMeta[binding.category].label}</Badge>
              <span>{binding.text.replace(`${traderCategoryMeta[binding.category].label}：`, '')}</span>
            </div>
          ))}
        </div>
        {note && <div className={`account-card-meta ${warn ? 'val-amber' : ''}`}>{note}</div>}
      </div>
      <div className="account-card-stats">
        <Stat label="每日額度" value={quota} tone="val-blue" />
        <Stat label="今日已用" value={used} tone={warn ? 'pnl-pos' : 'val-amber'} />
        <Stat label="今日損益" value={pnl} tone="pnl-pos" />
      </div>
      <div className="icon-actions">
        {warn && <IconButton variant="primary" title="強制重連"><RotateCcw size={16} /></IconButton>}
        <IconButton title="設定"><Settings size={16} /></IconButton>
        <IconButton title="綁定操盤手"><UserPlus size={16} /></IconButton>
        <IconButton variant="danger" title={warn ? '鎖定帳號' : '停用'}><Ban size={16} /></IconButton>
      </div>
    </div>
  );
}

function RiskTab() {
  const rules = [
    ['#1 操盤手每日虧損上限', 'scope: trader · 超過則禁止下單，記錄違規', '$500,000', 'green', '啟用', true],
    ['#2 單筆委託金額上限', 'scope: trader · 超過則強制二次確認 Modal', '$5,000,000', 'green', '啟用', true],
    ['#3 帳號額度使用超過 80% 警示', 'scope: account · 達標跳出二次確認', '80%', 'green', '啟用', true],
    ['#4 盤中急速波動攔截', 'scope: global · 5分鐘內漲跌超過閾值自動警示', '±3.5%', 'green', '啟用', true],
    ['#5 市價單強制二次確認', 'scope: global · Phase 2+ 啟用', '必確認', 'amber', 'Phase 2', false],
    ['#6 帳號每日虧損熔斷線', 'scope: account · 鎖定帳號並通知管理員', '$1,000,000', 'green', '啟用', true],
    ['#7 自動帳號路由切換', 'scope: global · Phase 4 才開放，需操盤手 auto_route_enabled', '停用', 'gray', 'Phase 4', false],
  ];
  return (
    <div className="risk-rules-layout">
      <SectionHeader title="Risk Engine 風控規則" action={<button className="add-btn"><Plus size={14} />新增規則</button>} />
      <div className="tiny muted">下單前 Risk Engine 依序檢查，任一失敗立即拒絕並記錄 risk_violations</div>
      {rules.map(([name, desc, value, badge, status, checked]) => (
        <div className="risk-rule-row" key={name}>
          <div className="rule-info"><span className="rule-name">{name}</span><span className="rule-desc">{desc}</span></div>
          <strong className="rule-value">{value}</strong>
          <Badge color={badge}>{status}</Badge>
          <label className="toggle"><input type="checkbox" checked={checked} disabled={!checked} readOnly /><span className="toggle-slider" /></label>
        </div>
      ))}
    </div>
  );
}

function AuditTab() {
  const rows = [
    ['09:32:10', '小王', '送出委託 2330 買進 10張 限價$980 → 永豐A | risk_check: passed | route: 主帳號 | 模擬模式', '下單', 'blue'],
    ['09:30:55', '小李', '風控攔截 2330 買進 50張 $49,000,000 → 超過單筆上限 $5,000,000，已拒絕，記錄 risk_violations', '風控', 'red'],
    ['09:28:44', '系統', '群益C 連線中斷 TCP timeout，自動暫停路由至群益C，通知管理員，記錄 system_freeze_logs', '系統', 'amber'],
    ['09:25:12', '小陳', '送出委託 2454 買進 8張 限價$1,210 → 富邦B | 二次確認通過 | confirmed_by: 小陳 | 模擬模式', '下單', 'blue'],
    ['09:20:30', '管理員', '修改風控規則 #2 單筆上限 $3,000,000 → $5,000,000，記錄 admin_action_logs (before/after JSON)', '管理', 'purple'],
    ['09:15:07', '小王', '送出委託 0050 買進 30張 限價$183 → 永豐A | 成交價 182.80 | 模擬模式', '下單', 'blue'],
  ];
  return (
    <div className="audit-layout">
      <SectionHeader title="稽核紀錄（audit_logs，不可修改）" action={<IconButton title="匯出 CSV"><Download size={16} /></IconButton>} />
      {rows.map(([time, actor, action, type, color]) => <div className="audit-row" key={time}><span className="audit-time">{time}</span><strong className="audit-actor">{actor}</strong><span className="audit-action">{action}</span><Badge color={color}>{type}</Badge></div>)}
    </div>
  );
}

function SectionHeader({ title, action }) {
  return <div className="section-header"><span className="section-header-title">{title}</span>{action}</div>;
}

function App() {
  const [tab, setTab] = useState('trader');
  const showMarginWarning = ['admin', 'accounts', 'risk', 'audit'].includes(tab);
  return (
    <>
      <StatusBar />
      <Tabs active={tab} setActive={setTab} />
      {showMarginWarning && <MarginWarningBar />}
      <div className="tab-content active">
        {tab === 'trader' && <TraderTab />}
        {tab === 'positions' && <PositionsTab />}
        {tab === 'admin' && <AdminTab />}
        {tab === 'accounts' && <AccountsTab />}
        {tab === 'risk' && <RiskTab />}
        {tab === 'audit' && <AuditTab />}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
