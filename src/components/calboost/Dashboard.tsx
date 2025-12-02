"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Flame, Target, Droplet, Trash2 } from "lucide-react";
import { UserProfile, MealEntry } from "@/lib/types";

interface DashboardProps {
  userProfile: UserProfile;
}

export function Dashboard({ userProfile }: DashboardProps) {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const loadMeals = () => {
    const storedMeals = JSON.parse(localStorage.getItem("calboost_meals") || "[]");
    const today = new Date().toDateString();
    const todayMeals = storedMeals.filter(
      (meal: MealEntry) => new Date(meal.date).toDateString() === today
    );

    setMeals(todayMeals);

    const stats = todayMeals.reduce(
      (acc: any, meal: MealEntry) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    setTodayStats(stats);
  };

  useEffect(() => {
    loadMeals();

    // Load water intake
    const today = new Date().toDateString();
    const storedWater = localStorage.getItem("calboost_water_" + today);
    if (storedWater) {
      setWaterIntake(Number(storedWater));
    }
  }, []);

  const handleDeleteMeal = (mealId: string) => {
    const storedMeals = JSON.parse(localStorage.getItem("calboost_meals") || "[]");
    const updatedMeals = storedMeals.filter((meal: MealEntry) => meal.id !== mealId);
    localStorage.setItem("calboost_meals", JSON.stringify(updatedMeals));
    loadMeals();
  };

  const calorieProgress = (todayStats.calories / userProfile.dailyCalorieGoal) * 100;
  const remaining = userProfile.dailyCalorieGoal - todayStats.calories;
  const waterGoal = 2000; // 2 litros = 2000ml
  const waterProgress = (waterIntake / waterGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
          Dashboard de Hoje
        </h2>
        <p className="text-white/60">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Main Calorie Card */}
      <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#0080FF]/10 backdrop-blur-xl rounded-3xl p-8 border border-[#00BFFF]/30 shadow-2xl shadow-[#00BFFF]/10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
            <Flame className="w-5 h-5 text-[#00BFFF]" />
            <span className="text-sm font-medium text-white">Calorias Consumidas</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-6xl sm:text-7xl font-bold text-white">
              {todayStats.calories}
            </h3>
            <p className="text-xl text-white/60">
              de {userProfile.dailyCalorieGoal} kcal
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-white/60">{calorieProgress.toFixed(0)}%</span>
              <span className="text-sm text-white/60">
                {remaining > 0 ? `${remaining} kcal restantes` : "Meta atingida! 🎉"}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {remaining <= 0 ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Meta Alcançada!</span>
            </div>
          ) : remaining < 300 ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Quase lá!</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MacroStatCard
          label="Proteína"
          value={todayStats.protein}
          unit="g"
          icon={TrendingUp}
          color="blue"
        />
        <MacroStatCard
          label="Carboidratos"
          value={todayStats.carbs}
          unit="g"
          icon={Flame}
          color="green"
        />
        <MacroStatCard
          label="Gorduras"
          value={todayStats.fats}
          unit="g"
          icon={Droplet}
          color="orange"
        />
      </div>

      {/* Water Intake Card */}
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Água Consumida</h3>
              <p className="text-sm text-white/60">Meta diária: {waterGoal}ml</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{waterIntake}</p>
            <p className="text-sm text-white/60">ml</p>
          </div>
        </div>

        {/* Water Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(waterProgress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">{waterProgress.toFixed(0)}%</span>
            <span className="text-sm text-white/60">
              {waterGoal - waterIntake > 0
                ? `${waterGoal - waterIntake}ml restantes`
                : "Meta atingida! 💧"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">Refeições de Hoje</h3>
        {meals.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <p>Nenhuma refeição registrada ainda.</p>
            <p className="text-sm mt-2">Use o scanner para adicionar sua primeira refeição!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface MacroStatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: "blue" | "green" | "orange";
}

function MacroStatCard({ label, value, unit, icon: Icon, color }: MacroStatCardProps) {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  };

  const iconColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur-xl rounded-2xl p-6 border`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
      </div>
      <p className="text-3xl font-bold text-white">
        {value}
        <span className="text-lg text-white/60 ml-1">{unit}</span>
      </p>
      <p className="text-sm text-white/60 mt-1">{label}</p>
    </div>
  );
}

interface MealCardProps {
  meal: MealEntry;
  onDelete: (mealId: string) => void;
}

function MealCard({ meal, onDelete }: MealCardProps) {
  const mealTypeLabels = {
    breakfast: "Pequeno-Almoço",
    lunch: "Almoço",
    dinner: "Jantar",
    snack: "Lanche",
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {meal.imageUrl && (
          <img
            src={meal.imageUrl}
            alt="Meal"
            className="w-20 h-20 rounded-lg object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-1 bg-[#00BFFF]/20 border border-[#00BFFF]/30 rounded-full text-[#00BFFF]">
              {mealTypeLabels[meal.mealType]}
            </span>
            <span className="text-xs text-white/60">
              {new Date(meal.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-white font-medium truncate">{meal.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
            <span>{meal.calories} kcal</span>
            <span>P: {meal.protein}g</span>
            <span>C: {meal.carbs}g</span>
            <span>G: {meal.fats}g</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(meal.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-500/20 rounded-lg"
          title="Remover refeição"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
