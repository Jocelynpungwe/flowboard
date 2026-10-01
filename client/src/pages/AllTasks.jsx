import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { deleteTask, fetchTasks, toggleTask } from '../features/tasks/taskSlice'

import TaskModal from '../components/TaskModal'

import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  CheckSquare,
  UserRound,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Repeat2,
  Flag,
  ListTodo,
} from 'lucide-react'

export default function AllTasks() {
  const dispatch = useDispatch()

  const items = useSelector((state) => state.tasks.items)

  const [filter, setFilter] = useState('all')

  const [open, setOpen] = useState(false)

  /* =========================================
     LOAD TASKS
  ========================================= */

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  /* =========================================
     FILTER TASKS
  ========================================= */

  const list =
    filter === 'all' ? items : items.filter((task) => task.workspace === filter)

  /* =========================================
     TASK COUNTS
  ========================================= */

  const completedCount = list.filter((task) => task.completed).length

  const remainingCount = list.length - completedCount

  /* =========================================
     FILTERS
  ========================================= */

  const filters = [
    {
      value: 'all',
      label: 'All Tasks',
      icon: ListTodo,
    },
    {
      value: 'personal',
      label: 'Personal',
      icon: UserRound,
    },
    {
      value: 'work',
      label: 'Work',
      icon: BriefcaseBusiness,
    },
    {
      value: 'business',
      label: 'Business',
      icon: Building2,
    },
  ]

  /* =========================================
     WORKSPACE STYLES
  ========================================= */

  const workspaceStyle = (workspace) => {
    switch (workspace) {
      case 'personal':
        return {
          icon: UserRound,
          className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        }

      case 'work':
        return {
          icon: BriefcaseBusiness,
          className: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        }

      case 'business':
        return {
          icon: Building2,
          className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        }

      default:
        return {
          icon: CheckSquare,
          className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        }
    }
  }

  /* =========================================
     PRIORITY STYLES
  ========================================= */

  const priorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-rose-500/20 bg-rose-500/10 text-rose-400'

      case 'medium':
        return 'border-amber-500/20 bg-amber-500/10 text-amber-400'

      case 'low':
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'

      default:
        return 'border-slate-700 bg-slate-800 text-slate-400'
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
            All Tasks
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Everything you need to do, across every part of life.
          </p>
        </div>

        {/* ADD TASK */}

        <button
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
          Add task
        </button>
      </div>

      {/* =====================================
          TASK STATS
      ===================================== */}

      <div
        className="
          mt-7
          grid
          gap-4
          sm:grid-cols-3
        "
      >
        {/* TOTAL */}

        <div className="card p-4">
          <div className="flex items-center gap-3">
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
              <ListTodo size={19} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500">
                Total Tasks
              </div>

              <div className="text-xl font-black text-slate-100">
                {list.length}
              </div>
            </div>
          </div>
        </div>

        {/* REMAINING */}

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                border
                border-amber-500/20
                bg-amber-500/10
                text-amber-400
              "
            >
              <Circle size={19} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500">Remaining</div>

              <div className="text-xl font-black text-amber-400">
                {remainingCount}
              </div>
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                border
                border-emerald-500/20
                bg-emerald-500/10
                text-emerald-400
              "
            >
              <CheckCircle2 size={19} />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500">Completed</div>

              <div className="text-xl font-black text-emerald-400">
                {completedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          FILTERS
      ===================================== */}

      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-2
        "
      >
        {filters.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`
                flex
                items-center
                gap-2
                rounded-xl
                border
                px-4
                py-2.5
                text-sm
                font-bold
                transition-all
                duration-200

                ${
                  filter === value
                    ? `
                      border-blue-500
                      bg-blue-600
                      text-white
                      shadow-lg
                      shadow-blue-600/15
                    `
                    : `
                      border-slate-800
                      bg-[#111a2e]
                      text-slate-400
                      hover:border-blue-500/30
                      hover:text-blue-400
                    `
                }
              `}
          >
            <Icon size={16} />

            {label}
          </button>
        ))}
      </div>

      {/* =====================================
          TASK LIST
      ===================================== */}

      <div
        className="
          card
          mt-5
          overflow-hidden
        "
      >
        {/* LIST HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            px-5
            py-4
          "
        >
          <div>
            <h2 className="font-black text-slate-100">
              {filter === 'all' ? 'All tasks' : `${filter} tasks`}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {remainingCount} remaining · {completedCount} completed
            </p>
          </div>
        </div>

        {/* TASKS */}

        <div className="divide-y divide-slate-800/80">
          {list.map((task) => {
            const workspace = workspaceStyle(task.workspace)

            const WorkspaceIcon = workspace.icon

            return (
              <div
                key={task._id}
                className="
                  group
                  flex
                  items-start
                  gap-3
                  px-4
                  py-4
                  transition-colors
                  hover:bg-blue-500/[0.03]
                  md:items-center
                  md:px-5
                "
              >
                {/* =============================
                    COMPLETE BUTTON
                ============================= */}

                <button
                  type="button"
                  onClick={() => dispatch(toggleTask(task))}
                  className="
                    mt-0.5
                    shrink-0
                    transition-transform
                    hover:scale-110
                    md:mt-0
                  "
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 size={22} className="text-blue-400" />
                  ) : (
                    <Circle
                      size={22}
                      className="
                        text-slate-600
                        transition-colors
                        hover:text-blue-400
                      "
                    />
                  )}
                </button>

                {/* =============================
                    TASK CONTENT
                ============================= */}

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    {/* TITLE */}

                    <div
                      className={`
                        font-bold
                        transition-colors

                        ${
                          task.completed
                            ? `
                              text-slate-500
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

                    {/* PRIORITY */}

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1
                        rounded-lg
                        border
                        px-2
                        py-0.5
                        text-[10px]
                        font-bold
                        capitalize

                        ${priorityStyle(task.priority)}
                      `}
                    >
                      <Flag size={10} />

                      {task.priority || 'medium'}
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  {task.description && (
                    <p
                      className={`
                        mt-1
                        line-clamp-1
                        text-xs

                        ${task.completed ? 'text-slate-600' : 'text-slate-500'}
                      `}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* META INFORMATION */}

                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    {/* WORKSPACE */}

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        px-2
                        py-1
                        text-[10px]
                        font-bold
                        capitalize

                        ${workspace.className}
                      `}
                    >
                      <WorkspaceIcon size={11} />

                      {task.workspace}
                    </span>

                    {/* FREQUENCY */}

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-slate-800
                        bg-slate-900/50
                        px-2
                        py-1
                        text-[10px]
                        font-bold
                        capitalize
                        text-slate-500
                      "
                    >
                      <Repeat2 size={11} />

                      {task.frequency}
                    </span>

                    {/* DATE */}

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[10px]
                        font-semibold
                        text-slate-500
                      "
                    >
                      <CalendarDays size={11} />

                      {new Date(task.dueDate).toLocaleDateString('en-CA', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* =============================
                    DELETE
                ============================= */}

                <button
                  type="button"
                  onClick={() => dispatch(deleteTask(task._id))}
                  className="
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-lg
                    text-slate-600
                    opacity-100
                    transition-all
                    hover:bg-rose-500/10
                    hover:text-rose-400
                    md:opacity-0
                    md:group-hover:opacity-100
                  "
                  title="Delete task"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )
          })}

          {/* =================================
              EMPTY STATE
          ================================= */}

          {!list.length && (
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
                  mb-4
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  border
                  border-blue-500/10
                  bg-blue-500/5
                  text-blue-400
                "
              >
                <CheckSquare size={25} />
              </div>

              <h3 className="font-black text-slate-200">No tasks found</h3>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {filter === 'all'
                  ? 'You have no tasks yet. Create your first task to start organizing your day.'
                  : `You don't have any ${filter} tasks yet.`}
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
                Add task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          TASK MODAL
      ===================================== */}

      {open && (
        <TaskModal
          workspace={filter === 'all' ? 'personal' : filter}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
