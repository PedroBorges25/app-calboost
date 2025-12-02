"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp, Dumbbell, Zap, Award, MoreHorizontal, Search, Droplet, Weight, User, ChevronRight } from "lucide-react";
import { MealScanner } from "@/components/calboost/MealScanner";
import { Dashboard } from "@/components/calboost/Dashboard";
import { WorkoutsTab } from "@/components/calboost/WorkoutsTab";
import { WeeklyPlanner } from "@/components/calboost/WeeklyPlanner";
import { OnboardingQuiz } from "@/components/calboost/OnboardingQuiz";
import { CommunityFeed } from "@/components/calboost/CommunityFeed";
import { WaterTracker } from "@/components/calboost/WaterTracker";
import { WeightTracker } from "@/components/calboost/WeightTracker";
import { ProfileTab } from "@/components/calboost/ProfileTab";
import { UserProfile } from "@/lib/types";

type Tab = "scan" | "dashboard" | "workouts" | "planner" | "more" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("scan");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showWaterTracker, setShowWaterTracker] = useState(false);
  const [showWeightTracker, setShowWeightTracker] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const profile = localStorage.getItem("calboost_profile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("calboost_profile", JSON.stringify(profile));
    setShowOnboarding(false);
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (userProfile) {
      const newProfile = { ...userProfile, ...updatedProfile };
      setUserProfile(newProfile);
      localStorage.setItem("calboost_profile", JSON.stringify(newProfile));
    }
  };

  const handlePlusClick = () => {
    setShowQuickActions(!showQuickActions);
  };

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    if (action === "food") {
      setActiveTab("scan");
    } else if (action === "water") {
      setShowWaterTracker(true);
    } else if (action === "weight") {
      setShowWeightTracker(true);
    }
  };

  const handleWaterSave = (amount: number) => {
    const today = new Date().toDateString();
    const currentWater = Number(localStorage.getItem("calboost_water_" + today) || "0");
    const newTotal = currentWater + amount;
    localStorage.setItem("calboost_water_" + today, newTotal.toString());
    
    // Refresh dashboard if it's active
    if (activeTab === "dashboard") {
      window.location.reload();
    }
  };

  const handleWeightSave = (weight: number) => {
    const today = new Date().toISOString();
    const weights = JSON.parse(localStorage.getItem("calboost_weights") || "[]");
    
    // Adicionar novo registro
    weights.push({ date: today, weight });
    localStorage.setItem("calboost_weights", JSON.stringify(weights));
    
    // Refresh planner if it's active
    if (activeTab === "planner") {
      window.location.reload();
    }
  };

  if (showOnboarding) {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
                CalBoost
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white/60">Olá, {userProfile?.name}</p>
                <p className="text-xs text-[#00BFFF]">
                  Meta: {userProfile?.dailyCalorieGoal} kcal/dia
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {activeTab === "scan" && <MealScanner />}
        {activeTab === "dashboard" && <Dashboard userProfile={userProfile!} />}
        {activeTab === "workouts" && <WorkoutsTab />}
        {activeTab === "planner" && <WeeklyPlanner userProfile={userProfile!} />}
        {activeTab === "profile" && (
          <ProfileTab 
            userProfile={userProfile!} 
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        {activeTab === "more" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Mais</h2>
            
            {/* Menu Options */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setActiveTab("profile")}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Meu perfil</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>

              <button
                onClick={() => setActiveTab("planner")}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Evolução</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>

              <button
                onClick={() => setActiveTab("workouts")}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Treinos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>

              <button
                onClick={() => setActiveTab("scan")}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Refeições e Alimentos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Water Tracker Modal */}
      {showWaterTracker && (
        <WaterTracker
          onClose={() => setShowWaterTracker(false)}
          onSave={handleWaterSave}
        />
      )}

      {/* Weight Tracker Modal */}
      {showWeightTracker && (
        <WeightTracker
          onClose={() => setShowWeightTracker(false)}
          onSave={handleWeightSave}
        />
      )}

      {/* Quick Actions Menu */}
      {showQuickActions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)}>
          <div className="absolute bottom-20 left-0 right-0 px-4 pb-4">
            <div className="max-w-md mx-auto bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => handleQuickAction("food")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Registar Alimento</span>
                </button>

                <button
                  onClick={() => handleQuickAction("water")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Água</span>
                </button>

                <button
                  onClick={() => handleQuickAction("weight")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Weight className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-white">Peso</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <NavButton
              icon={TrendingUp}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <NavButton
              icon={Dumbbell}
              label="Treinos"
              active={activeTab === "workouts"}
              onClick={() => setActiveTab("workouts")}
            />
            <NavButton
              icon={Plus}
              label=""
              active={showQuickActions}
              onClick={handlePlusClick}
              highlighted
            />
            <NavButton
              icon={Zap}
              label="Evolução"
              active={activeTab === "planner"}
              onClick={() => setActiveTab("planner")}
            />
            <NavButton
              icon={MoreHorizontal}
              label="Mais"
              active={activeTab === "more"}
              onClick={() => setActiveTab("more")}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  highlighted?: boolean;
}

function NavButton({ icon: Icon, label, active, onClick, highlighted }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
        highlighted
          ? active
            ? "text-[#00BFFF] bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/10 ring-2 ring-[#00BFFF]/50 scale-110"
            : "text-[#00BFFF] bg-[#00BFFF]/10 ring-1 ring-[#00BFFF]/30 hover:ring-2 hover:ring-[#00BFFF]/50 hover:scale-105"
          : active
          ? "text-[#00BFFF] bg-[#00BFFF]/10"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className={`w-6 h-6 ${active ? "scale-110" : ""} transition-transform`} />
      {label && <span className="text-xs font-medium">{label}</span>}
    </button>
  );
}
