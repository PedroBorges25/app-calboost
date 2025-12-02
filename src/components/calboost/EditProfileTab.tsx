"use client";

import { ArrowLeft, ChevronRight, User, X } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { useState } from "react";

interface EditProfileTabProps {
  userProfile: UserProfile;
  onBack: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

type EditField = "name" | "age" | "gender" | "weight" | "height" | "activityLevel" | null;

export function EditProfileTab({ userProfile, onBack, onSave }: EditProfileTabProps) {
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [editingField, setEditingField] = useState<EditField>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const handleSave = () => {
    // Salva as alterações e persiste no localStorage
    onSave(editedProfile);
    
    // Atualiza o localStorage diretamente para garantir persistência
    const savedProfile = localStorage.getItem("calboost_profile");
    if (savedProfile) {
      const currentProfile = JSON.parse(savedProfile);
      const updatedProfile = { ...currentProfile, ...editedProfile };
      localStorage.setItem("calboost_profile", JSON.stringify(updatedProfile));
    }
    
    onBack();
  };

  const openEditModal = (field: EditField) => {
    setEditingField(field);
    if (field === "name") setTempValue(editedProfile.name);
    else if (field === "age") setTempValue(editedProfile.age.toString());
    else if (field === "gender") setTempValue(editedProfile.gender);
    else if (field === "weight") setTempValue(editedProfile.weight.toString());
    else if (field === "height") setTempValue(editedProfile.height.toString());
    else if (field === "activityLevel") setTempValue(editedProfile.activityLevel);
  };

  const closeEditModal = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveFieldValue = () => {
    if (!editingField) return;

    const updates: Partial<UserProfile> = {};

    if (editingField === "name") {
      updates.name = tempValue;
    } else if (editingField === "age") {
      updates.age = parseInt(tempValue) || editedProfile.age;
    } else if (editingField === "gender") {
      updates.gender = tempValue as "male" | "female";
    } else if (editingField === "weight") {
      updates.weight = parseFloat(tempValue) || editedProfile.weight;
    } else if (editingField === "height") {
      updates.height = parseFloat(tempValue) || editedProfile.height;
    } else if (editingField === "activityLevel") {
      updates.activityLevel = tempValue;
    }

    setEditedProfile({ ...editedProfile, ...updates });
    closeEditModal();
  };

  const profileFields = [
    { label: "Nome", value: editedProfile.name, key: "name" as EditField },
    { label: "Idade", value: `${editedProfile.age} anos`, key: "age" as EditField },
    { label: "Sexo", value: editedProfile.gender === "male" ? "Masculino" : "Feminino", key: "gender" as EditField },
    { label: "Peso", value: `${editedProfile.weight} kg`, key: "weight" as EditField },
    { label: "Altura", value: `${editedProfile.height} cm`, key: "height" as EditField },
    { label: "Nível de Atividade", value: getActivityLevelLabel(editedProfile.activityLevel), key: "activityLevel" as EditField },
  ];

  return (
    <>
      <div className="space-y-6 pb-32 md:pb-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white">Perfil</h2>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {editedProfile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 overflow-hidden">
          {profileFields.map((field, index) => (
            <ProfileField
              key={field.key}
              label={field.label}
              value={field.value}
              isLast={index === profileFields.length - 1}
              onClick={() => openEditModal(field.key)}
            />
          ))}
        </div>

        {/* Goals Section */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-2">Metas</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Defina suas metas diárias de calorias, macronutrientes e exercícios para alcançar seus objetivos de forma eficiente.
          </p>
          <button
            onClick={() => alert("Editar Metas")}
            className="mt-4 w-full px-4 py-3 rounded-xl bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20 transition-all duration-200 border border-[#00BFFF]/30"
          >
            <span className="text-sm font-medium text-[#00BFFF]">Configurar Metas</span>
          </button>
        </div>
      </div>

      {/* Save Button - FIXED: Agora sempre visível no mobile com posição fixa */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent md:relative md:p-0 md:bg-none z-20 pointer-events-none">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl bg-[#00BFFF] hover:bg-[#0080FF] transition-all duration-200 text-white font-bold text-base shadow-lg shadow-[#00BFFF]/20 pointer-events-auto"
        >
          Salvar Alterações
        </button>
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div className="bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl border border-white/10 w-full sm:max-w-md mx-auto p-6 space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Editar {profileFields.find(f => f.key === editingField)?.label}
              </h3>
              <button
                onClick={closeEditModal}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Input Field */}
            {editingField === "name" && (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50"
                autoFocus
              />
            )}

            {editingField === "age" && (
              <input
                type="number"
                inputMode="numeric"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Digite sua idade"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50"
                autoFocus
              />
            )}

            {editingField === "gender" && (
              <div className="space-y-3">
                <button
                  onClick={() => setTempValue("male")}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    tempValue === "male"
                      ? "bg-[#00BFFF]/20 border-[#00BFFF] text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Masculino
                </button>
                <button
                  onClick={() => setTempValue("female")}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    tempValue === "female"
                      ? "bg-[#00BFFF]/20 border-[#00BFFF] text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Feminino
                </button>
              </div>
            )}

            {editingField === "weight" && (
              <div className="space-y-2">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Digite seu peso"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50"
                  autoFocus
                />
                <p className="text-xs text-white/50 px-1">Peso em quilogramas (kg)</p>
              </div>
            )}

            {editingField === "height" && (
              <div className="space-y-2">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Digite sua altura"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50"
                  autoFocus
                />
                <p className="text-xs text-white/50 px-1">Altura em centímetros (cm)</p>
              </div>
            )}

            {editingField === "activityLevel" && (
              <div className="space-y-3">
                {[
                  { value: "sedentary", label: "Sedentário", desc: "Pouco ou nenhum exercício" },
                  { value: "light", label: "Leve", desc: "Exercício 1-3 dias/semana" },
                  { value: "moderate", label: "Moderado", desc: "Exercício 3-5 dias/semana" },
                  { value: "active", label: "Ativo", desc: "Exercício 6-7 dias/semana" },
                  { value: "veryActive", label: "Muito Ativo", desc: "Exercício intenso diariamente" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTempValue(option.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                      tempValue === option.value
                        ? "bg-[#00BFFF]/20 border-[#00BFFF]"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-white/60 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={closeEditModal}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white font-medium border border-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={saveFieldValue}
                className="flex-1 py-3 rounded-xl bg-[#00BFFF] hover:bg-[#0080FF] transition-all duration-200 text-white font-bold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
  isLast?: boolean;
  onClick: () => void;
}

function ProfileField({ label, value, isLast, onClick }: ProfileFieldProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-200 ${
        !isLast ? "border-b border-white/5" : ""
      }`}
    >
      <span className="text-base text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-[#00BFFF]">{value}</span>
        <ChevronRight className="w-5 h-5 text-white/40" />
      </div>
    </button>
  );
}

function getActivityLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    sedentary: "Sedentário",
    light: "Leve",
    moderate: "Moderado",
    active: "Ativo",
    veryActive: "Muito Ativo",
  };
  return labels[level] || level;
}
