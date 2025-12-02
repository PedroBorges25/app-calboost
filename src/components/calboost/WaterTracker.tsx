"use client";

import { useState } from "react";
import { X, Check, Settings } from "lucide-react";

interface WaterTrackerProps {
  onClose: () => void;
  onSave: (amount: number) => void;
}

export function WaterTracker({ onClose, onSave }: WaterTrackerProps) {
  const [waterAmount, setWaterAmount] = useState(0);

  const addWater = (amount: number) => {
    setWaterAmount((prev) => prev + amount);
  };

  const handleSave = () => {
    if (waterAmount > 0) {
      onSave(waterAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">Adicionar água</h2>
          <button
            onClick={handleSave}
            className="w-10 h-10 rounded-xl bg-[#00BFFF]/20 hover:bg-[#00BFFF]/30 flex items-center justify-center transition-colors"
          >
            <Check className="w-5 h-5 text-[#00BFFF]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Water Illustration */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="w-32 h-40 rounded-3xl bg-gradient-to-b from-blue-400/20 to-blue-600/40 border-2 border-blue-400/50 flex items-end justify-center overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ height: `${Math.min((waterAmount / 2000) * 100, 100)}%` }}
                />
              </div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-24 h-32 rounded-3xl bg-gradient-to-b from-blue-400/10 to-blue-600/20 border border-blue-400/30" />
            </div>
          </div>

          {/* Input Field */}
          <div className="relative">
            <input
              type="number"
              value={waterAmount || ""}
              onChange={(e) => setWaterAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full text-center text-4xl font-bold bg-white/5 border border-white/10 rounded-xl py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl text-white/60">
              ml
            </span>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => addWater(250)}
              className="py-4 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 text-white font-medium"
            >
              +250 ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="py-4 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 text-white font-medium"
            >
              +500 ml
            </button>
            <button
              onClick={() => addWater(1000)}
              className="py-4 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 text-white font-medium"
            >
              +1000 ml
            </button>
          </div>

          {/* Settings Link */}
          <button className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white/80 transition-colors py-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Alterar unidade</span>
          </button>
        </div>
      </div>
    </div>
  );
}
