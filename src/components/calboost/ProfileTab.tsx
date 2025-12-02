"use client";

import { User, ChevronRight, Bell, Lock, HelpCircle, LogOut, Camera } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { useState } from "react";
import { EditProfileTab } from "./EditProfileTab";

interface ProfileTabProps {
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

export function ProfileTab({ userProfile, onUpdateProfile }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (updatedProfile: Partial<UserProfile>) => {
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleSettingClick = (setting: string) => {
    alert(`Funcionalidade '${setting}' em desenvolvimento`);
  };

  // Se estiver editando, mostra a tela de edição
  if (isEditing) {
    return (
      <EditProfileTab
        userProfile={userProfile}
        onBack={() => setIsEditing(false)}
        onSave={handleSaveProfile}
      />
    );
  }

  // Caso contrário, mostra a tela normal do perfil
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Perfil</h2>
      </div>

      {/* Profile Section */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button
              onClick={handleEditProfile}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#00BFFF] flex items-center justify-center border-2 border-[#1A1A1A] hover:bg-[#0080FF] transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{userProfile.name}</h3>
            <p className="text-sm text-white/60 mt-1">
              {userProfile.age} anos • {userProfile.gender === "male" ? "Masculino" : "Feminino"}
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
          >
            <span className="text-sm font-medium text-[#00BFFF]">Editar</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{userProfile.weight}</p>
            <p className="text-xs text-white/60 mt-1">Peso (kg)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{userProfile.height}</p>
            <p className="text-xs text-white/60 mt-1">Altura (cm)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{userProfile.dailyCalorieGoal}</p>
            <p className="text-xs text-white/60 mt-1">Meta (kcal)</p>
          </div>
        </div>
      </div>

      {/* Promotional Card */}
      <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#0080FF]/10 rounded-2xl border border-[#00BFFF]/30 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Alcance seus objetivos mais rápido
            </h3>
            <p className="text-sm text-white/70 mb-4">
              Desbloqueie planos personalizados e acompanhamento avançado
            </p>
            <button className="px-4 py-2 rounded-xl bg-[#00BFFF] hover:bg-[#0080FF] transition-colors text-white font-medium text-sm">
              Upgrade Premium
            </button>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
            <span className="text-3xl">⚡</span>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 overflow-hidden">
        <SettingItem
          icon={Bell}
          label="Notificações"
          onClick={() => handleSettingClick("Notificações")}
        />
        <SettingItem
          icon={Lock}
          label="Privacidade e Segurança"
          onClick={() => handleSettingClick("Privacidade e Segurança")}
        />
        <SettingItem
          icon={HelpCircle}
          label="Ajuda e Suporte"
          onClick={() => handleSettingClick("Ajuda e Suporte")}
        />
        <SettingItem
          icon={LogOut}
          label="Sair"
          onClick={() => {
            if (confirm("Tem certeza que deseja sair?")) {
              localStorage.removeItem("calboost_profile");
              window.location.reload();
            }
          }}
          isLast
          isDanger
        />
      </div>

      {/* App Version */}
      <div className="text-center py-4">
        <p className="text-xs text-white/40">CalBoost v1.0.0</p>
      </div>
    </div>
  );
}

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isLast?: boolean;
  isDanger?: boolean;
}

function SettingItem({ icon: Icon, label, onClick, isLast, isDanger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200 ${
        !isLast ? "border-b border-white/5" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl ${
          isDanger 
            ? "bg-red-500/10" 
            : "bg-white/5"
        } flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${isDanger ? "text-red-500" : "text-white/70"}`} />
        </div>
        <span className={`text-base font-medium ${isDanger ? "text-red-500" : "text-white"}`}>
          {label}
        </span>
      </div>
      <ChevronRight className={`w-5 h-5 ${isDanger ? "text-red-500/40" : "text-white/40"}`} />
    </button>
  );
}
