"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Loader2, Check, X, AlertCircle, Search, ChevronLeft, Zap, Coffee, Utensils, Moon, Cookie, Sparkles, Lightbulb } from "lucide-react";
import { MealAnalysis } from "@/lib/openai";
import { MealEntry } from "@/lib/types";
import { parseMealDescription, ParsedFood } from "@/lib/food-parser";
import { AddFoodForm } from "./AddFoodForm";
import { supabase } from "@/lib/supabase";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: string;
  category?: string;
}

const mealTypes = [
  { id: "breakfast", label: "Pequeno-Almoço", icon: Coffee, color: "from-orange-500 to-yellow-500" },
  { id: "lunch", label: "Almoço", icon: Utensils, color: "from-green-500 to-emerald-500" },
  { id: "dinner", label: "Jantar", icon: Moon, color: "from-purple-500 to-indigo-500" },
  { id: "snack", label: "Lanches", icon: Cookie, color: "from-pink-500 to-rose-500" },
];

export function MealScanner() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [servingMultiplier, setServingMultiplier] = useState<{ [key: string]: number }>({});
  const [showMealTypeModal, setShowMealTypeModal] = useState(false);
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null);
  const [notFoundFoods, setNotFoundFoods] = useState<string[]>([]);
  const [showNLPInput, setShowNLPInput] = useState(false);
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [showCreateFoodModal, setShowCreateFoodModal] = useState(false);
  const [supabaseFoods, setSupabaseFoods] = useState<FoodItem[]>([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [remainingCalories, setRemainingCalories] = useState(0);

  // Estado para o formulário de criar alimento
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Verificar se é admin (você pode implementar lógica real de autenticação aqui)
  useEffect(() => {
    // Por enquanto, vamos usar uma verificação simples no localStorage
    // Em produção, isso deveria vir de um sistema de autenticação real
    const adminStatus = localStorage.getItem("calboost_is_admin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // Calcular calorias restantes
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("calboost_profile") || "{}");
    const dailyGoal = profile.dailyCalorieGoal || 2000;
    
    const meals = JSON.parse(localStorage.getItem("calboost_meals") || "[]");
    const today = new Date().toDateString();
    const todayMeals = meals.filter((meal: MealEntry) => 
      new Date(meal.date).toDateString() === today
    );
    
    const consumedCalories = todayMeals.reduce((sum: number, meal: MealEntry) => 
      sum + meal.calories, 0
    );
    
    setRemainingCalories(Math.max(0, dailyGoal - consumedCalories));
  }, []);

  // Buscar alimentos do Supabase quando o componente montar ou quando a pesquisa mudar
  useEffect(() => {
    fetchFoodsFromSupabase();
  }, [searchQuery]);

  const fetchFoodsFromSupabase = async () => {
    setIsLoadingFoods(true);
    try {
      let query = supabase
        .from('alimentos')
        .select('*')
        .order('nome', { ascending: true });

      // Se houver pesquisa, filtrar por nome
      if (searchQuery.trim()) {
        query = query.ilike('nome', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar alimentos:', error);
        setError('Erro ao carregar alimentos do Supabase');
        return;
      }

      // Mapear dados do Supabase para o formato esperado
      const mappedFoods: FoodItem[] = (data || []).map((food: any) => ({
        id: food.id.toString(),
        name: food.nome,
        calories: food.calorias,
        protein: food.proteinas,
        carbs: food.carboidratos,
        fats: food.gorduras,
        serving: food.porcao || '100g',
        category: food.categoria,
      }));

      // Remover duplicados baseado no nome (case-insensitive)
      const uniqueFoods = mappedFoods.reduce((acc: FoodItem[], current) => {
        const duplicate = acc.find(
          item => item.name.toLowerCase().trim() === current.name.toLowerCase().trim()
        );
        if (!duplicate) {
          acc.push(current);
        }
        return acc;
      }, []);

      setSupabaseFoods(uniqueFoods);
    } catch (err) {
      console.error('Erro ao buscar alimentos:', err);
      setError('Erro ao carregar alimentos');
    } finally {
      setIsLoadingFoods(false);
    }
  };

  const handleCreateFood = async () => {
    // Validar campos obrigatórios
    if (!newFood.name.trim() || !newFood.calories) {
      setError("Por favor, preencha os campos obrigatórios (Nome e Calorias)");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('alimentos')
        .insert([
          {
            nome: newFood.name.trim(),
            calorias: parseFloat(newFood.calories),
            proteinas: newFood.protein ? parseFloat(newFood.protein) : 0,
            carboidratos: newFood.carbs ? parseFloat(newFood.carbs) : 0,
            gorduras: newFood.fats ? parseFloat(newFood.fats) : 0,
            porcao: '100g',
            categoria: null
          }
        ])
        .select();

      if (error) {
        console.error('Erro ao criar alimento:', error);
        setError('Erro ao criar alimento no Supabase');
        return;
      }

      // Resetar formulário
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
      });

      // Fechar modal
      setShowCreateFoodModal(false);

      // Recarregar lista
      fetchFoodsFromSupabase();

      alert("Alimento criado com sucesso! 🎉");
    } catch (err) {
      console.error('Erro ao criar alimento:', err);
      setError('Erro ao criar alimento');
    }
  };

  const handleAddFood = (food: FoodItem) => {
    setPendingFood(food);
    setShowMealTypeModal(true);
  };

  const handleSelectMealType = (mealType: string) => {
    if (pendingFood) {
      setSelectedFoods([...selectedFoods, { ...pendingFood, mealType } as any]);
      setServingMultiplier({ ...servingMultiplier, [pendingFood.id]: 1 });
    }
    setShowMealTypeModal(false);
    setPendingFood(null);
  };

  const handleRemoveFood = (index: number) => {
    const newFoods = selectedFoods.filter((_, i) => i !== index);
    setSelectedFoods(newFoods);
  };

  const updateServingMultiplier = (foodId: string, multiplier: number) => {
    setServingMultiplier({ ...servingMultiplier, [foodId]: multiplier });
  };

  const calculateTotals = () => {
    return selectedFoods.reduce(
      (acc, food, index) => {
        const multiplier = servingMultiplier[food.id] || 1;
        return {
          calories: acc.calories + food.calories * multiplier,
          protein: acc.protein + food.protein * multiplier,
          carbs: acc.carbs + food.carbs * multiplier,
          fats: acc.fats + food.fats * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const handleParseMealDescription = async () => {
    if (!mealDescription.trim()) {
      setError("Por favor, descreva a sua refeição");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setNotFoundFoods([]);

    try {
      const result = await parseMealDescription(mealDescription);

      if (result.foods.length === 0) {
        setError("Não consegui identificar nenhum alimento. Tente ser mais específico.");
        setIsAnalyzing(false);
        return;
      }

      // Adicionar alimentos encontrados à lista
      const newFoods = result.foods.map((food, index) => ({
        id: `parsed-${Date.now()}-${index}`,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        serving: food.serving,
      }));

      setSelectedFoods([...selectedFoods, ...newFoods]);
      
      // Inicializar multiplicadores
      const newMultipliers = { ...servingMultiplier };
      newFoods.forEach(food => {
        newMultipliers[food.id] = 1;
      });
      setServingMultiplier(newMultipliers);

      // Mostrar alimentos não encontrados
      if (result.notFound.length > 0) {
        setNotFoundFoods(result.notFound);
      }

      // Limpar input e fechar modal
      setMealDescription("");
      setShowNLPInput(false);

    } catch (err) {
      console.error("Erro ao processar refeição:", err);
      setError("Erro ao processar a refeição. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = () => {
    if (selectedFoods.length === 0) {
      setError("Adicione pelo menos um alimento");
      return;
    }

    const totals = calculateTotals();
    
    // Agrupar alimentos por tipo de refeição
    const mealsByType: { [key: string]: any[] } = {};
    selectedFoods.forEach((food: any) => {
      const mealType = food.mealType || "snack";
      if (!mealsByType[mealType]) {
        mealsByType[mealType] = [];
      }
      mealsByType[mealType].push(food);
    });

    // Salvar cada tipo de refeição separadamente
    const meals = JSON.parse(localStorage.getItem("calboost_meals") || "[]");
    
    Object.entries(mealsByType).forEach(([mealType, foods]) => {
      const mealTotals = foods.reduce(
        (acc, food) => {
          const multiplier = servingMultiplier[food.id] || 1;
          return {
            calories: acc.calories + food.calories * multiplier,
            protein: acc.protein + food.protein * multiplier,
            carbs: acc.carbs + food.carbs * multiplier,
            fats: acc.fats + food.fats * multiplier,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      const meal: MealEntry = {
        id: Date.now().toString() + mealType,
        date: new Date(),
        foodItems: foods.map((f) => f.name),
        calories: Math.round(mealTotals.calories),
        protein: Math.round(mealTotals.protein),
        carbs: Math.round(mealTotals.carbs),
        fats: Math.round(mealTotals.fats),
        description: foods.map((f) => f.name).join(", "),
        mealType: mealType as MealEntry["mealType"],
      };

      meals.push(meal);
    });

    localStorage.setItem("calboost_meals", JSON.stringify(meals));

    // Reset
    setSelectedFoods([]);
    setServingMultiplier({});
    setSearchQuery("");
    setNotFoundFoods([]);
    alert("Refeição guardada com sucesso! 🎉");
  };

  // Gerar sugestões de refeições baseadas nas calorias restantes
  const getMealSuggestions = () => {
    const suggestions = [
      {
        name: "Salada de Frango Grelhado",
        calories: Math.round(remainingCalories * 0.3),
        description: "Peito de frango grelhado com mix de folhas verdes, tomate cherry e azeite",
        icon: "🥗"
      },
      {
        name: "Omelete de Claras com Legumes",
        calories: Math.round(remainingCalories * 0.25),
        description: "3 claras de ovo com espinafres, tomate e cogumelos",
        icon: "🍳"
      },
      {
        name: "Salmão com Batata Doce",
        calories: Math.round(remainingCalories * 0.4),
        description: "Filete de salmão grelhado com batata doce assada e brócolos",
        icon: "🐟"
      },
      {
        name: "Iogurte Grego com Frutos Vermelhos",
        calories: Math.round(remainingCalories * 0.2),
        description: "Iogurte grego natural com mirtilos, morangos e granola",
        icon: "🥣"
      },
      {
        name: "Wrap de Peru e Abacate",
        calories: Math.round(remainingCalories * 0.35),
        description: "Tortilha integral com fatias de peru, abacate, alface e tomate",
        icon: "🌯"
      }
    ];

    return suggestions;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
          Registe a sua Refeição
        </h2>
        <p className="text-white/60 max-w-md mx-auto">
          Pesquise alimentos ou descreva a sua refeição
        </p>
      </div>

      {/* Botão para criar novo alimento */}
      <button
        onClick={() => setShowCreateFoodModal(true)}
        className="w-full bg-gradient-to-r from-[#00BFFF]/20 to-blue-500/20 hover:from-[#00BFFF]/30 hover:to-blue-500/30 border-2 border-[#00BFFF]/50 rounded-xl p-4 transition-all duration-300 flex items-center justify-center gap-3 group"
      >
        <Plus className="w-5 h-5 text-[#00BFFF] group-hover:scale-110 transition-transform" />
        <span className="text-white font-semibold">
          Criar Alimento
        </span>
      </button>

      {/* Botão para adicionar novo alimento - APENAS ADMIN */}
      {isAdmin && (
        <button
          onClick={() => setShowAddFoodForm(!showAddFoodForm)}
          className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border-2 border-green-500/50 rounded-xl p-4 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <Plus className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold">
            {showAddFoodForm ? "Fechar Formulário" : "Adicionar Novo Alimento à Base de Dados"}
          </span>
        </button>
      )}

      {/* Formulário de Adicionar Alimento */}
      {showAddFoodForm && isAdmin && (
        <AddFoodForm
          onSuccess={() => {
            setShowAddFoodForm(false);
            fetchFoodsFromSupabase(); // Recarregar lista após adicionar
            alert("Alimento adicionado com sucesso! 🎉");
          }}
          onCancel={() => setShowAddFoodForm(false)}
        />
      )}

      {/* Alimentos não encontrados */}
      {notFoundFoods.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-400 font-medium mb-2">⚠️ Alimentos não encontrados:</p>
          <p className="text-yellow-300/80 text-sm">
            {notFoundFoods.join(", ")}
          </p>
          <p className="text-yellow-300/60 text-xs mt-2">
            Adicione-os manualmente usando a pesquisa abaixo
          </p>
        </div>
      )}

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar alimentos na base de dados..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 font-medium mb-1">Erro</p>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Alimentos Selecionados */}
      {selectedFoods.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">
            Alimentos Adicionados ({selectedFoods.length})
          </h3>
          {selectedFoods.map((food: any, index) => {
            const multiplier = servingMultiplier[food.id] || 1;
            const mealTypeInfo = mealTypes.find(m => m.id === food.mealType);
            return (
              <div
                key={`${food.id}-${index}`}
                className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{food.name}</p>
                    {mealTypeInfo && (
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${mealTypeInfo.color} text-white`}>
                        {mealTypeInfo.label}
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">
                    {Math.round(food.calories * multiplier)} kcal · {food.serving}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={multiplier}
                    onChange={(e) =>
                      updateServingMultiplier(food.id, parseFloat(e.target.value) || 1)
                    }
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-[#00BFFF]/50"
                  />
                  <button
                    onClick={() => handleRemoveFood(index)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Totais */}
          <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/10 rounded-xl p-4 border border-[#00BFFF]/30">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-[#00BFFF]">
                  {Math.round(calculateTotals().calories)}
                </p>
                <p className="text-xs text-white/60">kcal</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-400">
                  {Math.round(calculateTotals().protein)}g
                </p>
                <p className="text-xs text-white/60">Proteínas</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-400">
                  {Math.round(calculateTotals().carbs)}g
                </p>
                <p className="text-xs text-white/60">Carboidratos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-400">
                  {Math.round(calculateTotals().fats)}g
                </p>
                <p className="text-xs text-white/60">Gorduras</p>
              </div>
            </div>
          </div>

          {/* Botão Guardar */}
          <button
            onClick={handleSaveMeal}
            className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] hover:from-[#00BFFF]/90 hover:to-[#0080FF]/90 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFFF]/20"
          >
            <Check className="w-5 h-5" />
            Guardar Refeição
          </button>
        </div>
      )}

      {/* Sugestões de Refeições */}
      {!searchQuery && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Lightbulb className="w-5 h-5 text-[#00BFFF]" />
            <h3 className="text-lg font-semibold text-white">
              Sugestões ({remainingCalories} kcal restantes)
            </h3>
          </div>
          <div className="space-y-2">
            {getMealSuggestions().map((suggestion, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-[#00BFFF]/10 to-purple-500/10 hover:from-[#00BFFF]/20 hover:to-purple-500/20 rounded-xl p-4 border border-[#00BFFF]/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{suggestion.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold">{suggestion.name}</h4>
                      <span className="text-[#00BFFF] font-bold text-sm">
                        ~{suggestion.calories} kcal
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Resultados da Pesquisa */}
      {searchQuery && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white px-1">
            Resultados da Pesquisa ({supabaseFoods.length})
          </h3>
          {isLoadingFoods ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mx-auto mb-2" />
              <p className="text-white/40">A carregar alimentos...</p>
            </div>
          ) : supabaseFoods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40">Nenhum alimento encontrado</p>
            </div>
          ) : (
            supabaseFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{food.name}</p>
                    {food.category && (
                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                        {food.category}
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">
                    {food.calories} kcal · {food.serving}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-white/50">
                    <span>Proteínas {food.protein}g</span>
                    <span>Carboidratos {food.carbs}g</span>
                    <span>Gorduras {food.fats}g</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFood(food)}
                  className="p-3 rounded-full bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20 text-[#00BFFF] transition-colors group-hover:scale-110"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de Criar Alimento */}
      {showCreateFoodModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Criar Alimento</h3>
              <button
                onClick={() => setShowCreateFoodModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Nome</label>
                  <span className="text-xs text-red-400">Necessário</span>
                </div>
                <input
                  type="text"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="Ex: Banana"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                />
              </div>

              {/* Calorias */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Calorias</label>
                  <span className="text-xs text-red-400">Necessário</span>
                </div>
                <input
                  type="number"
                  value={newFood.calories}
                  onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                  placeholder="Ex: 89"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                />
              </div>

              {/* Carboidratos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Carboidratos (g)</label>
                  <span className="text-xs text-white/40">Opcional</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                  placeholder="Ex: 22.8"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                />
              </div>

              {/* Gorduras */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Gorduras (g)</label>
                  <span className="text-xs text-white/40">Opcional</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.fats}
                  onChange={(e) => setNewFood({ ...newFood, fats: e.target.value })}
                  placeholder="Ex: 0.3"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                />
              </div>

              {/* Proteínas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Proteínas (g)</label>
                  <span className="text-xs text-white/40">Opcional</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.protein}
                  onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                  placeholder="Ex: 1.1"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00BFFF]/50 transition-colors"
                />
              </div>
            </div>

            {/* Botão Registrar */}
            <div className="p-6 pt-0">
              <button
                onClick={handleCreateFood}
                className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] hover:from-[#00BFFF]/90 hover:to-[#0080FF]/90 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#00BFFF]/20"
              >
                REGISTRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Tipo de Refeição */}
      {showMealTypeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Selecione a Refeição</h3>
              <p className="text-white/60 text-sm">
                {pendingFood?.name} será adicionado a:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mealTypes.map((mealType) => {
                const Icon = mealType.icon;
                return (
                  <button
                    key={mealType.id}
                    onClick={() => handleSelectMealType(mealType.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${mealType.color} hover:scale-105 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    <span className="text-white font-semibold text-sm">
                      {mealType.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowMealTypeModal(false);
                setPendingFood(null);
              }}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
