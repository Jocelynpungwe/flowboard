import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { login, register } from '../features/auth/authSlice'

import {
  BarChart3,
  CalendarCheck2,
  WalletCards,
  Mail,
  Lock,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

export default function Auth() {
  const [mode, setMode] = useState('login')

  const [showPassword, setShowPassword] = useState(false)

  const [f, setF] = useState({
    name: '',
    email: '',
    password: '',
  })

  const dispatch = useDispatch()

  const auth = useSelector((state) => state.auth)

  /* =========================================
     REDIRECT WHEN LOGGED IN
  ========================================= */

  if (auth.token) {
    return <Navigate to="/" />
  }

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
     SUBMIT
  ========================================= */

  const submit = (e) => {
    e.preventDefault()

    if (mode === 'login') {
      dispatch(
        login({
          email: f.email,
          password: f.password,
        }),
      )
    } else {
      dispatch(register(f))
    }
  }

  /* =========================================
     CHANGE MODE
  ========================================= */

  const changeMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')

    setShowPassword(false)
  }

  return (
    <div
      className="
        relative
        grid
        min-h-screen
        place-items-center
        overflow-hidden
        bg-[#060b14]
        p-4
        sm:p-6
      "
    >
      {/* =====================================
          BACKGROUND DECORATION
      ===================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-48
          -right-40
          h-[550px]
          w-[550px]
          rounded-full
          bg-cyan-500/10
          blur-[130px]
        "
      />

      {/* =====================================
          AUTH CONTAINER
      ===================================== */}

      <div
        className="
          relative
          z-10
          grid
          w-full
          max-w-6xl
          overflow-hidden
          rounded-[2rem]
          border
          border-slate-800
          bg-[#0d1424]
          shadow-2xl
          shadow-black/50
          lg:min-h-[680px]
          lg:grid-cols-[1.05fr_0.95fr]
        "
      >
        {/* ===================================
            LEFT SIDE
        =================================== */}

        <section
          className="
            relative
            hidden
            overflow-hidden
            border-r
            border-slate-800
            bg-[#0a1220]
            p-12
            lg:flex
            lg:flex-col
          "
        >
          {/* BACKGROUND GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -right-40
              top-32
              h-96
              w-96
              rounded-full
              bg-blue-600/10
              blur-[100px]
            "
          />

          {/* LOGO */}

          <div className="relative z-10 flex items-center gap-3">
            <div
              className="
                grid
                h-11
                w-11
                place-items-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-blue-700
                text-white
                shadow-lg
                shadow-blue-600/20
              "
            >
              <LayoutDashboard size={21} />
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                Flow
                <span className="text-blue-400">Board</span>
              </div>

              <div className="text-[11px] font-medium text-slate-500">
                Life & Finance Manager
              </div>
            </div>
          </div>

          {/* HERO */}

          <div className="relative z-10 mt-20">
            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/10
                px-3
                py-1.5
                text-xs
                font-bold
                text-blue-400
              "
            >
              <CheckCircle2 size={14} />
              One place. Everything organized.
            </div>

            <h1
              className="
                max-w-lg
                text-4xl
                font-black
                leading-[1.15]
                tracking-tight
                text-white
                xl:text-5xl
              "
            >
              Manage your money.
              <br />
              <span
                className="
                  bg-gradient-to-r
                  from-blue-400
                  to-cyan-400
                  bg-clip-text
                  text-transparent
                "
              >
                Organize your life.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-lg
                text-sm
                leading-7
                text-slate-400
              "
            >
              One powerful dashboard for your personal finances, work, business
              and everything you need to get done.
            </p>
          </div>

          {/* =================================
              FEATURES
          ================================= */}

          <div className="relative z-10 mt-12 space-y-3">
            {/* FINANCE */}

            <div
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/30
                p-4
                transition
                hover:border-blue-500/20
                hover:bg-blue-500/5
              "
            >
              <div
                className="
                  grid
                  h-11
                  w-11
                  shrink-0
                  place-items-center
                  rounded-xl
                  bg-emerald-500/10
                  text-emerald-400
                  ring-1
                  ring-emerald-500/20
                "
              >
                <WalletCards size={20} />
              </div>

              <div>
                <div className="text-sm font-bold text-slate-200">
                  Track your finances
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Income, expenses, subscriptions and cash flow
                </div>
              </div>
            </div>

            {/* P&L */}

            <div
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/30
                p-4
                transition
                hover:border-blue-500/20
                hover:bg-blue-500/5
              "
            >
              <div
                className="
                  grid
                  h-11
                  w-11
                  shrink-0
                  place-items-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-400
                  ring-1
                  ring-blue-500/20
                "
              >
                <BarChart3 size={20} />
              </div>

              <div>
                <div className="text-sm font-bold text-slate-200">
                  Understand your P&amp;L
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  See where your money comes from and where it goes
                </div>
              </div>
            </div>

            {/* TASKS */}

            <div
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/30
                p-4
                transition
                hover:border-blue-500/20
                hover:bg-blue-500/5
              "
            >
              <div
                className="
                  grid
                  h-11
                  w-11
                  shrink-0
                  place-items-center
                  rounded-xl
                  bg-violet-500/10
                  text-violet-400
                  ring-1
                  ring-violet-500/20
                "
              >
                <CalendarCheck2 size={20} />
              </div>

              <div>
                <div className="text-sm font-bold text-slate-200">
                  Organize every task
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Personal, work and business planning
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM TEXT */}

          <div className="relative z-10 mt-auto pt-10">
            <p className="text-xs text-slate-600">
              Finance • Productivity • Organization
            </p>
          </div>
        </section>

        {/* ===================================
            AUTH FORM SIDE
        =================================== */}

        <section
          className="
            flex
            items-center
            justify-center
            bg-[#0d1424]
            p-6
            sm:p-10
            lg:p-14
            xl:p-16
          "
        >
          <form onSubmit={submit} className="w-full max-w-md">
            {/* MOBILE LOGO */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div
                className="
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-xl
                  bg-blue-600
                  text-white
                "
              >
                <LayoutDashboard size={19} />
              </div>

              <div>
                <div className="text-xl font-black text-white">
                  Flow
                  <span className="text-blue-400">Board</span>
                </div>

                <div className="text-[10px] text-slate-500">
                  Life & Finance Manager
                </div>
              </div>
            </div>

            {/* =================================
                TITLE
            ================================= */}

            <div>
              <p
                className="
                  mb-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-blue-400
                "
              >
                {mode === 'login' ? 'Welcome back' : 'Get started'}
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-100
                  sm:text-4xl
                "
              >
                {mode === 'login'
                  ? 'Sign in to FlowBoard'
                  : 'Create your account'}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {mode === 'login'
                  ? 'Enter your account details to access your dashboard.'
                  : 'Start managing your finances, tasks and plans in one place.'}
              </p>
            </div>

            {/* =================================
                FORM FIELDS
            ================================= */}

            <div className="mt-8 space-y-5">
              {/* FULL NAME */}

              {mode === 'register' && (
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
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
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
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={f.name}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* =================================
                  EMAIL
              ================================= */}

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
                  Email address
                </label>

                <div className="relative">
                  <Mail
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
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={f.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
              </div>

              {/* =================================
                  PASSWORD
              ================================= */}

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
                  Password
                </label>

                <div className="relative">
                  <Lock
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
                    className="input pl-11 pr-12"
                    required
                    minLength="6"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      mode === 'login' ? 'current-password' : 'new-password'
                    }
                    placeholder="Enter your password"
                    value={f.password}
                    onChange={(e) => updateField('password', e.target.value)}
                  />

                  {/* SHOW PASSWORD */}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1.5
                      text-slate-500
                      transition
                      hover:bg-slate-800
                      hover:text-slate-300
                    "
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {mode === 'register' && (
                  <p className="mt-2 text-[11px] text-slate-600">
                    Password must contain at least 6 characters.
                  </p>
                )}
              </div>

              {/* =================================
                  ERROR
              ================================= */}

              {auth.error && (
                <div
                  className="
                    rounded-xl
                    border
                    border-rose-500/20
                    bg-rose-500/10
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-rose-400
                  "
                >
                  {typeof auth.error === 'string'
                    ? auth.error
                    : auth.error?.message ||
                      'Something went wrong. Please try again.'}
                </div>
              )}

              {/* =================================
                  SUBMIT
              ================================= */}

              <button
                type="submit"
                disabled={auth.loading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-600/20
                  transition-all
                  hover:bg-blue-500
                  hover:shadow-blue-600/30
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {auth.loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign in' : 'Create account'}

                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>

            {/* =================================
                SWITCH MODE
            ================================= */}

            <div
              className="
                mt-7
                border-t
                border-slate-800
                pt-6
                text-center
              "
            >
              <p className="text-sm text-slate-500">
                {mode === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={changeMode}
                  className="
                    font-bold
                    text-blue-400
                    transition
                    hover:text-blue-300
                  "
                >
                  {mode === 'login' ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
