import { supabase } from './supabase';

export interface ParsedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: string;
  confidence: number;
}

/**
 * Extrai alimentos de uma frase do utilizador
 * Ex: "Comi frango estufado com arroz e salada" -> ["frango estufado", "arroz", "salada"]
 */
export function extractFoodsFromText(text: string): string[] {
  // Remove pontuação e converte para minúsculas
  const cleanText = text.toLowerCase()
    .replace(/[.,!?;]/g, '')
    .trim();

  // Palavras conectoras comuns em português
  const connectors = ['com', 'e', 'mais', 'acompanhado', 'de'];
  
  // Palavras que indicam ação (remover do resultado)
  const actionWords = ['comi', 'almocei', 'jantei', 'tomei', 'bebi', 'pequeno', 'almoço'];

  // Divide por conectores
  let foods: string[] = [];
  let currentFood = '';
  
  const words = cleanText.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Ignora palavras de ação
    if (actionWords.includes(word)) {
      continue;
    }
    
    // Se encontrar conector, salva o alimento atual e começa novo
    if (connectors.includes(word)) {
      if (currentFood.trim()) {
        foods.push(currentFood.trim());
      }
      currentFood = '';
    } else {
      currentFood += (currentFood ? ' ' : '') + word;
    }
  }
  
  // Adiciona o último alimento
  if (currentFood.trim()) {
    foods.push(currentFood.trim());
  }
  
  return foods.filter(f => f.length > 2); // Remove palavras muito curtas
}

/**
 * Consulta o Supabase para encontrar informações nutricionais do alimento
 */
export async function searchFoodInDatabase(foodName: string): Promise<ParsedFood | null> {
  try {
    // Query com ILIKE para busca case-insensitive e parcial
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .ilike('nome', `%${foodName}%`)
      .limit(1)
      .single();

    if (error || !data) {
      console.log(`Alimento não encontrado: ${foodName}`);
      return null;
    }

    return {
      name: data.nome,
      calories: data.calorias || 0,
      protein: data.proteinas || 0,
      carbs: data.carboidratos || 0,
      fats: data.gorduras || 0,
      serving: data.porcao || '100g',
      confidence: 1.0,
    };
  } catch (err) {
    console.error('Erro ao consultar Supabase:', err);
    return null;
  }
}

/**
 * Processa uma frase completa e retorna todos os alimentos encontrados
 */
export async function parseMealDescription(description: string): Promise<{
  foods: ParsedFood[];
  notFound: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}> {
  // 1. Extrair alimentos da frase
  const extractedFoods = extractFoodsFromText(description);
  
  // 2. Consultar cada alimento no Supabase
  const results = await Promise.all(
    extractedFoods.map(async (foodName) => {
      const food = await searchFoodInDatabase(foodName);
      return { foodName, food };
    })
  );
  
  // 3. Separar encontrados e não encontrados
  const foods: ParsedFood[] = [];
  const notFound: string[] = [];
  
  results.forEach(({ foodName, food }) => {
    if (food) {
      foods.push(food);
    } else {
      notFound.push(foodName);
    }
  });
  
  // 4. Calcular totais
  const totals = foods.reduce(
    (acc, food) => ({
      totalCalories: acc.totalCalories + food.calories,
      totalProtein: acc.totalProtein + food.protein,
      totalCarbs: acc.totalCarbs + food.carbs,
      totalFats: acc.totalFats + food.fats,
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
  );
  
  return {
    foods,
    notFound,
    ...totals,
  };
}
