import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { addTransaction, fetchFinance } from '../features/finance/financeSlice'

import {
  X,
  DollarSign,
  Wallet,
  Tag,
  FileText,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'

export default function FinanceModal({ onClose, type = 'expense' }) {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [f, setF] = useState({
    type,
    account: 'personal',
    amount: '',
    category: type === 'income' ? 'Salary' : 'General',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  })

  /* =========================================
     UPDATE FIELD
  ========================================= */

  const updateField = (field, value) => {
    setF((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /* =========================================
     CHANGE TRANSACTION TYPE
  ========================================= */

  const changeType = (newType) => {
    setF((prev) => ({
      ...prev,

      type: newType,

      category: newType === 'income' ? 'Salary' : 'General',
    }))
  }

  /* =========================================
     SUBMIT
  ========================================= */

  const submit = async (e) => {
    e.preventDefault()

    if (!f.amount || Number(f.amount) <= 0) {
      return
    }

    try {
      setLoading(true)

      await dispatch(
        addTransaction({
          ...f,
          amount: Number(f.amount),
        }),
      ).unwrap()

      await dispatch(fetchFinance())

      onClose()
    } catch (error) {
      console.error('Unable to save transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    /* =========================================
       OVERLAY
    ========================================= */

    <div
      className="
        fixed
        inset-0
        z-[70]
        grid
        place-items-center
        overflow-y-auto
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* =====================================
          MODAL
      ===================================== */}

      <form
        onSubmit={submit}
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-2xl
          border
          border-slate-700/70
          bg-[#111a2e]
          shadow-2xl
          shadow-black/40
        "
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            px-6
            py-5
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-blue-400
              "
            >
              New transaction
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-black
                capitalize
                text-slate-100
              "
            >
              Add {f.type}
            </h2>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-800
              hover:text-slate-200
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =====================================
            FORM CONTENT
        ===================================== */}

        <div className="p-6">
          {/* ===================================
              INCOME / EXPENSE SELECTOR
          =================================== */}

          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold text-slate-400">
              Transaction type
            </label>

            <div
              className="
                grid
                grid-cols-2
                gap-2
                rounded-xl
                bg-[#0d1424]
                p-1.5
              "
            >
              {/* INCOME */}

              <button
                type="button"
                onClick={() => changeType('income')}
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  transition-all

                  ${
                    f.type === 'income'
                      ? `
                        bg-emerald-500/15
                        text-emerald-400
                        shadow-sm
                      `
                      : `
                        text-slate-500
                        hover:bg-slate-800/70
                        hover:text-slate-300
                      `
                  }
                `}
              >
                <ArrowUpRight size={17} />
                Income
              </button>

              {/* EXPENSE */}

              <button
                type="button"
                onClick={() => changeType('expense')}
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  transition-all

                  ${
                    f.type === 'expense'
                      ? `
                        bg-rose-500/15
                        text-rose-400
                        shadow-sm
                      `
                      : `
                        text-slate-500
                        hover:bg-slate-800/70
                        hover:text-slate-300
                      `
                  }
                `}
              >
                <ArrowDownRight size={17} />
                Expense
              </button>
            </div>
          </div>

          {/* ===================================
              FORM
          =================================== */}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* ACCOUNT */}

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Account
              </label>

              <div className="relative">
                <Wallet
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <select
                  className="input pl-10"
                  value={f.account}
                  onChange={(e) => updateField('account', e.target.value)}
                >
                  <option value="personal">Personal</option>

                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <input
                  required
                  type="date"
                  className="input pl-10"
                  value={f.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
            </div>

            {/* =================================
                AMOUNT
            ================================= */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Amount
              </label>

              <div className="relative">
                <DollarSign
                  size={20}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-blue-400
                  "
                />

                <input
                  required
                  min="0.01"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={f.amount}
                  onChange={(e) => updateField('amount', e.target.value)}
                  className="
                    input
                    py-4
                    pl-11
                    text-xl
                    font-black
                    text-slate-100
                    placeholder:text-slate-600
                  "
                />
              </div>
            </div>

            {/* =================================
                CATEGORY
            ================================= */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Category
              </label>

              <div className="relative">
                <Tag
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />

                <input
                  required
                  className="input pl-10"
                  placeholder={
                    f.type === 'income'
                      ? 'Salary, Freelance, Sales...'
                      : 'Food, Rent, Transport...'
                  }
                  value={f.category}
                  onChange={(e) => updateField('category', e.target.value)}
                />
              </div>
            </div>

            {/* =================================
                DESCRIPTION
            ================================= */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Description
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-3.5
                    text-slate-500
                  "
                />

                <textarea
                  rows="3"
                  className="
                    input
                    resize-none
                    pl-10
                  "
                  placeholder="Add an optional note..."
                  value={f.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            FOOTER
        ===================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-2
            border-t
            border-slate-800
            bg-[#0d1424]/60
            px-6
            py-4
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            className="btn btn-soft"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`
              btn
              flex
              items-center
              justify-center
              gap-2

              ${
                f.type === 'income'
                  ? `
                    bg-emerald-600
                    text-white
                    hover:bg-emerald-500
                  `
                  : `
                    bg-blue-600
                    text-white
                    hover:bg-blue-500
                  `
              }

              ${loading ? 'cursor-not-allowed opacity-60' : ''}
            `}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {f.type === 'income' ? (
                  <ArrowUpRight size={17} />
                ) : (
                  <ArrowDownRight size={17} />
                )}
                Save transaction
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
