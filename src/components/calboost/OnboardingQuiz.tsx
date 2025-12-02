"use client";

import { useState } from "react";
import { ChevronRight, User, Target, Activity, TrendingUp } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface OnboardingQuizProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    goal: "maintain" as UserProfile["goal"],
    activityLevel: "moderate" as UserProfile["activityLevel"],
  });

  const calculateDailyCalories = (): number => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    // Harris-Benedict Formula (simplified)
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let tdee = bmr * activityMultipliers[formData.activityLevel];

    // Goal adjustment
    if (formData.goal === "lose") tdee -= 500;
    if (formData.goal === "gain") tdee += 500;

    return Math.round(tdee);
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      goal: formData.goal,
      activityLevel: formData.activityLevel,
      dailyCalorieGoal: calculateDailyCalories(),
    };

    onComplete(profile);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.length > 0;
      case 2:
        return formData.age && formData.weight && formData.height;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
              CalBoost
            </h1>
          </div>
          <p className="text-white/60">Vamos personalizar sua experiência</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Passo {step} de 4</span>
            <span className="text-sm text-[#00BFFF]">{(step / 4) * 100}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <User className="w-12 h-12 text-[#00BFFF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Como você se chama?</h2>
                <p className="text-white/60">Vamos começar nos conhecendo</p>
              </div>

              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-lg placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Activity className="w-12 h-12 text-[#00BFFF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Informações Básicas</h2>
                <p className="text-white/60">Para calcular suas necessidades calóricas</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="70"
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="170"
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Target className="w-12 h-12 text-[#00BFFF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Qual é seu objetivo?</h2>
                <p className="text-white/60">Isso ajudará a definir sua meta calórica</p>
              </div>

              <div className="space-y-3">
                <GoalOption
                  value="lose"
                  label="Perder Peso"
                  description="Déficit calórico de 500 kcal/dia"
                  selected={formData.goal === "lose"}
                  onClick={() => setFormData({ ...formData, goal: "lose" })}
                />
                <GoalOption
                  value="maintain"
                  label="Manter Peso"
                  description="Manutenção do peso atual"
                  selected={formData.goal === "maintain"}
                  onClick={() => setFormData({ ...formData, goal: "maintain" })}
                />
                <GoalOption
                  value="gain"
                  label="Ganhar Peso"
                  description="Superávit calórico de 500 kcal/dia"
                  selected={formData.goal === "gain"}
                  onClick={() => setFormData({ ...formData, goal: "gain" })}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Activity className="w-12 h-12 text-[#00BFFF] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Nível de Atividade</h2>
                <p className="text-white/60">Com que frequência você se exercita?</p>
              </div>

              <div className="space-y-3">
                <ActivityOption
                  value="sedentary"
                  label="Sedentário"
                  description="Pouco ou nenhum exercício"
                  selected={formData.activityLevel === "sedentary"}
                  onClick={() => setFormData({ ...formData, activityLevel: "sedentary" })}
                />
                <ActivityOption
                  value="light"
                  label="Levemente Ativo"
                  description="Exercício leve 1-3 dias/semana"
                  selected={formData.activityLevel === "light"}
                  onClick={() => setFormData({ ...formData, activityLevel: "light" })}
                />
                <ActivityOption
                  value="moderate"
                  label="Moderadamente Ativo"
                  description="Exercício moderado 3-5 dias/semana"
                  selected={formData.activityLevel === "moderate"}
                  onClick={() => setFormData({ ...formData, activityLevel: "moderate" })}
                />
                <ActivityOption
                  value="active"
                  label="Muito Ativo"
                  description="Exercício intenso 6-7 dias/semana"
                  selected={formData.activityLevel === "active"}
                  onClick={() => setFormData({ ...formData, activityLevel: "active" })}
                />
                <ActivityOption
                  value="very_active"
                  label="Extremamente Ativo"
                  description="Exercício muito intenso diariamente"
                  selected={formData.activityLevel === "very_active"}
                  onClick={() => setFormData({ ...formData, activityLevel: "very_active" })}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10"
              >
                Voltar
              </button>
            )}

            <button
              onClick={() => {
                if (step === 4) {
                  handleSubmit();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={!isStepValid()}
              className="flex-1 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] hover:from-[#00BFFF]/90 hover:to-[#0080FF]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFFF]/20"
            >
              {step === 4 ? "Começar" : "Próximo"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OptionProps {
  value: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function GoalOption({ label, description, selected, onClick }: OptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
        selected
          ? "bg-[#00BFFF]/20 border-[#00BFFF] shadow-lg shadow-[#00BFFF]/20"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <p className="text-white font-semibold">{label}</p>
      <p className="text-sm text-white/60 mt-1">{description}</p>
    </button>
  );
}

function ActivityOption({ label, description, selected, onClick }: OptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
        selected
          ? "bg-[#00BFFF]/20 border-[#00BFFF] shadow-lg shadow-[#00BFFF]/20"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <p className="text-white font-semibold">{label}</p>
      <p className="text-sm text-white/60 mt-1">{description}</p>
    </button>
  );
}
