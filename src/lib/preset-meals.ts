// Biblioteca de refeições portuguesas comuns com valores nutricionais precisos da USDA

export interface PresetMeal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  portion: string;
  foodItems: string[];
}

export const PRESET_MEALS: PresetMeal[] = [
  // PEQUENO-ALMOÇO
  {
    id: 'breakfast-1',
    name: 'Torradas com Manteiga e Café',
    category: 'breakfast',
    description: '2 torradas integrais com manteiga e café com leite',
    calories: 285,
    protein: 8,
    carbs: 35,
    fats: 12,
    fiber: 4,
    portion: '2 torradas + café',
    foodItems: ['Pão integral', 'Manteiga', 'Café', 'Leite']
  },
  {
    id: 'breakfast-2',
    name: 'Iogurte com Granola e Fruta',
    category: 'breakfast',
    description: 'Iogurte natural com granola e banana',
    calories: 320,
    protein: 12,
    carbs: 48,
    fats: 9,
    fiber: 5,
    portion: '1 tigela',
    foodItems: ['Iogurte natural', 'Granola', 'Banana']
  },
  {
    id: 'breakfast-3',
    name: 'Ovos Mexidos com Pão',
    category: 'breakfast',
    description: '2 ovos mexidos com 2 fatias de pão integral',
    calories: 340,
    protein: 18,
    carbs: 28,
    fats: 16,
    fiber: 4,
    portion: '2 ovos + 2 fatias',
    foodItems: ['Ovos', 'Pão integral', 'Azeite']
  },
  {
    id: 'breakfast-4',
    name: 'Aveia com Leite e Frutos Secos',
    category: 'breakfast',
    description: 'Papas de aveia com leite, mel e amêndoas',
    calories: 380,
    protein: 14,
    carbs: 52,
    fats: 13,
    fiber: 7,
    portion: '1 tigela',
    foodItems: ['Aveia', 'Leite', 'Mel', 'Amêndoas']
  },

  // ALMOÇO
  {
    id: 'lunch-1',
    name: 'Frango Grelhado com Arroz e Salada',
    category: 'lunch',
    description: '150g de peito de frango grelhado, arroz branco e salada mista',
    calories: 485,
    protein: 42,
    carbs: 58,
    fats: 8,
    fiber: 4,
    portion: '1 prato',
    foodItems: ['Frango grelhado', 'Arroz branco', 'Alface', 'Tomate', 'Cenoura']
  },
  {
    id: 'lunch-2',
    name: 'Salmão Grelhado com Batata Doce',
    category: 'lunch',
    description: '150g de salmão grelhado com batata doce assada e brócolos',
    calories: 520,
    protein: 38,
    carbs: 45,
    fats: 18,
    fiber: 7,
    portion: '1 prato',
    foodItems: ['Salmão grelhado', 'Batata doce', 'Brócolos']
  },
  {
    id: 'lunch-3',
    name: 'Massa com Atum e Tomate',
    category: 'lunch',
    description: 'Massa integral com atum, molho de tomate e vegetais',
    calories: 465,
    protein: 28,
    carbs: 62,
    fats: 12,
    fiber: 8,
    portion: '1 prato',
    foodItems: ['Massa integral', 'Atum', 'Tomate', 'Cebola', 'Azeite']
  },
  {
    id: 'lunch-4',
    name: 'Bacalhau com Grão e Espinafres',
    category: 'lunch',
    description: 'Bacalhau cozido com grão-de-bico e espinafres salteados',
    calories: 445,
    protein: 36,
    carbs: 42,
    fats: 14,
    fiber: 9,
    portion: '1 prato',
    foodItems: ['Bacalhau', 'Grão-de-bico', 'Espinafres', 'Azeite']
  },
  {
    id: 'lunch-5',
    name: 'Bife de Vaca com Arroz Integral',
    category: 'lunch',
    description: '150g de bife de vaca grelhado com arroz integral e feijão verde',
    calories: 510,
    protein: 40,
    carbs: 48,
    fats: 16,
    fiber: 6,
    portion: '1 prato',
    foodItems: ['Bife de vaca', 'Arroz integral', 'Feijão verde']
  },

  // JANTAR
  {
    id: 'dinner-1',
    name: 'Sopa de Legumes com Pão',
    category: 'dinner',
    description: 'Sopa de legumes caseira com 2 fatias de pão integral',
    calories: 280,
    protein: 10,
    carbs: 48,
    fats: 6,
    fiber: 8,
    portion: '1 tigela + 2 fatias',
    foodItems: ['Cenoura', 'Batata', 'Couve', 'Feijão verde', 'Pão integral']
  },
  {
    id: 'dinner-2',
    name: 'Omelete com Salada',
    category: 'dinner',
    description: 'Omelete de 3 ovos com queijo e salada mista',
    calories: 380,
    protein: 26,
    carbs: 12,
    fats: 26,
    fiber: 3,
    portion: '1 omelete + salada',
    foodItems: ['Ovos', 'Queijo', 'Alface', 'Tomate', 'Pepino']
  },
  {
    id: 'dinner-3',
    name: 'Frango Estufado com Arroz',
    category: 'dinner',
    description: 'Frango estufado com cenoura, arroz branco e salada',
    calories: 465,
    protein: 38,
    carbs: 52,
    fats: 10,
    fiber: 5,
    portion: '1 prato',
    foodItems: ['Frango estufado', 'Cenoura', 'Arroz branco', 'Alface']
  },
  {
    id: 'dinner-4',
    name: 'Peixe Cozido com Batata',
    category: 'dinner',
    description: 'Pescada cozida com batata e legumes',
    calories: 395,
    protein: 32,
    carbs: 44,
    fats: 8,
    fiber: 6,
    portion: '1 prato',
    foodItems: ['Pescada', 'Batata', 'Cenoura', 'Brócolos']
  },

  // LANCHES
  {
    id: 'snack-1',
    name: 'Fruta com Iogurte',
    category: 'snack',
    description: 'Maçã ou banana com iogurte natural',
    calories: 180,
    protein: 6,
    carbs: 32,
    fats: 3,
    fiber: 4,
    portion: '1 fruta + iogurte',
    foodItems: ['Maçã', 'Iogurte natural']
  },
  {
    id: 'snack-2',
    name: 'Sanduíche de Queijo e Fiambre',
    category: 'snack',
    description: 'Sanduíche de pão integral com queijo e fiambre de peru',
    calories: 285,
    protein: 16,
    carbs: 32,
    fats: 10,
    fiber: 4,
    portion: '1 sanduíche',
    foodItems: ['Pão integral', 'Queijo', 'Fiambre de peru']
  },
  {
    id: 'snack-3',
    name: 'Mix de Frutos Secos',
    category: 'snack',
    description: 'Amêndoas, nozes e passas (30g)',
    calories: 165,
    protein: 5,
    carbs: 14,
    fats: 11,
    fiber: 3,
    portion: '1 mão cheia',
    foodItems: ['Amêndoas', 'Nozes', 'Passas']
  },
  {
    id: 'snack-4',
    name: 'Torrada com Queijo Fresco',
    category: 'snack',
    description: '2 torradas integrais com queijo fresco e tomate',
    calories: 195,
    protein: 12,
    carbs: 26,
    fats: 5,
    fiber: 4,
    portion: '2 torradas',
    foodItems: ['Pão integral', 'Queijo fresco', 'Tomate']
  },
  {
    id: 'snack-5',
    name: 'Batido de Proteína',
    category: 'snack',
    description: 'Batido com leite, banana e proteína whey',
    calories: 245,
    protein: 22,
    carbs: 28,
    fats: 5,
    fiber: 2,
    portion: '1 copo',
    foodItems: ['Leite', 'Banana', 'Proteína whey']
  }
];

// Função para obter refeições por categoria
export function getMealsByCategory(category: PresetMeal['category']): PresetMeal[] {
  return PRESET_MEALS.filter(meal => meal.category === category);
}

// Função para obter uma refeição por ID
export function getMealById(id: string): PresetMeal | undefined {
  return PRESET_MEALS.find(meal => meal.id === id);
}

// Função para pesquisar refeições por nome
export function searchMeals(query: string): PresetMeal[] {
  const lowerQuery = query.toLowerCase();
  return PRESET_MEALS.filter(meal => 
    meal.name.toLowerCase().includes(lowerQuery) ||
    meal.description.toLowerCase().includes(lowerQuery) ||
    meal.foodItems.some(item => item.toLowerCase().includes(lowerQuery))
  );
}
