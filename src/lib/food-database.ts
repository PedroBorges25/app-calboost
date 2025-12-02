// Base de dados de alimentos individuais com valores nutricionais por 100g (USDA)

export interface FoodItem {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'fats' | 'grains' | 'other';
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  fiberPer100g: number;
  defaultPortion: number; // gramas
  emoji: string;
  source?: 'local' | 'usda'; // Para identificar origem
}

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

// API Key do USDA - CONFIGURAR NAS VARIÁVEIS DE AMBIENTE
const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || 'DEMO_KEY';

// Cache para resultados da API
const apiCache = new Map<string, USDAFoodItem[]>();

export const FOOD_DATABASE: FoodItem[] = [
  // PROTEÍNAS (EXPANDIDO)
  {
    id: 'chicken-breast',
    name: 'Peito de Frango',
    category: 'protein',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatsPer100g: 3.6,
    fiberPer100g: 0,
    defaultPortion: 150,
    emoji: '🍗',
    source: 'local'
  },
  {
    id: 'salmon',
    name: 'Salmão',
    category: 'protein',
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatsPer100g: 13,
    fiberPer100g: 0,
    defaultPortion: 150,
    emoji: '🐟',
    source: 'local'
  },
  {
    id: 'beef',
    name: 'Bife de Vaca',
    category: 'protein',
    caloriesPer100g: 250,
    proteinPer100g: 26,
    carbsPer100g: 0,
    fatsPer100g: 15,
    fiberPer100g: 0,
    defaultPortion: 150,
    emoji: '🥩',
    source: 'local'
  },
  {
    id: 'tuna',
    name: 'Atum',
    category: 'protein',
    caloriesPer100g: 132,
    proteinPer100g: 28,
    carbsPer100g: 0,
    fatsPer100g: 1.3,
    fiberPer100g: 0,
    defaultPortion: 100,
    emoji: '🐟',
    source: 'local'
  },
  {
    id: 'cod',
    name: 'Bacalhau',
    category: 'protein',
    caloriesPer100g: 82,
    proteinPer100g: 18,
    carbsPer100g: 0,
    fatsPer100g: 0.7,
    fiberPer100g: 0,
    defaultPortion: 150,
    emoji: '🐟',
    source: 'local'
  },
  {
    id: 'eggs',
    name: 'Ovos',
    category: 'protein',
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatsPer100g: 11,
    fiberPer100g: 0,
    defaultPortion: 100,
    emoji: '🥚',
    source: 'local'
  },
  {
    id: 'turkey',
    name: 'Peru',
    category: 'protein',
    caloriesPer100g: 135,
    proteinPer100g: 30,
    carbsPer100g: 0,
    fatsPer100g: 1,
    fiberPer100g: 0,
    defaultPortion: 150,
    emoji: '🦃',
    source: 'local'
  },
  {
    id: 'pork',
    name: 'Porco',
    category: 'protein',
    caloriesPer100g: 143,
    proteinPer100g: 21,
    carbsPer100g: 0,
    fatsPer100g: 6,
    fiberPer100g: 0,
    defaultPortion: 150,
    emoji: '🥓',
    source: 'local'
  },
  {
    id: 'shrimp',
    name: 'Camarão',
    category: 'protein',
    caloriesPer100g: 85,
    proteinPer100g: 20,
    carbsPer100g: 0.9,
    fatsPer100g: 0.5,
    fiberPer100g: 0,
    defaultPortion: 100,
    emoji: '🦐',
    source: 'local'
  },

  // CARBOIDRATOS (EXPANDIDO)
  {
    id: 'white-rice',
    name: 'Arroz Branco',
    category: 'grains',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatsPer100g: 0.3,
    fiberPer100g: 0.4,
    defaultPortion: 150,
    emoji: '🍚',
    source: 'local'
  },
  {
    id: 'brown-rice',
    name: 'Arroz Integral',
    category: 'grains',
    caloriesPer100g: 112,
    proteinPer100g: 2.6,
    carbsPer100g: 24,
    fatsPer100g: 0.9,
    fiberPer100g: 1.8,
    defaultPortion: 150,
    emoji: '🍚',
    source: 'local'
  },
  {
    id: 'pasta',
    name: 'Massa',
    category: 'grains',
    caloriesPer100g: 131,
    proteinPer100g: 5,
    carbsPer100g: 25,
    fatsPer100g: 1.1,
    fiberPer100g: 1.8,
    defaultPortion: 100,
    emoji: '🍝',
    source: 'local'
  },
  {
    id: 'potato',
    name: 'Batata',
    category: 'carbs',
    caloriesPer100g: 77,
    proteinPer100g: 2,
    carbsPer100g: 17,
    fatsPer100g: 0.1,
    fiberPer100g: 2.1,
    defaultPortion: 200,
    emoji: '🥔',
    source: 'local'
  },
  {
    id: 'sweet-potato',
    name: 'Batata Doce',
    category: 'carbs',
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20,
    fatsPer100g: 0.1,
    fiberPer100g: 3,
    defaultPortion: 200,
    emoji: '🍠',
    source: 'local'
  },
  {
    id: 'bread',
    name: 'Pão Integral',
    category: 'grains',
    caloriesPer100g: 247,
    proteinPer100g: 13,
    carbsPer100g: 41,
    fatsPer100g: 3.4,
    fiberPer100g: 7,
    defaultPortion: 50,
    emoji: '🍞',
    source: 'local'
  },
  {
    id: 'oats',
    name: 'Aveia',
    category: 'grains',
    caloriesPer100g: 389,
    proteinPer100g: 17,
    carbsPer100g: 66,
    fatsPer100g: 7,
    fiberPer100g: 11,
    defaultPortion: 50,
    emoji: '🌾',
    source: 'local'
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    category: 'grains',
    caloriesPer100g: 368,
    proteinPer100g: 14,
    carbsPer100g: 64,
    fatsPer100g: 6,
    fiberPer100g: 7,
    defaultPortion: 50,
    emoji: '🌾',
    source: 'local'
  },
  {
    id: 'couscous',
    name: 'Cuscuz',
    category: 'grains',
    caloriesPer100g: 112,
    proteinPer100g: 3.8,
    carbsPer100g: 23,
    fatsPer100g: 0.2,
    fiberPer100g: 1.4,
    defaultPortion: 50,
    emoji: '🌾',
    source: 'local'
  },

  // VEGETAIS (EXPANDIDO)
  {
    id: 'broccoli',
    name: 'Brócolos',
    category: 'vegetables',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatsPer100g: 0.4,
    fiberPer100g: 2.6,
    defaultPortion: 100,
    emoji: '🥦',
    source: 'local'
  },
  {
    id: 'lettuce',
    name: 'Alface',
    category: 'vegetables',
    caloriesPer100g: 15,
    proteinPer100g: 1.4,
    carbsPer100g: 2.9,
    fatsPer100g: 0.2,
    fiberPer100g: 1.3,
    defaultPortion: 50,
    emoji: '🥬',
    source: 'local'
  },
  {
    id: 'tomato',
    name: 'Tomate',
    category: 'vegetables',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatsPer100g: 0.2,
    fiberPer100g: 1.2,
    defaultPortion: 100,
    emoji: '🍅',
    source: 'local'
  },
  {
    id: 'carrot',
    name: 'Cenoura',
    category: 'vegetables',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 10,
    fatsPer100g: 0.2,
    fiberPer100g: 2.8,
    defaultPortion: 100,
    emoji: '🥕',
    source: 'local'
  },
  {
    id: 'spinach',
    name: 'Espinafres',
    category: 'vegetables',
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatsPer100g: 0.4,
    fiberPer100g: 2.2,
    defaultPortion: 100,
    emoji: '🥬',
    source: 'local'
  },
  {
    id: 'green-beans',
    name: 'Feijão Verde',
    category: 'vegetables',
    caloriesPer100g: 31,
    proteinPer100g: 1.8,
    carbsPer100g: 7,
    fatsPer100g: 0.2,
    fiberPer100g: 2.7,
    defaultPortion: 100,
    emoji: '🫘',
    source: 'local'
  },
  {
    id: 'cucumber',
    name: 'Pepino',
    category: 'vegetables',
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatsPer100g: 0.1,
    fiberPer100g: 0.5,
    defaultPortion: 100,
    emoji: '🥒',
    source: 'local'
  },
  {
    id: 'bell-pepper',
    name: 'Pimento',
    category: 'vegetables',
    caloriesPer100g: 31,
    proteinPer100g: 1,
    carbsPer100g: 7,
    fatsPer100g: 0.3,
    fiberPer100g: 2.5,
    defaultPortion: 100,
    emoji: '🫑',
    source: 'local'
  },
  {
    id: 'zucchini',
    name: 'Abobrinha',
    category: 'vegetables',
    caloriesPer100g: 17,
    proteinPer100g: 1.2,
    carbsPer100g: 3.1,
    fatsPer100g: 0.3,
    fiberPer100g: 1,
    defaultPortion: 100,
    emoji: '🥒',
    source: 'local'
  },
  {
    id: 'onion',
    name: 'Cebola',
    category: 'vegetables',
    caloriesPer100g: 40,
    proteinPer100g: 1.1,
    carbsPer100g: 9.3,
    fatsPer100g: 0.1,
    fiberPer100g: 1.7,
    defaultPortion: 50,
    emoji: '🧅',
    source: 'local'
  },
  {
    id: 'garlic',
    name: 'Alho',
    category: 'vegetables',
    caloriesPer100g: 149,
    proteinPer100g: 6.4,
    carbsPer100g: 33,
    fatsPer100g: 0.5,
    fiberPer100g: 2.1,
    defaultPortion: 5,
    emoji: '🧄',
    source: 'local'
  },

  // FRUTAS (EXPANDIDO)
  {
    id: 'banana',
    name: 'Banana',
    category: 'fruits',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatsPer100g: 0.3,
    fiberPer100g: 2.6,
    defaultPortion: 120,
    emoji: '🍌',
    source: 'local'
  },
  {
    id: 'apple',
    name: 'Maçã',
    category: 'fruits',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 14,
    fatsPer100g: 0.2,
    fiberPer100g: 2.4,
    defaultPortion: 150,
    emoji: '🍎',
    source: 'local'
  },
  {
    id: 'orange',
    name: 'Laranja',
    category: 'fruits',
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 12,
    fatsPer100g: 0.1,
    fiberPer100g: 2.4,
    defaultPortion: 130,
    emoji: '🍊',
    source: 'local'
  },
  {
    id: 'strawberry',
    name: 'Morangos',
    category: 'fruits',
    caloriesPer100g: 32,
    proteinPer100g: 0.7,
    carbsPer100g: 8,
    fatsPer100g: 0.3,
    fiberPer100g: 2,
    defaultPortion: 100,
    emoji: '🍓',
    source: 'local'
  },
  {
    id: 'grapes',
    name: 'Uvas',
    category: 'fruits',
    caloriesPer100g: 69,
    proteinPer100g: 0.7,
    carbsPer100g: 18,
    fatsPer100g: 0.2,
    fiberPer100g: 0.9,
    defaultPortion: 100,
    emoji: '🍇',
    source: 'local'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    category: 'fruits',
    caloriesPer100g: 61,
    proteinPer100g: 1.1,
    carbsPer100g: 15,
    fatsPer100g: 0.5,
    fiberPer100g: 3.1,
    defaultPortion: 100,
    emoji: '🥝',
    source: 'local'
  },
  {
    id: 'pineapple',
    name: 'Ananás',
    category: 'fruits',
    caloriesPer100g: 50,
    proteinPer100g: 0.5,
    carbsPer100g: 13,
    fatsPer100g: 0.1,
    fiberPer100g: 1.4,
    defaultPortion: 150,
    emoji: '🍍',
    source: 'local'
  },
  {
    id: 'watermelon',
    name: 'Melancia',
    category: 'fruits',
    caloriesPer100g: 30,
    proteinPer100g: 0.6,
    carbsPer100g: 8,
    fatsPer100g: 0.2,
    fiberPer100g: 0.4,
    defaultPortion: 200,
    emoji: '🍉',
    source: 'local'
  },

  // LATICÍNIOS (EXPANDIDO)
  {
    id: 'yogurt',
    name: 'Iogurte Natural',
    category: 'dairy',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatsPer100g: 0.4,
    fiberPer100g: 0,
    defaultPortion: 125,
    emoji: '🥛',
    source: 'local'
  },
  {
    id: 'milk',
    name: 'Leite',
    category: 'dairy',
    caloriesPer100g: 42,
    proteinPer100g: 3.4,
    carbsPer100g: 5,
    fatsPer100g: 1,
    fiberPer100g: 0,
    defaultPortion: 200,
    emoji: '🥛',
    source: 'local'
  },
  {
    id: 'cheese',
    name: 'Queijo',
    category: 'dairy',
    caloriesPer100g: 402,
    proteinPer100g: 25,
    carbsPer100g: 1.3,
    fatsPer100g: 33,
    fiberPer100g: 0,
    defaultPortion: 30,
    emoji: '🧀',
    source: 'local'
  },
  {
    id: 'cottage-cheese',
    name: 'Queijo Fresco',
    category: 'dairy',
    caloriesPer100g: 98,
    proteinPer100g: 11,
    carbsPer100g: 3.4,
    fatsPer100g: 4.3,
    fiberPer100g: 0,
    defaultPortion: 100,
    emoji: '🧀',
    source: 'local'
  },
  {
    id: 'butter',
    name: 'Manteiga',
    category: 'dairy',
    caloriesPer100g: 717,
    proteinPer100g: 0.9,
    carbsPer100g: 0.1,
    fatsPer100g: 81,
    fiberPer100g: 0,
    defaultPortion: 10,
    emoji: '🧈',
    source: 'local'
  },

  // GORDURAS (EXPANDIDO)
  {
    id: 'olive-oil',
    name: 'Azeite',
    category: 'fats',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatsPer100g: 100,
    fiberPer100g: 0,
    defaultPortion: 10,
    emoji: '🫒',
    source: 'local'
  },
  {
    id: 'almonds',
    name: 'Amêndoas',
    category: 'fats',
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatsPer100g: 50,
    fiberPer100g: 12,
    defaultPortion: 30,
    emoji: '🥜',
    source: 'local'
  },
  {
    id: 'walnuts',
    name: 'Nozes',
    category: 'fats',
    caloriesPer100g: 654,
    proteinPer100g: 15,
    carbsPer100g: 14,
    fatsPer100g: 65,
    fiberPer100g: 7,
    defaultPortion: 30,
    emoji: '🥜',
    source: 'local'
  },
  {
    id: 'avocado',
    name: 'Abacate',
    category: 'fats',
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 9,
    fatsPer100g: 15,
    fiberPer100g: 7,
    defaultPortion: 100,
    emoji: '🥑',
    source: 'local'
  },
  {
    id: 'peanut-butter',
    name: 'Manteiga de Amendoim',
    category: 'fats',
    caloriesPer100g: 588,
    proteinPer100g: 25,
    carbsPer100g: 20,
    fatsPer100g: 50,
    fiberPer100g: 6,
    defaultPortion: 20,
    emoji: '🥜',
    source: 'local'
  },

  // LEGUMINOSAS (EXPANDIDO)
  {
    id: 'chickpeas',
    name: 'Grão-de-Bico',
    category: 'carbs',
    caloriesPer100g: 164,
    proteinPer100g: 9,
    carbsPer100g: 27,
    fatsPer100g: 2.6,
    fiberPer100g: 7.6,
    defaultPortion: 100,
    emoji: '🫘',
    source: 'local'
  },
  {
    id: 'lentils',
    name: 'Lentilhas',
    category: 'carbs',
    caloriesPer100g: 116,
    proteinPer100g: 9,
    carbsPer100g: 20,
    fatsPer100g: 0.4,
    fiberPer100g: 7.9,
    defaultPortion: 100,
    emoji: '🫘',
    source: 'local'
  },
  {
    id: 'beans',
    name: 'Feijão',
    category: 'carbs',
    caloriesPer100g: 127,
    proteinPer100g: 9,
    carbsPer100g: 23,
    fatsPer100g: 0.5,
    fiberPer100g: 6.4,
    defaultPortion: 100,
    emoji: '🫘',
    source: 'local'
  },
  {
    id: 'peas',
    name: 'Ervilhas',
    category: 'vegetables',
    caloriesPer100g: 81,
    proteinPer100g: 5.4,
    carbsPer100g: 14,
    fatsPer100g: 0.4,
    fiberPer100g: 5.7,
    defaultPortion: 100,
    emoji: '🫘',
    source: 'local'
  },

  // OUTROS ALIMENTOS COMUNS
  {
    id: 'honey',
    name: 'Mel',
    category: 'other',
    caloriesPer100g: 304,
    proteinPer100g: 0.3,
    carbsPer100g: 82,
    fatsPer100g: 0,
    fiberPer100g: 0.2,
    defaultPortion: 15,
    emoji: '🍯',
    source: 'local'
  },
  {
    id: 'dark-chocolate',
    name: 'Chocolate Preto',
    category: 'other',
    caloriesPer100g: 546,
    proteinPer100g: 7.8,
    carbsPer100g: 45,
    fatsPer100g: 31,
    fiberPer100g: 10.9,
    defaultPortion: 20,
    emoji: '🍫',
    source: 'local'
  },
  {
    id: 'coffee',
    name: 'Café',
    category: 'other',
    caloriesPer100g: 1,
    proteinPer100g: 0.1,
    carbsPer100g: 0,
    fatsPer100g: 0,
    fiberPer100g: 0,
    defaultPortion: 200,
    emoji: '☕',
    source: 'local'
  }
];

// Função para pesquisar alimentos (local + API)
export async function searchFoods(query: string): Promise<FoodItem[]> {
  const lowerQuery = query.toLowerCase();

  // Primeiro, busca na base local
  const localResults = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowerQuery)
  );

  // Se encontrou resultados locais suficientes, retorna
  if (localResults.length >= 5) {
    return localResults;
  }

  // Se não tem API key configurada, retorna apenas locais
  if (!USDA_API_KEY || USDA_API_KEY === 'DEMO_KEY') {
    return localResults;
  }

  try {
    // Verifica cache
    if (apiCache.has(lowerQuery)) {
      const cachedResults = apiCache.get(lowerQuery)!;
      const usdaFoods = cachedResults.map(usdaToFoodItem);
      return [...localResults, ...usdaFoods];
    }

    // Busca na API USDA
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`
    );

    if (!response.ok) {
      console.warn('USDA API error:', response.status);
      return localResults;
    }

    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
      return localResults;
    }

    // Converte resultados da API para FoodItem
    const usdaFoods: FoodItem[] = data.foods
      .filter((food: any) => food.foodNutrients && food.foodNutrients.length > 0)
      .map((food: any) => usdaToFoodItem(food))
      .filter((food: FoodItem) => food.caloriesPer100g > 0); // Filtra alimentos sem dados

    // Cache dos resultados
    apiCache.set(lowerQuery, data.foods);

    return [...localResults, ...usdaFoods];

  } catch (error) {
    console.error('Erro ao buscar na API USDA:', error);
    return localResults;
  }
}

// Converte item da API USDA para FoodItem
function usdaToFoodItem(usdaFood: any): FoodItem {
  // Extrai nutrientes
  const nutrients = usdaFood.foodNutrients || [];

  const getNutrientValue = (nutrientId: number) => {
    const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : 0;
  };

  return {
    id: `usda-${usdaFood.fdcId}`,
    name: usdaFood.description,
    category: 'other', // Categorização básica
    caloriesPer100g: Math.round(getNutrientValue(1008)), // Energy
    proteinPer100g: Math.round(getNutrientValue(1003) * 10) / 10, // Protein
    carbsPer100g: Math.round(getNutrientValue(1005) * 10) / 10, // Carbohydrate
    fatsPer100g: Math.round(getNutrientValue(1004) * 10) / 10, // Total lipid
    fiberPer100g: Math.round(getNutrientValue(1079) * 10) / 10, // Fiber
    defaultPortion: 100,
    emoji: '🍽️',
    source: 'usda'
  };
}

// Função para obter alimentos por categoria
export function getFoodsByCategory(category: FoodItem['category']): FoodItem[] {
  return FOOD_DATABASE.filter(food => food.category === category);
}

// Função para calcular valores nutricionais baseado em gramas
export function calculateNutrition(food: FoodItem, grams: number) {
  const multiplier = grams / 100;
  return {
    calories: Math.round(food.caloriesPer100g * multiplier),
    protein: Math.round(food.proteinPer100g * multiplier * 10) / 10,
    carbs: Math.round(food.carbsPer100g * multiplier * 10) / 10,
    fats: Math.round(food.fatsPer100g * multiplier * 10) / 10,
    fiber: Math.round(food.fiberPer100g * multiplier * 10) / 10
  };
}

// Função para obter sugestões de alimentos populares
export function getPopularFoods(): FoodItem[] {
  return FOOD_DATABASE.slice(0, 10); // Primeiros 10 alimentos
}