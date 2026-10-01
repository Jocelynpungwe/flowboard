import { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { fetchTasks } from '../features/tasks/taskSlice'

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
} from 'lucide-react'

export default function Calendar() {
  const dispatch = useDispatch()

  const tasks = useSelector((state) => state.tasks.items)

  const [date, setDate] = useState(new Date())

  /* =========================================
     LOAD TASKS
  ========================================= */

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  /* =========================================
     CALENDAR DAYS
  ========================================= */

  const days = useMemo(() => {
    const year = date.getFullYear()

    const month = date.getMonth()

    const firstDay = new Date(year, month, 1).getDay()

    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const calendarDays = []

    /* EMPTY DAYS BEFORE MONTH */

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }

    /* MONTH DAYS */

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day))
    }

    /*
      Add empty cells at the end so
      calendar rows remain complete.
    */

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null)
    }

    return calendarDays
  }, [date])

  /* =========================================
     CHANGE MONTH
  ========================================= */

  const move = (amount) => {
    setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1))
  }

  /* =========================================
     GO TO TODAY
  ========================================= */

  const goToday = () => {
    setDate(new Date())
  }

  /* =========================================
     DATE HELPERS
  ========================================= */

  const isToday = (day) => {
    if (!day) return false

    const today = new Date()

    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  /* =========================================
     WORKSPACE STYLE
  ========================================= */

  const workspaceStyle = (workspace) => {
    switch (workspace) {
      case 'personal':
        return `
          border-blue-500/20
          bg-blue-500/10
          text-blue-400
          hover:bg-blue-500/20
        `

      case 'work':
        return `
          border-cyan-500/20
          bg-cyan-500/10
          text-cyan-400
          hover:bg-cyan-500/20
        `

      case 'business':
        return `
          border-violet-500/20
          bg-violet-500/10
          text-violet-400
          hover:bg-violet-500/20
        `

      default:
        return `
          border-slate-700
          bg-slate-800
          text-slate-400
        `
    }
  }

  /* =========================================
     MONTH TASK COUNT
  ========================================= */

  const monthTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate)

    return (
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    )
  })

  const completedThisMonth = monthTasks.filter((task) => task.completed).length

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
            Organizer
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
            Calendar
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            See personal, work and business tasks by date.
          </p>
        </div>

        {/* TODAY */}

        <button
          type="button"
          onClick={goToday}
          className="
            btn
            btn-soft
            flex
            items-center
            gap-2
          "
        >
          <CalendarDays size={17} />
          Today
        </button>
      </div>

      {/* =====================================
          MONTH SUMMARY
      ===================================== */}

      <div
        className="
          mt-7
          flex
          flex-wrap
          gap-3
        "
      >
        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-[#111a2e]
            px-4
            py-2.5
          "
        >
          <span className="text-xs text-slate-500">Tasks this month</span>

          <span
            className="
              ml-2
              text-sm
              font-black
              text-blue-400
            "
          >
            {monthTasks.length}
          </span>
        </div>

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-[#111a2e]
            px-4
            py-2.5
          "
        >
          <span className="text-xs text-slate-500">Completed</span>

          <span
            className="
              ml-2
              text-sm
              font-black
              text-emerald-400
            "
          >
            {completedThisMonth}
          </span>
        </div>
      </div>

      {/* =====================================
          CALENDAR CARD
      ===================================== */}

      <div
        className="
          card
          mt-5
          overflow-hidden
        "
      >
        {/* ===================================
            CALENDAR HEADER
        =================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            px-4
            py-5
            md:px-6
          "
        >
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={() => move(-1)}
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-xl
              border
              border-slate-800
              bg-[#0d1424]
              text-slate-400
              transition-all
              hover:border-blue-500/30
              hover:bg-blue-500/10
              hover:text-blue-400
            "
          >
            <ChevronLeft size={19} />
          </button>

          {/* MONTH */}

          <div className="text-center">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-slate-600
              "
            >
              Calendar
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-black
                text-slate-100
                md:text-xl
              "
            >
              {date.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
          </div>

          {/* NEXT */}

          <button
            type="button"
            onClick={() => move(1)}
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-xl
              border
              border-slate-800
              bg-[#0d1424]
              text-slate-400
              transition-all
              hover:border-blue-500/30
              hover:bg-blue-500/10
              hover:text-blue-400
            "
          >
            <ChevronRight size={19} />
          </button>
        </div>

        {/* ===================================
            CALENDAR
        =================================== */}

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* ===============================
                WEEK DAY HEADERS
            =============================== */}

            <div
              className="
                grid
                grid-cols-7
                border-b
                border-slate-800
                bg-[#0d1424]
                text-center
              "
            >
              {weekDays.map((weekDay) => (
                <div
                  className="
                      px-2
                      py-3
                      text-[10px]
                      font-black
                      uppercase
                      tracking-wider
                      text-slate-500
                      md:text-xs
                    "
                  key={weekDay}
                >
                  {weekDay}
                </div>
              ))}
            </div>

            {/* ===============================
                DAYS
            =============================== */}

            <div
              className="
                grid
                grid-cols-7
                bg-slate-800
                gap-px
              "
            >
              {days.map((day, index) => {
                const dayString = day?.toDateString()

                const dayTasks = day
                  ? tasks.filter(
                      (task) =>
                        new Date(task.dueDate).toDateString() === dayString,
                    )
                  : []

                const today = isToday(day)

                return (
                  <div
                    key={index}
                    className={`
                        min-h-32
                        p-2
                        transition-colors
                        md:min-h-40
                        md:p-3

                        ${
                          day
                            ? `
                              bg-[#111a2e]
                              hover:bg-[#141f35]
                            `
                            : `
                              bg-[#0b111e]
                            `
                        }

                        ${
                          today
                            ? `
                              relative
                              bg-blue-500/[0.06]
                            `
                            : ''
                        }
                      `}
                  >
                    {day && (
                      <>
                        {/* ===================
                              DAY NUMBER
                          =================== */}

                        <div
                          className="
                              flex
                              items-center
                              justify-between
                            "
                        >
                          <span
                            className={`
                                grid
                                h-7
                                min-w-7
                                place-items-center
                                rounded-lg
                                text-xs
                                font-bold

                                ${
                                  today
                                    ? `
                                      bg-blue-600
                                      text-white
                                      shadow-lg
                                      shadow-blue-600/20
                                    `
                                    : `
                                      text-slate-500
                                    `
                                }
                              `}
                          >
                            {day.getDate()}
                          </span>

                          {/* TASK COUNT */}

                          {dayTasks.length > 0 && (
                            <span
                              className="
                                  text-[9px]
                                  font-bold
                                  text-slate-600
                                "
                            >
                              {dayTasks.length}{' '}
                              {dayTasks.length === 1 ? 'task' : 'tasks'}
                            </span>
                          )}
                        </div>

                        {/* ===================
                              TASKS
                          =================== */}

                        <div
                          className="
                              mt-2
                              space-y-1.5
                            "
                        >
                          {dayTasks.slice(0, 3).map((task) => (
                            <div
                              key={task._id}
                              title={task.title}
                              className={`
                                      flex
                                      items-center
                                      gap-1.5
                                      truncate
                                      rounded-lg
                                      border
                                      px-2
                                      py-1.5
                                      text-[9px]
                                      font-bold
                                      transition-colors
                                      md:text-[10px]

                                      ${workspaceStyle(task.workspace)}

                                      ${
                                        task.completed
                                          ? `
                                            opacity-50
                                          `
                                          : ''
                                      }
                                    `}
                            >
                              {task.completed && (
                                <CheckCircle2 size={10} className="shrink-0" />
                              )}

                              <span
                                className={`
                                        truncate

                                        ${task.completed ? 'line-through' : ''}
                                      `}
                              >
                                {task.title}
                              </span>
                            </div>
                          ))}

                          {/* MORE TASKS */}

                          {dayTasks.length > 3 && (
                            <div
                              className="
                                  px-1
                                  pt-1
                                  text-[9px]
                                  font-bold
                                  text-slate-600
                                "
                            >
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ===================================
            LEGEND
        =================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-6
            gap-y-3
            border-t
            border-slate-800
            bg-[#0d1424]/60
            px-5
            py-4
            text-xs
          "
        >
          {/* PERSONAL */}

          <div
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <div
              className="
                grid
                h-6
                w-6
                place-items-center
                rounded-md
                bg-blue-500/10
                text-blue-400
              "
            >
              <UserRound size={13} />
            </div>
            Personal
          </div>

          {/* WORK */}

          <div
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <div
              className="
                grid
                h-6
                w-6
                place-items-center
                rounded-md
                bg-cyan-500/10
                text-cyan-400
              "
            >
              <BriefcaseBusiness size={13} />
            </div>
            Work
          </div>

          {/* BUSINESS */}

          <div
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <div
              className="
                grid
                h-6
                w-6
                place-items-center
                rounded-md
                bg-violet-500/10
                text-violet-400
              "
            >
              <Building2 size={13} />
            </div>
            Business
          </div>
        </div>
      </div>
    </>
  )
}
