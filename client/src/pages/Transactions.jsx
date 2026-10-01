import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  deleteTransaction,
  fetchFinance,
} from '../features/finance/financeSlice'

import FinanceModal from '../components/FinanceModal'

import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  WalletCards,
  Search,
  SlidersHorizontal,
  UserRound,
  Building2,
  CalendarDays,
  Tag,
  Loader2,
  ReceiptText,
  TrendingUp,
  TrendingDown,
  Landmark,
} from 'lucide-react'

/* =========================================
   MONEY FORMATTER
========================================= */

const money = (number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(Number(number) || 0)

export default function Transactions() {
  const dispatch = useDispatch()

  const items = useSelector((state) => state.finance.transactions || [])

  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState('')

  const [typeFilter, setTypeFilter] = useState('all')

  const [accountFilter, setAccountFilter] = useState('all')

  const [deletingId, setDeletingId] = useState(null)

  /* =========================================
     LOAD TRANSACTIONS
  ========================================= */

  useEffect(() => {
    dispatch(fetchFinance())
  }, [dispatch])

  /* =========================================
     TOTALS
  ========================================= */

  const totals = useMemo(() => {
    const income = items
      .filter((transaction) => transaction.type === 'income')
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      )

    const expenses = items
      .filter((transaction) => transaction.type === 'expense')
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      )

    return {
      income,
      expenses,
      cashFlow: income - expenses,
    }
  }, [items])

  /* =========================================
     FILTER TRANSACTIONS
  ========================================= */

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((transaction) => {
      const matchesSearch =
        !query ||
        transaction.description?.toLowerCase().includes(query) ||
        transaction.category?.toLowerCase().includes(query) ||
        transaction.account?.toLowerCase().includes(query)

      const matchesType =
        typeFilter === 'all' || transaction.type === typeFilter

      const matchesAccount =
        accountFilter === 'all' || transaction.account === accountFilter

      return matchesSearch && matchesType && matchesAccount
    })
  }, [items, search, typeFilter, accountFilter])

  /* =========================================
     DELETE TRANSACTION
  ========================================= */

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      `Delete ${transaction.description || 'this transaction'}?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(transaction._id)

      await dispatch(deleteTransaction(transaction._id)).unwrap()

      await dispatch(fetchFinance())
    } catch (error) {
      console.error('Unable to delete transaction:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div
        className="
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              mb-1
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-blue-400
            "
          >
            Finance
          </p>

          <h1
            className="
              text-3xl
              font-black
              tracking-tight
              text-slate-100
              md:text-4xl
            "
          >
            Transactions
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Track every dollar coming in and going out.
          </p>
        </div>

        {/* ADD */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            btn
            btn-primary
            flex
            h-fit
            items-center
            gap-2
          "
        >
          <Plus size={18} />
          Add transaction
        </button>
      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div
        className="
          mt-7
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* INCOME */}

        <div className="card p-5">
          <div
            className="
              flex
              items-start
              justify-between
            "
          >
            <div
              className="
                grid
                h-11
                w-11
                place-items-center
                rounded-xl
                border
                border-emerald-500/20
                bg-emerald-500/10
                text-emerald-400
              "
            >
              <ArrowUpRight size={21} />
            </div>

            <span
              className="
                rounded-lg
                bg-emerald-500/10
                px-2
                py-1
                text-[10px]
                font-black
                text-emerald-400
              "
            >
              INCOME
            </span>
          </div>

          <p
            className="
              mt-5
              text-xs
              font-bold
              text-slate-500
            "
          >
            Total Income
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-black
              text-emerald-400
            "
          >
            {money(totals.income)}
          </h3>
        </div>

        {/* EXPENSES */}

        <div className="card p-5">
          <div
            className="
              flex
              items-start
              justify-between
            "
          >
            <div
              className="
                grid
                h-11
                w-11
                place-items-center
                rounded-xl
                border
                border-rose-500/20
                bg-rose-500/10
                text-rose-400
              "
            >
              <ArrowDownRight size={21} />
            </div>

            <span
              className="
                rounded-lg
                bg-rose-500/10
                px-2
                py-1
                text-[10px]
                font-black
                text-rose-400
              "
            >
              EXPENSES
            </span>
          </div>

          <p
            className="
              mt-5
              text-xs
              font-bold
              text-slate-500
            "
          >
            Total Expenses
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-black
              text-rose-400
            "
          >
            {money(totals.expenses)}
          </h3>
        </div>

        {/* CASH FLOW */}

        <div className="card p-5">
          <div
            className="
              flex
              items-start
              justify-between
            "
          >
            <div
              className={`
                grid
                h-11
                w-11
                place-items-center
                rounded-xl
                border

                ${
                  totals.cashFlow >= 0
                    ? `
                      border-blue-500/20
                      bg-blue-500/10
                      text-blue-400
                    `
                    : `
                      border-rose-500/20
                      bg-rose-500/10
                      text-rose-400
                    `
                }
              `}
            >
              {totals.cashFlow >= 0 ? (
                <TrendingUp size={21} />
              ) : (
                <TrendingDown size={21} />
              )}
            </div>
          </div>

          <p
            className="
              mt-5
              text-xs
              font-bold
              text-slate-500
            "
          >
            Net Cash Flow
          </p>

          <h3
            className={`
              mt-1
              text-2xl
              font-black

              ${totals.cashFlow >= 0 ? 'text-blue-400' : 'text-rose-400'}
            `}
          >
            {money(totals.cashFlow)}
          </h3>
        </div>

        {/* TRANSACTIONS */}

        <div className="card p-5">
          <div
            className="
              grid
              h-11
              w-11
              place-items-center
              rounded-xl
              border
              border-violet-500/20
              bg-violet-500/10
              text-violet-400
            "
          >
            <WalletCards size={21} />
          </div>

          <p
            className="
              mt-5
              text-xs
              font-bold
              text-slate-500
            "
          >
            Transactions
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-black
              text-slate-100
            "
          >
            {items.length}
          </h3>
        </div>
      </div>

      {/* =====================================
          FILTER BAR
      ===================================== */}

      <div
        className="
          card
          mt-6
          p-4
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            xl:flex-row
            xl:items-center
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              flex-1
            "
          >
            <Search
              size={17}
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              className="input pl-11"
              placeholder="Search transactions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {/* FILTER ICON */}

          <div
            className="
              hidden
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-xl
              border
              border-slate-800
              bg-[#0d1424]
              text-slate-500
              xl:grid
            "
          >
            <SlidersHorizontal size={17} />
          </div>

          {/* TYPE FILTER */}

          <select
            className="
              input
              xl:w-44
            "
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All types</option>

            <option value="income">Income</option>

            <option value="expense">Expenses</option>
          </select>

          {/* ACCOUNT FILTER */}

          <select
            className="
              input
              xl:w-44
            "
            value={accountFilter}
            onChange={(event) => setAccountFilter(event.target.value)}
          >
            <option value="all">All accounts</option>

            <option value="personal">Personal</option>

            <option value="business">Business</option>
          </select>
        </div>
      </div>

      {/* =====================================
          TRANSACTION TABLE
      ===================================== */}

      <div
        className="
          card
          mt-5
          overflow-hidden
        "
      >
        {/* TABLE HEADER */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-b
            border-slate-800
            px-5
            py-4
          "
        >
          <div>
            <h2
              className="
                font-black
                text-slate-100
              "
            >
              Transaction history
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Showing {filteredItems.length} of {items.length} transactions
            </p>
          </div>
        </div>

        {/* ===================================
            DESKTOP TABLE
        =================================== */}

        <div
          className="
            hidden
            overflow-x-auto
            md:block
          "
        >
          <table
            className="
              w-full
              min-w-[850px]
              text-left
              text-sm
            "
          >
            <thead
              className="
                bg-[#0d1424]
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              <tr>
                <th className="px-5 py-4">Description</th>

                <th className="px-4 py-4">Type</th>

                <th className="px-4 py-4">Category</th>

                <th className="px-4 py-4">Account</th>

                <th className="px-4 py-4">Date</th>

                <th className="px-4 py-4 text-right">Amount</th>

                <th className="w-16 px-4 py-4"></th>
              </tr>
            </thead>

            <tbody
              className="
                divide-y
                divide-slate-800/80
              "
            >
              {filteredItems.map((transaction) => {
                const isIncome = transaction.type === 'income'

                const isPersonal = transaction.account === 'personal'

                const isDeleting = deletingId === transaction._id

                return (
                  <tr
                    key={transaction._id}
                    className="
                        group
                        transition-colors
                        hover:bg-blue-500/[0.03]
                      "
                  >
                    {/* DESCRIPTION */}

                    <td className="px-5 py-4">
                      <div
                        className="
                            flex
                            items-center
                            gap-3
                          "
                      >
                        <div
                          className={`
                              grid
                              h-9
                              w-9
                              shrink-0
                              place-items-center
                              rounded-lg

                              ${
                                isIncome
                                  ? `
                                    bg-emerald-500/10
                                    text-emerald-400
                                  `
                                  : `
                                    bg-rose-500/10
                                    text-rose-400
                                  `
                              }
                            `}
                        >
                          {isIncome ? (
                            <ArrowUpRight size={16} />
                          ) : (
                            <ArrowDownRight size={16} />
                          )}
                        </div>

                        <div
                          className="
                              min-w-0
                            "
                        >
                          <p
                            className="
                                max-w-[240px]
                                truncate
                                font-bold
                                text-slate-200
                              "
                          >
                            {transaction.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* TYPE */}

                    <td className="px-4 py-4">
                      <span
                        className={`
                            inline-flex
                            items-center
                            rounded-lg
                            border
                            px-2.5
                            py-1
                            text-[10px]
                            font-black
                            capitalize

                            ${
                              isIncome
                                ? `
                                  border-emerald-500/20
                                  bg-emerald-500/10
                                  text-emerald-400
                                `
                                : `
                                  border-rose-500/20
                                  bg-rose-500/10
                                  text-rose-400
                                `
                            }
                          `}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    {/* CATEGORY */}

                    <td
                      className="
                          px-4
                          py-4
                          text-slate-400
                        "
                    >
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                          "
                      >
                        <Tag size={13} className="text-slate-600" />

                        {transaction.category || 'General'}
                      </div>
                    </td>

                    {/* ACCOUNT */}

                    <td className="px-4 py-4">
                      <span
                        className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            capitalize

                            ${
                              isPersonal
                                ? `
                                  bg-blue-500/10
                                  text-blue-400
                                `
                                : `
                                  bg-violet-500/10
                                  text-violet-400
                                `
                            }
                          `}
                      >
                        {isPersonal ? (
                          <UserRound size={11} />
                        ) : (
                          <Building2 size={11} />
                        )}

                        {transaction.account}
                      </span>
                    </td>

                    {/* DATE */}

                    <td
                      className="
                          px-4
                          py-4
                          text-xs
                          text-slate-500
                        "
                    >
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                          "
                      >
                        <CalendarDays size={13} />

                        {new Date(transaction.date).toLocaleDateString(
                          'en-CA',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </div>
                    </td>

                    {/* AMOUNT */}

                    <td
                      className={`
                          px-4
                          py-4
                          text-right
                          font-black

                          ${isIncome ? 'text-emerald-400' : 'text-rose-400'}
                        `}
                    >
                      {isIncome ? '+' : '-'}
                      {money(transaction.amount)}
                    </td>

                    {/* DELETE */}

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(transaction)}
                        className="
                            grid
                            h-8
                            w-8
                            place-items-center
                            rounded-lg
                            text-slate-600
                            opacity-0
                            transition-all
                            hover:bg-rose-500/10
                            hover:text-rose-400
                            group-hover:opacity-100
                            disabled:opacity-50
                          "
                        title="Delete transaction"
                      >
                        {isDeleting ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ===================================
            MOBILE TRANSACTIONS
        =================================== */}

        <div
          className="
            divide-y
            divide-slate-800
            md:hidden
          "
        >
          {filteredItems.map((transaction) => {
            const isIncome = transaction.type === 'income'

            const isDeleting = deletingId === transaction._id

            return (
              <div key={transaction._id} className="p-4">
                <div
                  className="
                      flex
                      items-start
                      gap-3
                    "
                >
                  {/* ICON */}

                  <div
                    className={`
                        grid
                        h-10
                        w-10
                        shrink-0
                        place-items-center
                        rounded-xl

                        ${
                          isIncome
                            ? `
                              bg-emerald-500/10
                              text-emerald-400
                            `
                            : `
                              bg-rose-500/10
                              text-rose-400
                            `
                        }
                      `}
                  >
                    {isIncome ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>

                  {/* INFO */}

                  <div
                    className="
                        min-w-0
                        flex-1
                      "
                  >
                    <div
                      className="
                          flex
                          items-start
                          justify-between
                          gap-2
                        "
                    >
                      <div>
                        <p
                          className="
                              truncate
                              font-bold
                              text-slate-200
                            "
                        >
                          {transaction.description || 'No description'}
                        </p>

                        <p
                          className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                        >
                          {transaction.category || 'General'}
                        </p>
                      </div>

                      <p
                        className={`
                            whitespace-nowrap
                            font-black

                            ${isIncome ? 'text-emerald-400' : 'text-rose-400'}
                          `}
                      >
                        {isIncome ? '+' : '-'}
                        {money(transaction.amount)}
                      </p>
                    </div>

                    {/* MOBILE META */}

                    <div
                      className="
                          mt-3
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                    >
                      <span
                        className="
                            rounded-lg
                            bg-slate-800
                            px-2
                            py-1
                            text-[10px]
                            font-bold
                            capitalize
                            text-slate-400
                          "
                      >
                        {transaction.account}
                      </span>

                      <span
                        className="
                            text-[10px]
                            text-slate-500
                          "
                      >
                        {new Date(transaction.date).toLocaleDateString('en-CA')}
                      </span>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(transaction)}
                        className="
                            ml-auto
                            grid
                            h-8
                            w-8
                            place-items-center
                            rounded-lg
                            text-slate-600
                            hover:bg-rose-500/10
                            hover:text-rose-400
                          "
                      >
                        {isDeleting ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ===================================
            EMPTY STATE
        =================================== */}

        {!filteredItems.length && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-5
              py-20
              text-center
            "
          >
            <div
              className="
                grid
                h-16
                w-16
                place-items-center
                rounded-2xl
                border
                border-blue-500/20
                bg-blue-500/10
                text-blue-400
              "
            >
              <ReceiptText size={27} />
            </div>

            <h3
              className="
                mt-5
                font-black
                text-slate-200
              "
            >
              {items.length ? 'No transactions found' : 'No transactions yet'}
            </h3>

            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
              "
            >
              {items.length
                ? 'Try changing your search or filters.'
                : 'Add your first income or expense to start tracking your finances.'}
            </p>

            {!items.length && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="
                  btn
                  btn-primary
                  mt-5
                  flex
                  items-center
                  gap-2
                "
              >
                <Plus size={17} />
                Add transaction
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================
          FINANCE MODAL
      ===================================== */}

      {open && <FinanceModal onClose={() => setOpen(false)} />}
    </>
  )
}
