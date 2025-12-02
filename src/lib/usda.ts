// Funções helper para integração com USDA FoodData Central API

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || 'JdKxqYh1XitOmTF1RUliKeAu19tGJD5rwwJCLXh9';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: USDANutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface NutrientData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

/**
 * Pesquisar alimentos na base de dados USDA
 */
export async function searchUSDAFood(query: string, pageSize: number = 5): Promise<USDAFood[]> {
  try {
    const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR%20Legacy`;
    
    console.log('🔍 Pesquisando na USDA:', query);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API USDA: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.foods || [];
  } catch (error) {
    console.error('❌ Erro ao pesquisar na USDA:', error);
    throw error;
  }
}

/**
 * Obter detalhes de um alimento específico pelo ID
 */
export async function getUSDAFoodDetails(fdcId: number): Promise<USDAFood | null> {
  try {
    const url = `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro na API USDA: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao obter detalhes da USDA:', error);
    return null;
  }
}

/**
 * Extrair valores nutricionais de um alimento USDA
 */
export function extractNutrients(food: USDAFood, quantity: number = 100): NutrientData {
  const nutrients: NutrientData = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0
  };

  if (!food.foodNutrients) {
    return nutrients;
  }

  // Mapeamento de IDs de nutrientes da USDA
  const nutrientMap: { [key: string]: keyof NutrientData } = {
    '1008': 'calories',    // Energy (kcal)
    '1003': 'protein',     // Protein
    '1005': 'carbs',       // Carbohydrate
    '1004': 'fats',        // Total lipid (fat)
    '1079': 'fiber'        // Fiber, total dietary
  };

  food.foodNutrients.forEach((nutrient) => {
    const nutrientKey = nutrientMap[nutrient.nutrientNumber];
    
    if (nutrientKey && nutrient.value) {
      // Calcular valor baseado na quantidade (padrão USDA é por 100g)
      const factor = quantity / 100;
      nutrients[nutrientKey] = Math.round(nutrient.value * factor * 10) / 10;
    }
  });

  return nutrients;
}

/**
 * Traduzir termos culinários de PT para EN para melhor busca na USDA
 */
export function translateFoodTerms(portugueseTerm: string): string {
  const translations: { [key: string]: string } = {
    // Carnes
    'frango': 'chicken',
    'frango estufado': 'chicken stewed',
    'frango grelhado': 'chicken grilled',
    'frango assado': 'chicken roasted',
    'peru': 'turkey',
    'vaca': 'beef',
    'porco': 'pork',
    'borrego': 'lamb',
    'peixe': 'fish',
    'salmão': 'salmon',
    'salmão grelhado': 'salmon grilled',
    'atum': 'tuna',
    'bacalhau': 'cod',
    
    // Acompanhamentos
    'arroz': 'rice',
    'arroz branco': 'white rice cooked',
    'arroz integral': 'brown rice cooked',
    'massa': 'pasta',
    'batata': 'potato',
    'batata doce': 'sweet potato',
    'batata-doce': 'sweet potato',
    'batatas fritas': 'french fries',
    
    // Vegetais
    'brócolos': 'broccoli',
    'cenoura': 'carrot',
    'tomate': 'tomato',
    'alface': 'lettuce',
    'cebola': 'onion',
    'alho': 'garlic',
    'espinafres': 'spinach',
    'couve': 'cabbage',
    
    // Leguminosas
    'feijão': 'beans',
    'grão': 'chickpeas',
    'lentilhas': 'lentils',
    
    // Laticínios
    'leite': 'milk',
    'queijo': 'cheese',
    'iogurte': 'yogurt',
    'manteiga': 'butter',
    
    // Outros
    'ovo': 'egg',
    'ovos': 'eggs',
    'pão': 'bread',
    'azeite': 'olive oil',
    'óleo': 'oil'
  };

  const lowerTerm = portugueseTerm.toLowerCase().trim();
  
  // Procurar tradução exata
  if (translations[lowerTerm]) {
    return translations[lowerTerm];
  }
  
  // Procurar tradução parcial
  for (const [pt, en] of Object.entries(translations)) {
    if (lowerTerm.includes(pt)) {
      return en;
    }
  }
  
  // Se não encontrar tradução, retornar o termo original
  return portugueseTerm;
}

/**
 * Pesquisar e obter nutrientes de um alimento
 */
export async function getFoodNutrients(
  foodName: string, 
  quantity: number = 100
): Promise<NutrientData | null> {
  try {
    // Traduzir termo para inglês
    const englishTerm = translateFoodTerms(foodName);
    
    console.log(`🔄 Traduzido: "${foodName}" → "${englishTerm}"`);
    
    // Pesquisar na USDA
    const foods = await searchUSDAFood(englishTerm, 1);
    
    if (foods.length === 0) {
      console.warn(`⚠️ Nenhum alimento encontrado para: ${foodName}`);
      return null;
    }
    
    // Pegar o primeiro resultado (mais relevante)
    const food = foods[0];
    console.log(`✅ Encontrado: ${food.description}`);
    
    // Extrair nutrientes
    const nutrients = extractNutrients(food, quantity);
    
    return nutrients;
  } catch (error) {
    console.error('❌ Erro ao obter nutrientes:', error);
    return null;
  }
}
