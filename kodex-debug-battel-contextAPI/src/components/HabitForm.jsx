import { useForm } from "react-hook-form";
import useHabit, { HabitContext } from "../context/HabitContext";

const HabitForm = () => {
  const { addHabit, habits } = useHabit(HabitContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      habitName: "",
      dailyGoal: "",
      unit: "mins",
      startDate: new Date().toISOString().split("T")[0],
      category: "Mindset",
      motivation: "",
      priority: "Medium",
    },
  });

  const onCommit = (values) => {
    const payload = {
      ...values,
      id: crypto.randomUUID(),
      completed: false,
    };

    addHabit(payload);
    reset();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex flex-col p-6 overflow-hidden">
      <h3 className="font-bold text-slate-700 mb-4 shrink-0">Add Habit</h3>
      <div className="overflow-y-auto">
        <div className="w-full bg-white p-1">
          <form className="space-y-4" onSubmit={handleSubmit(onCommit)}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Habit Name</label>
              <input
                {...register("habitName", { required: true })}
                placeholder="e.g. Morning Exercise"
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-placeholder text-sm text-slate-800"
                type="text"
              />
              {errors.habitName && <p className="text-xs text-red-600 mt-0.5">Please enter a name</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Daily Goal</label>
                <input
                  {...register("dailyGoal", { required: true })}
                  placeholder="30"
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 outline-none text-sm"
                  type="number"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Unit</label>
                <select
                  {...register("unit")}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:border-indigo-500 outline-none text-sm text-slate-700"
                >
                  <option value="mins">Minutes</option>
                  <option value="pages">Pages</option>
                  <option value="reps">Reps</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Start Date</label>
                <input
                  {...register("startDate")}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 outline-none text-sm text-slate-700"
                  type="date"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Category</label>
                <select
                  defaultValue="Mindset"
                  {...register("category")}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:border-indigo-500 outline-none text-sm text-slate-700"
                >
                  <option value="Health">Health</option>
                  <option value="Focus">Focus</option>
                  <option value="Growth">Growth</option>
                  <option value="Mindset">Mindset</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Motivation</label>
              <textarea
                {...register("motivation")}
                rows="2"
                placeholder="Why is this important to you?"
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 outline-none transition-all resize-none text-sm text-slate-700"
              ></textarea>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Priority Level</label>
              <div className="flex justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("priority")}
                    className="w-4 h-4 text-indigo-600 border-slate-300"
                    type="radio"
                    value="Low"
                  />
                  <span className="text-sm text-slate-600">Low</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("priority")}
                    className="w-4 h-4 text-indigo-600 border-slate-300"
                    type="radio"
                    value="Medium"
                  />
                  <span className="text-sm text-slate-600">Medium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("priority")}
                    className="w-4 h-4 text-indigo-600 border-slate-300"
                    type="radio"
                    value="High"
                  />
                  <span className="text-sm text-slate-600">High</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors active:bg-indigo-800 mt-2"
            >
              Create Habit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HabitForm;
