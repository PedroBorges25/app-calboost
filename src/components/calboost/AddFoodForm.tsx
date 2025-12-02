"use client";

import { useState } from "react";
import { Plus, Loader2, Check, X, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AddFoodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddFoodForm({ onSuccess, onCancel }: AddFoodFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    calorias: "",
    proteinas: "",
    carboidratos: "",
    gorduras: "",
    porcao: "100g",
    categoria: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categorias = [
    "Proteína",
    "Carboidrato",
    "Vegetal",
    "Fruta",
    "Laticínio",
    "Gordura",
    "Leguminosa",
    "Fruto Seco",
    "Bebida",
    "Outro",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validação
    if (!formData.nome.trim()) {
      setError("O nome do alimento é obrigatório");
      return;
    }

    if (!formData.calorias || parseFloat(formData.calorias) < 0) {
      setError("As calorias devem ser um número válido");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: supabaseError } = await supabase
        .from("alimentos")
        .insert([
          {
            nome: formData.nome.trim(),
            calorias: parseFloat(formData.calorias) || 0,
            proteinas: parseFloat(formData.proteinas) || 0,
            carboidratos: parseFloat(formData.carboidratos) || 0,
            gorduras: parseFloat(formData.gorduras) || 0,
            porcao: formData.porcao.trim() || "100g",
            categoria: formData.categoria || null,
          },
        ])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        nome: "",
        calorias: "",
        proteinas: "",
        carboidratos: "",
        gorduras: "",
        porcao: "100g",
        categoria: "",
      });

      // Callback de sucesso
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Erro ao adicionar alimento:", err);
      setError(err.message || "Erro ao adicionar alimento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Adicionar Novo Alimento</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-400 font-medium">Sucesso!</p>
            <p className="text-green-300/80 text-sm">Alimento adicionado à base de dados</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 font-medium">Erro</p>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-white font-medium mb-2">
            Nome do Alimento *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Frango Grelhado"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
            required
          />
        </div>

        {/* Calorias */}
        <div>
          <label className="block text-white font-medium mb-2">
            Calorias (kcal) *
          </label>
          <input
            type="number"
            name="calorias"
            value={formData.calorias}
            onChange={handleChange}
            placeholder="Ex: 165"
            step="0.1"
            min="0"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
            required
          />
        </div>

        {/* Macronutrientes */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Proteínas (g)
            </label>
            <input
              type="number"
              name="proteinas"
              value={formData.proteinas}
              onChange={handleChange}
              placeholder="0"
              step="0.1"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Carboidratos (g)
            </label>
            <input
              type="number"
              name="carboidratos"
              value={formData.carboidratos}
              onChange={handleChange}
              placeholder="0"
              step="0.1"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2 text-sm">
              Gorduras (g)
            </label>
            <input
              type="number"
              name="gorduras"
              value={formData.gorduras}
              onChange={handleChange}
              placeholder="0"
              step="0.1"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Porção e Categoria */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-white font-medium mb-2">
              Porção
            </label>
            <input
              type="text"
              name="porcao"
              value={formData.porcao}
              onChange={handleChange}
              placeholder="Ex: 100g, 1 unidade"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">
              Categoria
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
            >
              <option value="" className="bg-gray-900">Selecione...</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] hover:from-[#00BFFF]/90 hover:to-[#0080FF]/90 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFFF]/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              A adicionar...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Adicionar Alimento
            </>
          )}
        </button>
      </form>
    </div>
  );
}
