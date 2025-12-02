"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Plus, Flame, Clock, TrendingUp } from "lucide-react";
import { WorkoutEntry } from "@/lib/types";

export function WorkoutsTab() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("calboost_workouts") || "[]");
    setWorkouts(stored);
  }, []);

  const addWorkout = (workout: Omit<WorkoutEntry, "id" | "date">) => {
    const newWorkout: WorkoutEntry = {
      ...workout,
      id: Date.now().toString(),
      date: new Date(),
    };

    const updated = [...workouts, newWorkout];
    setWorkouts(updated);
    localStorage.setItem("calboost_workouts", JSON.stringify(updated));
    setShowAddForm(false);
  };

  const todayWorkouts = workouts.filter(
    (w) => new Date(w.date).toDateString() === new Date().toDateString()
  );

  const totalCaloriesBurned = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalDuration = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
            Meus Treinos
          </h2>
          <p className="text-white/60 mt-1">Acompanhe sua atividade física</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#00BFFF]/20"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Flame}
          label="Calorias Queimadas"
          value={totalCaloriesBurned}
          unit="kcal"
          color="orange"
        />
        <StatCard
          icon={Clock}
          label="Tempo Total"
          value={totalDuration}
          unit="min"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Treinos Hoje"
          value={todayWorkouts.length}
          unit=""
          color="green"
        />
      </div>

      {/* Add Workout Form */}
      {showAddForm && (
        <AddWorkoutForm
          onAdd={addWorkout}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Workouts List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">Histórico de Treinos</h3>
        {workouts.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum treino registrado ainda.</p>
            <p className="text-sm mt-2">Adicione seu primeiro treino!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.slice().reverse().map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  color: "orange" | "blue" | "green";
}

function StatCard({ icon: Icon, label, value, unit, color }: StatCardProps) {
  const colors = {
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur-xl rounded-2xl p-6 border`}>
      <Icon className="w-6 h-6 mb-3" />
      <p className="text-3xl font-bold text-white">
        {value}
        {unit && <span className="text-lg text-white/60 ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-white/60 mt-1">{label}</p>
    </div>
  );
}

interface AddWorkoutFormProps {
  onAdd: (workout: Omit<WorkoutEntry, "id" | "date">) => void;
  onCancel: () => void;
}

function AddWorkoutForm({ onAdd, onCancel }: AddWorkoutFormProps) {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      type,
      duration: parseInt(duration),
      caloriesBurned: parseInt(calories),
      notes: notes || undefined,
    });
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold mb-4 text-white">Adicionar Treino</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Tipo de Treino
          </label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Ex: Musculação, Corrida, Yoga..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Duração (min)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Calorias (kcal)
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="300"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Observações (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Como foi o treino?"
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] hover:from-[#00BFFF]/90 hover:to-[#0080FF]/90 text-white font-semibold py-3 rounded-xl transition-all duration-300"
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-white/10"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

interface WorkoutCardProps {
  workout: WorkoutEntry;
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-[#00BFFF]" />
          </div>
          <div>
            <h4 className="text-white font-semibold">{workout.type}</h4>
            <p className="text-sm text-white/60 mt-1">
              {new Date(workout.date).toLocaleDateString("pt-BR")} às{" "}
              {new Date(workout.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {workout.notes && (
              <p className="text-sm text-white/70 mt-2">{workout.notes}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#00BFFF]">{workout.caloriesBurned} kcal</p>
          <p className="text-sm text-white/60">{workout.duration} min</p>
        </div>
      </div>
    </div>
  );
}
