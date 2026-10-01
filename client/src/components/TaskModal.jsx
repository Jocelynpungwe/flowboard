import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { addTask } from '../features/tasks/taskSlice'

import {
  X,
  CheckSquare,
  UserRound,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Repeat2,
  Flag,
  FileText,
  Loader2,
  Plus,
} from 'lucide-react'

export default function TaskModal({ workspace = 'personal', onClose }) {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [f, setF] = useState({
    workspace,
    title: '',
    description: '',
    frequency: 'once',
    priority: 'medium',
    dueDate: new Date().toISOString().slice(0, 10),
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
     SUBMIT TASK
  ========================================= */

  const submit = async (e) => {
    e.preventDefault()

    if (!f.title.trim()) return

    try {
      setLoading(true)

      await dispatch(
        addTask({
          ...f,
          title: f.title.trim(),
          description: f.description.trim(),
        }),
      ).unwrap()

      onClose()
    } catch (error) {
      console.error('Unable to add task:', error)
    } finally {
      setLoading(false)
    }
  }

  /* =========================================
     WORKSPACE OPTIONS
  ========================================= */

  const workspaces = [
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
     FREQUENCY OPTIONS
  ========================================= */

  const frequencies = [
    {
      value: 'once',
      label: 'One time',
    },
    {
      value: 'daily',
      label: 'Daily',
    },
    {
      value: 'weekly',
      label: 'Weekly',
    },
    {
      value: 'monthly',
      label: 'Monthly',
    },
  ]

  return (
    /* =========================================
       MODAL OVERLAY
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
          max-w-xl
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
          <div className="flex items-center gap-3">
            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                bg-blue-500/10
                text-blue-400
                ring-1
                ring-blue-500/20
              "
            >
              <CheckSquare size={20} />
            </div>

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
                Task manager
              </p>

              <h2
                className="
                  mt-1
                  text-xl
                  font-black
                  text-slate-100
                "
              >
                Add new task
              </h2>
            </div>
          </div>

          {/* CLOSE BUTTON */}

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
              hover:text-white
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="p-6">
          {/* ===================================
              WORKSPACE
          =================================== */}

          <div className="mb-6">
            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                text-slate-400
              "
            >
              Workspace
            </label>

            <div
              className="
                grid
                grid-cols-3
                gap-2
                rounded-xl
                bg-[#0d1424]
                p-1.5
              "
            >
              {workspaces.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('workspace', value)}
                  className={`
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      px-2
                      py-2.5
                      text-xs
                      font-bold
                      transition-all
                      sm:flex-row
                      sm:text-sm

                      ${
                        f.workspace === value
                          ? `
                            bg-blue-600
                            text-white
                            shadow-lg
                            shadow-blue-600/15
                          `
                          : `
                            text-slate-500
                            hover:bg-slate-800/70
                            hover:text-slate-300
                          `
                      }
                    `}
                >
                  <Icon size={16} />

                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* =================================
                TASK TITLE
            ================================= */}

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
                Task title
              </label>

              <div className="relative">
                <CheckSquare
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
                  placeholder="What do you need to do?"
                  value={f.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
            </div>

            {/* =================================
                FREQUENCY
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
                Frequency
              </label>

              <div className="relative">
                <Repeat2
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
                  className="input pl-10 capitalize"
                  value={f.frequency}
                  onChange={(e) => updateField('frequency', e.target.value)}
                >
                  {frequencies.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* =================================
                DUE DATE
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
                Due date
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
                  value={f.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                />
              </div>
            </div>

            {/* =================================
                PRIORITY
            ================================= */}

            <div className="sm:col-span-2">
              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  text-slate-400
                "
              >
                <Flag size={14} />
                Priority
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* LOW */}

                <button
                  type="button"
                  onClick={() => updateField('priority', 'low')}
                  className={`
                    rounded-xl
                    border
                    px-3
                    py-2.5
                    text-sm
                    font-bold
                    transition-all

                    ${
                      f.priority === 'low'
                        ? `
                          border-emerald-500/30
                          bg-emerald-500/10
                          text-emerald-400
                        `
                        : `
                          border-slate-800
                          bg-[#0d1424]
                          text-slate-500
                          hover:border-slate-700
                        `
                    }
                  `}
                >
                  Low
                </button>

                {/* MEDIUM */}

                <button
                  type="button"
                  onClick={() => updateField('priority', 'medium')}
                  className={`
                    rounded-xl
                    border
                    px-3
                    py-2.5
                    text-sm
                    font-bold
                    transition-all

                    ${
                      f.priority === 'medium'
                        ? `
                          border-amber-500/30
                          bg-amber-500/10
                          text-amber-400
                        `
                        : `
                          border-slate-800
                          bg-[#0d1424]
                          text-slate-500
                          hover:border-slate-700
                        `
                    }
                  `}
                >
                  Medium
                </button>

                {/* HIGH */}

                <button
                  type="button"
                  onClick={() => updateField('priority', 'high')}
                  className={`
                    rounded-xl
                    border
                    px-3
                    py-2.5
                    text-sm
                    font-bold
                    transition-all

                    ${
                      f.priority === 'high'
                        ? `
                          border-rose-500/30
                          bg-rose-500/10
                          text-rose-400
                        `
                        : `
                          border-slate-800
                          bg-[#0d1424]
                          text-slate-500
                          hover:border-slate-700
                        `
                    }
                  `}
                >
                  High
                </button>
              </div>
            </div>

            {/* =================================
                DESCRIPTION
            ================================= */}

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
                  rows="4"
                  className="
                    input
                    resize-none
                    pl-10
                  "
                  placeholder="Add details about this task..."
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
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={17} />
                Add task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
