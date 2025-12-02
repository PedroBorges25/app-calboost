"use client";

import { useState } from "react";
import { X, Plus, TrendingDown, TrendingUp, Trash2 } from "lucide-react";

interface WeightTrackerProps {
  onClose: () => void;
  onSave: (weight: number) => void;
}

export function WeightTracker({ onClose, onSave }: WeightTrackerProps) {
  const [weight, setWeight] = useState("");

  const handleSave = () => {
    const weightValue = parseFloat(weight);
    if (weightValue > 0) {
      onSave(weightValue);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Registar Peso</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="text-white font-medium mb-2 block">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 75.5"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors text-center text-2xl font-bold"
              autoFocus
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!weight || parseFloat(weight) <= 0}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20"
          >
            Guardar Peso
          </button>
        </div>
      </div>
    </div>
  );
}

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightProgressProps {
  entries: WeightEntry[];
  onDelete?: (date: string) => void;
}

export function WeightProgress({ entries, onDelete }: WeightProgressProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
        <p className="text-white/60">Nenhum registo de peso ainda.</p>
        <p className="text-white/40 text-sm mt-2">
          Use o botão + para adicionar seu primeiro peso.
        </p>
      </div>
    );
  }

  // Ordenar entradas por data (mais antiga primeiro)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const currentWeight = sortedEntries[sortedEntries.length - 1].weight;
  const initialWeight = sortedEntries[0].weight;
  const weightChange = currentWeight - initialWeight;
  const isLoss = weightChange < 0;

  const handleDelete = (dateToDelete: string) => {
    if (onDelete && confirm("Tem certeza que deseja apagar este registro?")) {
      onDelete(dateToDelete);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Progresso de Peso</h3>
        <div className="flex items-center gap-2">
          {isLoss ? (
            <TrendingDown className="w-5 h-5 text-green-400" />
          ) : weightChange > 0 ? (
            <TrendingUp className="w-5 h-5 text-orange-400" />
          ) : null}
          <span
            className={`text-sm font-bold ${
              isLoss
                ? "text-green-400"
                : weightChange > 0
                ? "text-orange-400"
                : "text-white/60"
            }`}
          >
            {weightChange > 0 ? "+" : ""}
            {weightChange.toFixed(1)} kg
          </span>
        </div>
      </div>

      {/* Peso atual destacado */}
      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/30">
        <p className="text-white/60 text-sm mb-1">Peso Atual</p>
        <p className="text-4xl font-bold text-white">
          {currentWeight.toFixed(1)}
          <span className="text-lg text-white/60 ml-2">kg</span>
        </p>
      </div>

      {/* Lista de registros */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h4 className="text-sm font-semibold text-white/80 mb-3">Histórico</h4>
        {sortedEntries
          .slice()
          .reverse()
          .map((entry, index) => {
            const date = new Date(entry.date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10 group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-sm ${isToday ? "text-purple-400" : "text-white/60"}`}>
                    {date.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {isToday && " (Hoje)"}
                  </span>
                  <span className="text-white font-semibold">{entry.weight.toFixed(1)} kg</span>
                </div>
                <button
                  onClick={() => handleDelete(entry.date)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  title="Apagar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
