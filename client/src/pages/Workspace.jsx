import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { deleteTask, fetchTasks, toggleTask } from '../features/tasks/taskSlice'

import TaskModal from '../components/TaskModal'

import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  UserRound,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarClock,
  CalendarRange,
  Repeat2,
  ListTodo,
  Flag,
  Clock3,
  Loader2,
  TrendingUp,
} from 'lucide-react'

export default function Workspace({ fixed }) {
  const params = useParams()

  const workspace = fixed || params.workspace || 'personal'

  const dispatch = useDispatch()

  const all = useSelector((state) => state.tasks.items || [])

  const [open, setOpen] = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  /* =========================================
     LOAD TASKS
  ========================================= */

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  /* =========================================
     WORKSPACE TASKS
  ========================================= */

  const items = useMemo(
    () => all.filter((task) => task.workspace === workspace),
    [all, workspace],
  )

  /* =========================================
     TASK STATISTICS
  ========================================= */

  const completedCount = items.filter((task) => task.completed).length

  const remainingCount = items.length - completedCount

  const highPriorityCount = items.filter(
    (task) => task.priority === 'high' && !task.completed,
  ).length

  const progress =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  /* =========================================
     WORKSPACE CONFIG
  ========================================= */

  const workspaceConfig = {
    personal: {
      label: 'Personal',
      icon: UserRound,

      iconClass: 'border-blue-500/20 bg-blue-500/10 text-blue-400',

      textClass: 'text-blue-400',

      progressClass: 'bg-blue-500',
    },

    work: {
      label: 'Work',
      icon: BriefcaseBusiness,

      iconClass: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400',

      textClass: 'text-cyan-400',

      progressClass: 'bg-cyan-500',
    },

    business: {
      label: 'Business',
      icon: Building2,

      iconClass: 'border-violet-500/20 bg-violet-500/10 text-violet-400',

      textClass: 'text-violet-400',

      progressClass: 'bg-violet-500',
    },
  }

  const config = workspaceConfig[workspace] || workspaceConfig.personal

  const WorkspaceIcon = config.icon

  /* =========================================
     GROUPS
  ========================================= */

  const groups = [
    {
      value: 'daily',
      label: 'Daily',
      description: 'Everyday responsibilities',
      icon: Repeat2,
    },

    {
      value: 'weekly',
      label: 'Weekly',
      description: 'Tasks for this week',
      icon: CalendarRange,
    },

    {
      value: 'monthly',
      label: 'Monthly',
      description: 'Longer-term priorities',
      icon: CalendarDays,
    },

    {
      value: 'once',
      label: 'One time',
      description: 'Single tasks & deadlines',
      icon: CalendarClock,
    },
  ]

  /* =========================================
     PRIORITY STYLE
  ========================================= */

  const priorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return `
          border-rose-500/20
          bg-rose-500/10
          text-rose-400
        `

      case 'medium':
        return `
          border-amber-500/20
          bg-amber-500/10
          text-amber-400
        `

      case 'low':
        return `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-400
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
     DATE STATUS
  ========================================= */

  const getDateStatus = (dueDate, completed) => {
    if (!dueDate) {
      return {
        label: 'No date',
        className: 'text-slate-500',
      }
    }

    if (completed) {
      return {
        label: new Date(dueDate).toLocaleDateString('en-CA', {
          month: 'short',
          day: 'numeric',
        }),

        className: 'text-slate-500',
      }
    }

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const due = new Date(dueDate)

    due.setHours(0, 0, 0, 0)

    const difference = Math.round((due - today) / 86400000)

    if (difference < 0) {
      return {
        label: 'Overdue',
        className: 'text-rose-400',
      }
    }

    if (difference === 0) {
      return {
        label: 'Today',
        className: 'text-amber-400',
      }
    }

    if (difference === 1) {
      return {
        label: 'Tomorrow',
        className: 'text-blue-400',
      }
    }

    return {
      label: due.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
      }),

      className: 'text-slate-500',
    }
  }

  /* =========================================
     DELETE TASK
  ========================================= */

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`)

    if (!confirmed) return

    try {
      setDeletingId(task._id)

      await dispatch(deleteTask(task._id)).unwrap()
    } catch (error) {
      console.error('Unable to delete task:', error)
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
          <div
            className={`
              text-xs
              font-black
              uppercase
              tracking-[.2em]

              ${config.textClass}
            `}
          >
            Workspace
          </div>

          <div
            className="
              mt-2
              flex
              items-center
              gap-3
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

                ${config.iconClass}
              `}
            >
              <WorkspaceIcon size={21} />
            </div>

            <h1
              className="
                text-3xl
                font-black
                capitalize
                tracking-tight
                text-slate-100
                md:text-4xl
              "
            >
              {workspace}
            </h1>
          </div>

          <p
            className="
              mt-3
              text-sm
              text-slate-500
            "
          >
            Plan, prioritize and complete your {workspace} responsibilities.
          </p>
        </div>

        {/* ADD TASK */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            btn
            btn-primary
            flex
            items-center
            gap-2
          "
        >
          <Plus size={18} />
          Add task
        </button>
      </div>

      {/* =====================================
          WORKSPACE STATISTICS
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
        {/* TOTAL */}

        <div className="card p-5">
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
                h-11
                w-11
                place-items-center
                rounded-xl
                border

                ${config.iconClass}
              `}
            >
              <ListTodo size={20} />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-slate-500
                "
              >
                Total Tasks
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-slate-100
                "
              >
                {items.length}
              </p>
            </div>
          </div>
        </div>

        {/* REMAINING */}

        <div className="card p-5">
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
                h-11
                w-11
                place-items-center
                rounded-xl
                border
                border-amber-500/20
                bg-amber-500/10
                text-amber-400
              "
            >
              <Clock3 size={20} />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-slate-500
                "
              >
                Remaining
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-amber-400
                "
              >
                {remainingCount}
              </p>
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="card p-5">
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
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-slate-500
                "
              >
                Completed
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-emerald-400
                "
              >
                {completedCount}
              </p>
            </div>
          </div>
        </div>

        {/* HIGH PRIORITY */}

        <div className="card p-5">
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
              <Flag size={20} />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-slate-500
                "
              >
                High Priority
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-rose-400
                "
              >
                {highPriorityCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          PROGRESS
      ===================================== */}

      <div
        className="
          card
          mt-5
          p-5
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <TrendingUp size={18} className={config.textClass} />

            <div>
              <h2
                className="
                  text-sm
                  font-black
                  text-slate-200
                "
              >
                Workspace progress
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                "
              >
                {completedCount} of {items.length} tasks completed
              </p>
            </div>
          </div>

          <div
            className={`
              text-lg
              font-black

              ${config.textClass}
            `}
          >
            {progress}%
          </div>
        </div>

        {/* PROGRESS BAR */}

        <div
          className="
            mt-4
            h-2
            overflow-hidden
            rounded-full
            bg-slate-800
          "
        >
          <div
            className={`
              h-full
              rounded-full
              transition-all
              duration-500

              ${config.progressClass}
            `}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* =====================================
          TASK GROUPS
      ===================================== */}

      <div
        className="
          mt-7
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {groups.map((group) => {
          const GroupIcon = group.icon

          const groupItems = items.filter(
            (task) => task.frequency === group.value,
          )

          return (
            <section
              className="
                  card
                  overflow-hidden
                "
              key={group.value}
            >
              {/* ===========================
                    GROUP HEADER
                =========================== */}

              <div
                className="
                    border-b
                    border-slate-800
                    p-5
                  "
              >
                <div
                  className="
                      flex
                      items-start
                      justify-between
                      gap-3
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
                      className={`
                          grid
                          h-9
                          w-9
                          place-items-center
                          rounded-lg
                          border

                          ${config.iconClass}
                        `}
                    >
                      <GroupIcon size={17} />
                    </div>

                    <div>
                      <h2
                        className="
                            text-sm
                            font-black
                            text-slate-200
                          "
                      >
                        {group.label}
                      </h2>

                      <p
                        className="
                            mt-0.5
                            text-[10px]
                            text-slate-600
                          "
                      >
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* COUNT */}

                  <span
                    className={`
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-[10px]
                        font-black

                        ${config.iconClass}
                      `}
                  >
                    {groupItems.length}
                  </span>
                </div>
              </div>

              {/* ===========================
                    TASKS
                =========================== */}

              <div
                className="
                    space-y-2.5
                    p-4
                  "
              >
                {groupItems.map((task) => {
                  const dateStatus = getDateStatus(task.dueDate, task.completed)

                  const isDeleting = deletingId === task._id

                  return (
                    <div
                      key={task._id}
                      className={`
                            group/task
                            rounded-xl
                            border
                            p-3
                            transition-all

                            ${
                              task.completed
                                ? `
                                  border-slate-800/60
                                  bg-slate-900/20
                                `
                                : `
                                  border-slate-800
                                  bg-[#0d1424]
                                  hover:border-blue-500/20
                                  hover:bg-blue-500/[0.03]
                                `
                            }
                          `}
                    >
                      <div
                        className="
                              flex
                              items-start
                              gap-2.5
                            "
                      >
                        {/* COMPLETE */}

                        <button
                          type="button"
                          onClick={() => dispatch(toggleTask(task))}
                          className="
                                mt-0.5
                                shrink-0
                                transition-transform
                                hover:scale-110
                              "
                        >
                          {task.completed ? (
                            <CheckCircle2
                              size={19}
                              className="text-emerald-400"
                            />
                          ) : (
                            <Circle
                              size={19}
                              className="
                                    text-slate-600
                                    transition
                                    hover:text-blue-400
                                  "
                            />
                          )}
                        </button>

                        {/* CONTENT */}

                        <div
                          className="
                                min-w-0
                                flex-1
                              "
                        >
                          <div
                            className={`
                                  text-sm
                                  font-bold

                                  ${
                                    task.completed
                                      ? `
                                        text-slate-600
                                        line-through
                                      `
                                      : `
                                        text-slate-200
                                      `
                                  }
                                `}
                          >
                            {task.title}
                          </div>

                          {/* DESCRIPTION */}

                          {task.description && (
                            <p
                              className={`
                                    mt-1
                                    line-clamp-2
                                    text-[11px]
                                    leading-4

                                    ${
                                      task.completed
                                        ? 'text-slate-700'
                                        : 'text-slate-500'
                                    }
                                  `}
                            >
                              {task.description}
                            </p>
                          )}

                          {/* META */}

                          <div
                            className="
                                  mt-2.5
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-1.5
                                "
                          >
                            {/* PRIORITY */}

                            <span
                              className={`
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-md
                                    border
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    font-bold
                                    capitalize

                                    ${priorityStyle(task.priority)}
                                  `}
                            >
                              <Flag size={9} />

                              {task.priority || 'medium'}
                            </span>

                            {/* DATE */}

                            <span
                              className={`
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-[9px]
                                    font-bold

                                    ${dateStatus.className}
                                  `}
                            >
                              <CalendarDays size={10} />

                              {dateStatus.label}
                            </span>
                          </div>
                        </div>

                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(task)}
                          className="
                                grid
                                h-7
                                w-7
                                shrink-0
                                place-items-center
                                rounded-md
                                text-slate-700
                                opacity-100
                                transition
                                hover:bg-rose-500/10
                                hover:text-rose-400
                                disabled:opacity-50
                                md:opacity-0
                                md:group-hover/task:opacity-100
                              "
                        >
                          {isDeleting ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* =========================
                      EMPTY GROUP
                  ========================= */}

                {!groupItems.length && (
                  <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-10
                        text-center
                      "
                  >
                    <div
                      className="
                          grid
                          h-10
                          w-10
                          place-items-center
                          rounded-xl
                          bg-slate-800/50
                          text-slate-600
                        "
                    >
                      <GroupIcon size={17} />
                    </div>

                    <p
                      className="
                          mt-3
                          text-xs
                          font-semibold
                          text-slate-600
                        "
                    >
                      No {group.label.toLowerCase()} tasks
                    </p>

                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className={`
                          mt-3
                          text-[10px]
                          font-bold

                          ${config.textClass}
                        `}
                    >
                      + Add task
                    </button>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* =====================================
          TASK MODAL
      ===================================== */}

      {open && (
        <TaskModal workspace={workspace} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
