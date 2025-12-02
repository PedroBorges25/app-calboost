"use client";

import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Target, Weight } from "lucide-react";
import { UserProfile, MealEntry } from "@/lib/types";
import { WeightProgress } from "./WeightTracker";

interface WeeklyPlannerProps {
  userProfile: UserProfile;
}

interface WeightEntry {
  date: string;
  weight: number;
}

export function WeeklyPlanner({ userProfile }: WeeklyPlannerProps) {
  const [weekData, setWeekData] = useState<{ date: Date; calories: number }[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

  useEffect(() => {
    const meals: MealEntry[] = JSON.parse(localStorage.getItem("calboost_meals") || "[]");
    
    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const data = days.map((date) => {
      const dayMeals = meals.filter((meal) => {
        const mealDate = new Date(meal.date);
        return mealDate.toDateString() === date.toDateString();
      });

      const calories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      return { date, calories };
    });

    setWeekData(data);

    // Carregar registros de peso
    const storedWeights = localStorage.getItem("calboost_weights");
    if (storedWeights) {
      setWeightEntries(JSON.parse(storedWeights));
    }
  }, []);

  const handleDeleteWeight = (dateToDelete: string) => {
    const updatedWeights = weightEntries.filter((entry) => entry.date !== dateToDelete);
    setWeightEntries(updatedWeights);
    localStorage.setItem("calboost_weights", JSON.stringify(updatedWeights));
  };

  const weekAverage = weekData.reduce((sum, day) => sum + day.calories, 0) / 7;
  const maxCalories = Math.max(...weekData.map((d) => d.calories), userProfile.dailyCalorieGoal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
          Evolução
        </h2>
        <p className="text-white/60">Acompanhe seu progresso</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#0080FF]/10 backdrop-blur-xl rounded-2xl p-6 border border-[#00BFFF]/30">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#00BFFF]" />
            <span className="text-sm font-medium text-white/80">Média Semanal</span>
          </div>
          <p className="text-4xl font-bold text-white">
            {Math.round(weekAverage)}
            <span className="text-lg text-white/60 ml-2">kcal/dia</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-green-400" />
            <span className="text-sm font-medium text-white/80">Meta Diária</span>
          </div>
          <p className="text-4xl font-bold text-white">
            {userProfile.dailyCalorieGoal}
            <span className="text-lg text-white/60 ml-2">kcal</span>
          </p>
        </div>
      </div>

      {/* Seção de Peso */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Weight className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Peso</h3>
        </div>
        <WeightProgress entries={weightEntries} onDelete={handleDeleteWeight} />
      </div>

      {/* Weekly Chart */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#00BFFF]" />
          Consumo Semanal
        </h3>

        <div className="space-y-4">
          {weekData.map((day, index) => {
            const percentage = (day.calories / maxCalories) * 100;
            const isToday = day.date.toDateString() === new Date().toDateString();
            const metGoal = day.calories >= userProfile.dailyCalorieGoal * 0.9 && 
                           day.calories <= userProfile.dailyCalorieGoal * 1.1;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${isToday ? "text-[#00BFFF]" : "text-white/80"}`}>
                    {day.date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })}
                    {isToday && " (Hoje)"}
                  </span>
                  <span className="text-white/60">{day.calories} kcal</span>
                </div>

                <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                  {/* Goal Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
                    style={{
                      left: `${(userProfile.dailyCalorieGoal / maxCalories) * 100}%`,
                    }}
                  />

                  {/* Progress Bar */}
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${
                      metGoal
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : day.calories > userProfile.dailyCalorieGoal
                        ? "bg-gradient-to-r from-orange-500 to-orange-600"
                        : "bg-gradient-to-r from-[#00BFFF] to-[#0080FF]"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF]" />
            <span className="text-white/60">Abaixo da meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
            <span className="text-white/60">Na meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
            <span className="text-white/60">Acima da meta</span>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-3">💡 Dica da Semana</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          {weekAverage < userProfile.dailyCalorieGoal * 0.8
            ? "Você está consumindo menos calorias que o recomendado. Considere adicionar lanches saudáveis entre as refeições."
            : weekAverage > userProfile.dailyCalorieGoal * 1.2
            ? "Seu consumo está acima da meta. Tente reduzir porções ou escolher opções mais leves."
            : "Parabéns! Você está mantendo um consumo equilibrado de calorias. Continue assim! 🎉"}
        </p>
      </div>
    </div>
  );
}
