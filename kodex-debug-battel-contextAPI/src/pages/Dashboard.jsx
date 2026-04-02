import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";

const Dashboard = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              Track Your Journey
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full px-3 py-2 bg-slate-100 text-slate-900 rounded-md font-medium text-sm">
            Dashboard
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Status
            </p>
            <p className="text-xs text-slate-600">
              You're on a 5-day streak. Keep it going!
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Goal: 75%
          </span>
        </header>

        <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden">
          <div className="col-span-2 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-700">Active Habits</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <HabitList />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 flex flex-col p-6 overflow-hidden">
            <h3 className="font-bold text-slate-700 mb-4 shrink-0">
              Add Habit
            </h3>

            <div className="overflow-y-auto">
              <HabitForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;