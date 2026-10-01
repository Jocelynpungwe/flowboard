import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { logout } from '../features/auth/authSlice'

import {
  LayoutDashboard,
  WalletCards,
  Repeat2,
  UserRound,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

/* =========================================
   NAVIGATION
========================================= */

const links = [
  ['Dashboard', '/', LayoutDashboard],
  ['Transactions', '/transactions', WalletCards],
  ['Subscriptions', '/subscriptions', Repeat2],
  ['Personal', '/personal', UserRound],
  ['Work', '/work', BriefcaseBusiness],
  ['Business', '/business', Building2],
  ['Calendar', '/calendar', CalendarDays],
  ['All Tasks', '/tasks', CheckSquare],
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    setOpen(false)

    dispatch(logout())
  }

  /* =========================================
     USER INITIALS
  ========================================= */

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 lg:flex">
      {/* =====================================
          MOBILE SIDEBAR OVERLAY
      ===================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-800/80
          bg-[#0b1220]
          text-white
          shadow-2xl
          shadow-black/30
          transition-transform
          duration-300
          ease-in-out

          lg:sticky
          lg:top-0
          lg:h-screen
          lg:translate-x-0

          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ===================================
            LOGO
        =================================== */}

        <div
          className="
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-800
            px-5
          "
        >
          <div className="flex items-center gap-3">
            {/* LOGO ICON */}

            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-blue-700
                shadow-lg
                shadow-blue-500/20
              "
            >
              <LayoutDashboard size={20} />
            </div>

            {/* BRAND */}

            <div>
              <div className="text-xl font-black tracking-tight">
                Flow
                <span className="text-blue-400">Board</span>
              </div>

              <div className="text-[11px] font-medium text-slate-500">
                Life & Finance Manager
              </div>
            </div>
          </div>

          {/* MOBILE CLOSE */}

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
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================
            NAVIGATION
        =================================== */}

        <div
          className="
            scrollbar
            flex-1
            overflow-y-auto
            px-4
            py-5
          "
        >
          {/* MAIN LABEL */}

          <div
            className="
              mb-2
              px-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-slate-600
            "
          >
            Overview
          </div>

          <nav className="space-y-1">
            {links.map(([name, path, Icon], index) => (
              <div key={path}>
                {/* ORGANIZER SECTION */}

                {index === 3 && (
                  <div
                    className="
                        mb-2
                        mt-6
                        px-3
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-slate-600
                      "
                  >
                    Organizer
                  </div>
                )}

                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `

                      group

                      relative

                      flex

                      items-center

                      gap-3

                      rounded-xl

                      px-3

                      py-3

                      text-sm

                      font-semibold

                      transition-all

                      duration-200

                      ${
                        isActive
                          ? `
                            bg-blue-600
                            text-white
                            shadow-lg
                            shadow-blue-600/15
                          `
                          : `
                            text-slate-400
                            hover:bg-slate-800/60
                            hover:text-slate-100
                          `
                      }

                    `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.4 : 2}
                        className={
                          isActive
                            ? 'text-white'
                            : `
                                text-slate-500
                                transition-colors
                                group-hover:text-blue-400
                              `
                        }
                      />

                      <span className="flex-1">{name}</span>

                      {isActive && (
                        <ChevronRight size={15} className="text-blue-200" />
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </nav>
        </div>

        {/* ===================================
            USER / LOGOUT
        =================================== */}

        <div
          className="
            shrink-0
            border-t
            border-slate-800
            bg-[#080e19]
            p-4
          "
        >
          {/* USER PROFILE */}

          <div
            className="
              mb-3
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-800
              bg-slate-900/50
              p-3
            "
          >
            {/* AVATAR */}

            <div
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-xl
                bg-blue-500/10
                text-sm
                font-black
                text-blue-400
                ring-1
                ring-blue-500/20
              "
            >
              {initials}
            </div>

            {/* USER DETAILS */}

            <div className="min-w-0 flex-1">
              <div
                className="
                  truncate
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                {user?.name || 'User'}
              </div>

              <div
                className="
                  truncate
                  text-[11px]
                  text-slate-500
                "
              >
                {user?.email}
              </div>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              text-slate-500
              transition-all
              duration-200
              hover:bg-rose-500/10
              hover:text-rose-400
            "
          >
            <LogOut
              size={18}
              className="
                transition-transform
                group-hover:-translate-x-0.5
              "
            />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================
          MAIN APPLICATION
      ===================================== */}

      <main className="min-w-0 flex-1">
        {/* ===================================
            TOP HEADER
        =================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-20
            items-center
            justify-between
            border-b
            border-slate-800/80
            bg-[#080d1a]/90
            px-4
            backdrop-blur-xl
            md:px-8
          "
        >
          {/* LEFT */}

          <div className="flex items-center gap-4">
            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                border
                border-slate-800
                bg-[#111a2e]
                text-slate-400
                transition
                hover:border-blue-500/30
                hover:text-blue-400
                lg:hidden
              "
            >
              <Menu size={21} />
            </button>

            {/* HEADER TEXT */}

            <div>
              <div
                className="
                  text-base
                  font-black
                  text-slate-100
                  md:text-lg
                "
              >
                Your life, organized.
              </div>

              <div
                className="
                  hidden
                  text-xs
                  text-slate-500
                  sm:block
                "
              >
                Finance, tasks and plans in one place.
              </div>
            </div>
          </div>

          {/* =================================
              HEADER RIGHT
          ================================= */}

          <div className="flex items-center gap-3">
            {/* PRODUCTIVITY BADGE */}

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-blue-500/10
                bg-blue-500/5
                px-3
                py-2
                text-xs
                font-semibold
                text-blue-400
                md:flex
              "
            >
              <Sparkles size={14} />
              Stay organized
            </div>

            {/* SMALL USER AVATAR */}

            <div
              className="
                grid
                h-9
                w-9
                place-items-center
                rounded-xl
                bg-blue-600
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-blue-600/20
              "
              title={user?.name}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* ===================================
            PAGE CONTENT
        =================================== */}

        <div
          className="
            mx-auto
            w-full
            max-w-[1600px]
            p-4
            md:p-6
            xl:p-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
