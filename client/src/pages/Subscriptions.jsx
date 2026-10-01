import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  addSubscription,
  chargeSubscription,
  deleteSubscription,
  fetchFinance,
} from '../features/finance/financeSlice'

import {
  Plus,
  Trash2,
  ReceiptText,
  CalendarDays,
  WalletCards,
  Building2,
  UserRound,
  RefreshCw,
  CreditCard,
  DollarSign,
  X,
  Loader2,
  ArrowDownToLine,
  Tag,
  TrendingDown,
} from 'lucide-react'

/* =========================================
   CURRENCY FORMATTER
========================================= */

const money = (number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(Number(number) || 0)

export default function Subscriptions() {
  const dispatch = useDispatch()

  const { subscriptions = [], error } = useSelector((state) => state.finance)

  const [open, setOpen] = useState(false)

  const [saving, setSaving] = useState(false)

  const [chargingId, setChargingId] = useState(null)

  const [deletingId, setDeletingId] = useState(null)

  const [f, setF] = useState({
    name: '',
    amount: '',
    account: 'personal',
    billingCycle: 'monthly',
    nextBillingDate: new Date().toISOString().slice(0, 10),
    category: 'Subscription',
  })

  /* =========================================
     LOAD FINANCE
  ========================================= */

  useEffect(() => {
    dispatch(fetchFinance())
  }, [dispatch])

  /* =========================================
     MONTHLY COST
  ========================================= */

  const monthlyCost = useMemo(() => {
    return subscriptions.reduce((total, subscription) => {
      const amount = Number(subscription.amount) || 0

      if (subscription.billingCycle === 'yearly') {
        return total + amount / 12
      }

      return total + amount
    }, 0)
  }, [subscriptions])

  /* =========================================
     YEARLY COST
  ========================================= */

  const yearlyCost = useMemo(() => {
    return subscriptions.reduce((total, subscription) => {
      const amount = Number(subscription.amount) || 0

      if (subscription.billingCycle === 'yearly') {
        return total + amount
      }

      return total + amount * 12
    }, 0)
  }, [subscriptions])

  /* =========================================
     ACCOUNT TOTALS
  ========================================= */

  const personalCount = subscriptions.filter(
    (subscription) => subscription.account === 'personal',
  ).length

  const businessCount = subscriptions.filter(
    (subscription) => subscription.account === 'business',
  ).length

  /* =========================================
     UPDATE FORM
  ========================================= */

  const updateField = (field, value) => {
    setF((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  /* =========================================
     ADD SUBSCRIPTION
  ========================================= */

  const submit = async (event) => {
    event.preventDefault()

    if (!f.name.trim() || Number(f.amount) <= 0) {
      return
    }

    try {
      setSaving(true)

      await dispatch(
        addSubscription({
          ...f,
          name: f.name.trim(),
          amount: Number(f.amount),
          category: f.category.trim() || 'Subscription',
        }),
      ).unwrap()

      await dispatch(fetchFinance())

      setOpen(false)

      setF({
        name: '',
        amount: '',
        account: 'personal',
        billingCycle: 'monthly',
        nextBillingDate: new Date().toISOString().slice(0, 10),
        category: 'Subscription',
      })
    } catch (error) {
      console.error('Unable to add subscription:', error)
    } finally {
      setSaving(false)
    }
  }

  /* =========================================
     CHARGE SUBSCRIPTION
  ========================================= */

  const handleCharge = async (subscription) => {
    try {
      setChargingId(subscription._id)

      await dispatch(chargeSubscription(subscription._id)).unwrap()

      await dispatch(fetchFinance())
    } catch (error) {
      console.error('Unable to charge subscription:', error)
    } finally {
      setChargingId(null)
    }
  }

  /* =========================================
     DELETE SUBSCRIPTION
  ========================================= */

  const handleDelete = async (subscription) => {
    const confirmed = window.confirm(`Delete "${subscription.name}"?`)

    if (!confirmed) return

    try {
      setDeletingId(subscription._id)

      await dispatch(deleteSubscription(subscription._id)).unwrap()
    } catch (error) {
      console.error('Unable to delete subscription:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {/* =====================================
          HEADER
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
            Subscriptions
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              text-slate-500
            "
          >
            Manage recurring costs and add subscription payments to your monthly
            expenses.
          </p>
        </div>

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
          Add subscription
        </button>
      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-amber-500/20
            bg-amber-500/10
            p-4
            text-sm
            text-amber-400
          "
        >
          {typeof error === 'string'
            ? error
            : error?.message || 'Something went wrong.'}
        </div>
      )}

      {/* =====================================
          SUMMARY
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
        {/* ACTIVE */}

        <div className="card p-5">
          <div
            className="
              flex
              items-center
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
                border-blue-500/20
                bg-blue-500/10
                text-blue-400
              "
            >
              <ReceiptText size={20} />
            </div>

            <span
              className="
                rounded-lg
                bg-blue-500/10
                px-2
                py-1
                text-[10px]
                font-bold
                text-blue-400
              "
            >
              ACTIVE
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
            Total Subscriptions
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-black
              text-slate-100
            "
          >
            {subscriptions.length}
          </h3>
        </div>

        {/* MONTHLY */}

        <div className="card p-5">
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
            <TrendingDown size={20} />
          </div>

          <p
            className="
              mt-5
              text-xs
              font-bold
              text-slate-500
            "
          >
            Estimated Monthly
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-black
              text-rose-400
            "
          >
            {money(monthlyCost)}
          </h3>
        </div>

        {/* YEARLY */}

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
            <CalendarDays size={20} />
          </div>

          <p
            className="
              mt-5
              text-xs
              font-bold
              text-slate-500
            "
          >
            Estimated Yearly
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-black
              text-violet-400
            "
          >
            {money(yearlyCost)}
          </h3>
        </div>

        {/* ACCOUNTS */}

        <div className="card p-5">
          <div
            className="
              grid
              h-11
              w-11
              place-items-center
              rounded-xl
              border
              border-cyan-500/20
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <WalletCards size={20} />
          </div>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <p className="text-xs text-slate-500">Personal</p>

              <p className="font-black text-blue-400">{personalCount}</p>
            </div>

            <div
              className="
                h-8
                w-px
                bg-slate-800
              "
            />

            <div>
              <p className="text-xs text-slate-500">Business</p>

              <p className="font-black text-violet-400">{businessCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          SUBSCRIPTION GRID
      ===================================== */}

      <div
        className="
          mt-7
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {subscriptions.map((subscription) => {
          const isPersonal = subscription.account === 'personal'

          const isCharging = chargingId === subscription._id

          const isDeleting = deletingId === subscription._id

          return (
            <div
              className="
                  card
                  group
                  relative
                  overflow-hidden
                  p-5
                "
              key={subscription._id}
            >
              {/* TOP ACCENT */}

              <div
                className={`
                    absolute
                    left-0
                    top-0
                    h-1
                    w-full

                    ${isPersonal ? 'bg-blue-500' : 'bg-violet-500'}
                  `}
              />

              {/* TOP */}

              <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
              >
                <div
                  className={`
                      grid
                      h-12
                      w-12
                      place-items-center
                      rounded-xl
                      border

                      ${
                        isPersonal
                          ? `
                            border-blue-500/20
                            bg-blue-500/10
                            text-blue-400
                          `
                          : `
                            border-violet-500/20
                            bg-violet-500/10
                            text-violet-400
                          `
                      }
                    `}
                >
                  <ReceiptText size={21} />
                </div>

                {/* DELETE */}

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(subscription)}
                  className="
                      grid
                      h-9
                      w-9
                      place-items-center
                      rounded-lg
                      text-slate-600
                      transition
                      hover:bg-rose-500/10
                      hover:text-rose-400
                      disabled:opacity-50
                    "
                >
                  {isDeleting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Trash2 size={17} />
                  )}
                </button>
              </div>

              {/* NAME */}

              <h3
                className="
                    mt-5
                    truncate
                    text-lg
                    font-black
                    text-slate-100
                  "
              >
                {subscription.name}
              </h3>

              {/* PRICE */}

              <div className="mt-2">
                <span
                  className="
                      text-2xl
                      font-black
                      text-slate-100
                    "
                >
                  {money(subscription.amount)}
                </span>

                <span
                  className="
                      ml-1
                      text-xs
                      font-medium
                      text-slate-500
                    "
                >
                  /{subscription.billingCycle}
                </span>
              </div>

              {/* INFO */}

              <div
                className="
                    mt-5
                    space-y-2.5
                    border-t
                    border-slate-800
                    pt-4
                  "
              >
                {/* ACCOUNT */}

                <div
                  className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-xs
                    "
                >
                  <span
                    className="
                        flex
                        items-center
                        gap-2
                        text-slate-500
                      "
                  >
                    {isPersonal ? (
                      <UserRound size={14} />
                    ) : (
                      <Building2 size={14} />
                    )}
                    Account
                  </span>

                  <span
                    className={`
                        rounded-lg
                        px-2
                        py-1
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
                    {subscription.account}
                  </span>
                </div>

                {/* CATEGORY */}

                <div
                  className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-xs
                    "
                >
                  <span
                    className="
                        flex
                        items-center
                        gap-2
                        text-slate-500
                      "
                  >
                    <Tag size={14} />
                    Category
                  </span>

                  <span className="font-semibold text-slate-300">
                    {subscription.category || 'Subscription'}
                  </span>
                </div>

                {/* NEXT BILL */}

                <div
                  className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-xs
                    "
                >
                  <span
                    className="
                        flex
                        items-center
                        gap-2
                        text-slate-500
                      "
                  >
                    <CalendarDays size={14} />
                    Next billing
                  </span>

                  <span className="font-semibold text-slate-300">
                    {new Date(subscription.nextBillingDate).toLocaleDateString(
                      'en-CA',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      },
                    )}
                  </span>
                </div>
              </div>

              {/* CHARGE BUTTON */}

              <button
                type="button"
                disabled={isCharging}
                onClick={() => handleCharge(subscription)}
                className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-4
                    py-3
                    text-xs
                    font-bold
                    text-blue-400
                    transition
                    hover:bg-blue-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
              >
                {isCharging ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Adding expense...
                  </>
                ) : (
                  <>
                    <ArrowDownToLine size={16} />
                    Add to this month's expenses
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {!subscriptions.length && (
        <div
          className="
            card
            mt-7
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
            <ReceiptText size={28} />
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-black
              text-slate-100
            "
          >
            No subscriptions yet
          </h3>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-500
            "
          >
            Add recurring expenses such as Netflix, Spotify, insurance,
            software, memberships or business services.
          </p>

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
            Add subscription
          </button>
        </div>
      )}

      {/* =====================================
          ADD SUBSCRIPTION MODAL
      ===================================== */}

      {open && (
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
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false)
            }
          }}
        >
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
            {/* ===============================
                MODAL HEADER
            =============================== */}

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
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-xl
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    text-blue-400
                  "
                >
                  <CreditCard size={19} />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-blue-400
                    "
                  >
                    Recurring expense
                  </p>

                  <h2
                    className="
                      mt-1
                      text-xl
                      font-black
                      text-slate-100
                    "
                  >
                    New subscription
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-white
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* ===============================
                MODAL BODY
            =============================== */}

            <div className="p-6">
              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >
                {/* NAME */}

                <div className="sm:col-span-2">
                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Subscription name
                  </label>

                  <div className="relative">
                    <ReceiptText
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
                      autoFocus
                      className="input pl-10"
                      placeholder="Netflix, Spotify, Adobe..."
                      value={f.name}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* AMOUNT */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Amount
                  </label>

                  <div className="relative">
                    <DollarSign
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
                      min="0.01"
                      type="number"
                      step="0.01"
                      className="input pl-10"
                      placeholder="0.00"
                      value={f.amount}
                      onChange={(event) =>
                        updateField('amount', event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* BILLING CYCLE */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Billing cycle
                  </label>

                  <div className="relative">
                    <RefreshCw
                      size={16}
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
                      className="
                        input
                        pl-10
                        capitalize
                      "
                      value={f.billingCycle}
                      onChange={(event) =>
                        updateField('billingCycle', event.target.value)
                      }
                    >
                      <option value="monthly">Monthly</option>

                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                {/* ACCOUNT */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Account
                  </label>

                  <select
                    className="input capitalize"
                    value={f.account}
                    onChange={(event) =>
                      updateField('account', event.target.value)
                    }
                  >
                    <option value="personal">Personal</option>

                    <option value="business">Business</option>
                  </select>
                </div>

                {/* DATE */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Next billing date
                  </label>

                  <input
                    required
                    type="date"
                    className="input"
                    value={f.nextBillingDate}
                    onChange={(event) =>
                      updateField('nextBillingDate', event.target.value)
                    }
                  />
                </div>

                {/* CATEGORY */}

                <div className="sm:col-span-2">
                  <label
                    className="
                      mb-2
                      block
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
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
                      className="input pl-10"
                      placeholder="Subscription"
                      value={f.category}
                      onChange={(event) =>
                        updateField('category', event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================
                MODAL FOOTER
            =============================== */}

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
                disabled={saving}
                className="btn btn-soft"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  btn
                  btn-primary
                  flex
                  items-center
                  justify-center
                  gap-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Save subscription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
