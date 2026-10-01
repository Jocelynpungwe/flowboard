import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchFinance } from '../features/finance/financeSlice'

import { fetchTasks, toggleTask } from '../features/tasks/taskSlice'

import FinanceModal from '../components/FinanceModal'

import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Repeat2,
  Plus,
  CheckCircle2,
  Circle,
} from 'lucide-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

/* =========================================
   MONEY FORMATTER
========================================= */

const money = (n) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(n || 0)

/* =========================================
   CUSTOM CHART TOOLTIP
========================================= */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-slate-700 bg-[#111a2e] px-4 py-3 shadow-2xl">
      <p className="text-xs font-semibold text-slate-400">{label}</p>

      <p className="mt-1 text-sm font-black text-blue-400">
        {money(payload[0]?.value)}
      </p>
    </div>
  )
}

/* =========================================
   DASHBOARD
========================================= */

export default function Dashboard() {
  const dispatch = useDispatch()

  const { summary, transactions } = useSelector((state) => state.finance)

  const tasks = useSelector((state) => state.tasks.items)

  const [modal, setModal] = useState(null)

  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {
    dispatch(fetchFinance())

    dispatch(fetchTasks())
  }, [dispatch])

  /* =========================================
     FINANCE CARDS
  ========================================= */

  const cards = [
    {
      name: 'Income',
      value: summary.income,
      icon: ArrowUpRight,

      iconStyle:
        'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',

      valueStyle: 'text-emerald-400',
    },

    {
      name: 'Expenses',
      value: summary.expense,
      icon: ArrowDownRight,

      iconStyle: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',

      valueStyle: 'text-rose-400',
    },

    {
      name: 'Subscriptions',
      value: summary.subscriptions,
      icon: Repeat2,

      iconStyle: 'text-violet-400 bg-violet-500/10 border border-violet-500/20',

      valueStyle: 'text-violet-400',
    },

    {
      name: 'Net Cash Flow',
      value: summary.net,
      icon: CircleDollarSign,

      iconStyle: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',

      valueStyle: summary.net >= 0 ? 'text-blue-400' : 'text-rose-400',
    },
  ]

  /* =========================================
     CHART DATA
  ========================================= */

  const chart = Object.entries(summary.categories || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  )

  return (
    <>
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
            Overview
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-100 md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Your financial and productivity snapshot for this month.
          </p>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setModal('income')}
            className="btn btn-soft flex items-center gap-2"
          >
            <Plus size={17} />
            Income
          </button>

          <button
            onClick={() => setModal('expense')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={17} />
            Expense
          </button>
        </div>
      </div>

      {/* =====================================
          FINANCIAL CARDS
      ===================================== */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div className="card group p-5" key={card.name}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">
                  {card.name}
                </span>

                <span
                  className={`
                    rounded-xl
                    p-2.5
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    ${card.iconStyle}
                  `}
                >
                  <Icon size={20} />
                </span>
              </div>

              <div
                className={`
                  mt-5
                  text-2xl
                  font-black
                  tracking-tight
                  ${card.valueStyle}
                `}
              >
                {money(card.value)}
              </div>

              <div className="mt-1 text-xs font-medium text-slate-500">
                Current month
              </div>
            </div>
          )
        })}
      </div>

      {/* =====================================
          CHART + TASKS
      ===================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* SPENDING CHART */}

        <div className="card p-5 md:p-6">
          <div>
            <h2 className="font-black text-slate-100">Spending by category</h2>

            <p className="mt-1 text-xs text-slate-500">
              Your expenses for the current month.
            </p>
          </div>

          <div className="mt-6 h-72">
            {chart.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chart}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: 'rgba(59, 130, 246, 0.05)',
                    }}
                  />

                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={55}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center">
                <div className="text-center">
                  <CircleDollarSign
                    size={35}
                    className="mx-auto mb-3 text-slate-700"
                  />

                  <p className="text-sm text-slate-500">
                    Add expenses to see your spending chart.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            UPCOMING TASKS
        ===================================== */}

        <div className="card p-5 md:p-6">
          <div>
            <h2 className="font-black text-slate-100">Upcoming tasks</h2>

            <p className="mt-1 text-xs text-slate-500">
              Stay on top of your priorities.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            {tasks.slice(0, 6).map((task) => (
              <button
                onClick={() => dispatch(toggleTask(task))}
                key={task._id}
                className="
                    group
                    flex
                    w-full
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-transparent
                    p-3
                    text-left
                    transition-all
                    duration-200
                    hover:border-blue-500/10
                    hover:bg-blue-500/5
                  "
              >
                {task.completed ? (
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-blue-400"
                    size={19}
                  />
                ) : (
                  <Circle
                    className="
                        mt-0.5
                        shrink-0
                        text-slate-600
                        transition-colors
                        group-hover:text-blue-400
                      "
                    size={19}
                  />
                )}

                <span className="min-w-0">
                  <span
                    className={`
                        block
                        truncate
                        text-sm
                        font-bold
                        ${
                          task.completed
                            ? 'text-slate-500 line-through'
                            : 'text-slate-200'
                        }
                      `}
                  >
                    {task.title}
                  </span>

                  <span className="mt-1 block text-xs capitalize text-slate-500">
                    {task.workspace}

                    <span className="mx-1.5 text-slate-700">•</span>

                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </span>
              </button>
            ))}

            {!tasks.length && (
              <div className="py-12 text-center">
                <CheckCircle2
                  size={34}
                  className="mx-auto mb-3 text-slate-700"
                />

                <p className="text-sm text-slate-500">No tasks yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          RECENT TRANSACTIONS
      ===================================== */}

      <div className="card mt-6 overflow-hidden">
        {/* HEADER */}

        <div className="border-b border-slate-800 px-5 py-5 md:px-6">
          <h2 className="font-black text-slate-100">Recent transactions</h2>

          <p className="mt-1 text-xs text-slate-500">
            Your latest income and expenses.
          </p>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1424] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Description</th>

                <th className="px-4">Category</th>

                <th className="px-4">Account</th>

                <th className="px-4">Date</th>

                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.slice(0, 6).map((transaction) => (
                <tr
                  className="
                      border-t
                      border-slate-800/80
                      text-slate-300
                      transition-colors
                      hover:bg-blue-500/5
                    "
                  key={transaction._id}
                >
                  <td className="p-4 font-bold text-slate-200">
                    {transaction.description || transaction.category}
                  </td>

                  <td className="px-4 text-slate-400">
                    {transaction.category}
                  </td>

                  <td className="px-4 capitalize text-slate-400">
                    <span
                      className="
                          rounded-lg
                          border
                          border-slate-700
                          bg-slate-800/60
                          px-2.5
                          py-1
                          text-xs
                        "
                    >
                      {transaction.account}
                    </span>
                  </td>

                  <td className="px-4 text-slate-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>

                  <td
                    className={`
                        p-4
                        text-right
                        font-black
                        ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }
                      `}
                  >
                    {transaction.type === 'income' ? '+' : '-'}

                    {money(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY TRANSACTIONS */}

          {!transactions.length && (
            <div className="py-14 text-center">
              <CircleDollarSign
                size={35}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-sm text-slate-500">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          FINANCE MODAL
      ===================================== */}

      {modal && <FinanceModal type={modal} onClose={() => setModal(null)} />}
    </>
  )
}
