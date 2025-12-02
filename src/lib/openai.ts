import OpenAI from 'openai';
import { getFoodNutrients, translateFoodTerms } from './usda';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MealAnalysis {
  foodItems: string[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  confidence: number;
  description: string;
  usdaSource?: boolean;
}

export interface ExtractedFood {
  name: string;
  quantity: number;
  unit: string;
}

/**
 * Extrair alimentos e quantidades de uma descrição usando IA
 */
async function extractFoodsFromDescription(description: string): Promise<ExtractedFood[]> {
  try {
    console.log('🤖 Extraindo alimentos da descrição com IA...');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um assistente especializado em nutrição. Extraia todos os alimentos mencionados na descrição do utilizador e estime quantidades realistas em gramas.

Retorne um JSON com array "foods" contendo objetos com:
- name: nome do alimento (mantenha em português)
- quantity: quantidade estimada em gramas (número)
- unit: sempre "g" para gramas

Se o utilizador não especificar quantidade, use porções típicas:
- Frango/carne: 150g
- Arroz/massa: 150g
- Batata: 200g
- Vegetais: 100g
- Peixe: 150g

Exemplo de resposta:
{
  "foods": [
    {"name": "frango estufado", "quantity": 150, "unit": "g"},
    {"name": "arroz branco", "quantity": 150, "unit": "g"}
  ]
}

Retorne APENAS o JSON, sem texto adicional.`
        },
        {
          role: "user",
          content: description
        }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    const parsed = JSON.parse(content);
    console.log('✅ Alimentos extraídos:', parsed.foods);
    
    return parsed.foods || [];
  } catch (error) {
    console.error('❌ Erro ao extrair alimentos:', error);
    throw error;
  }
}

/**
 * Calcular nutrientes totais usando USDA FoodData Central
 */
async function calculateNutrientsWithUSDA(foods: ExtractedFood[]): Promise<{
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  foodItems: string[];
}> {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;
  const foodItems: string[] = [];

  console.log('🔍 Consultando USDA para cada alimento...');

  for (const food of foods) {
    try {
      // Obter nutrientes da USDA
      const nutrients = await getFoodNutrients(food.name, food.quantity);
      
      if (nutrients) {
        totalCalories += nutrients.calories;
        totalProtein += nutrients.protein;
        totalCarbs += nutrients.carbs;
        totalFats += nutrients.fats;
        totalFiber += nutrients.fiber;
        
        foodItems.push(`${food.name} (${food.quantity}${food.unit})`);
        
        console.log(`✅ ${food.name}: ${nutrients.calories} kcal`);
      } else {
        console.warn(`⚠️ Não encontrado na USDA: ${food.name}`);
        foodItems.push(`${food.name} (${food.quantity}${food.unit})`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${food.name}:`, error);
      foodItems.push(`${food.name} (${food.quantity}${food.unit})`);
    }
  }

  return {
    totalCalories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fats: Math.round(totalFats * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10,
    foodItems
  };
}

export async function analyzeMealImage(imageBase64: string): Promise<MealAnalysis> {
  try {
    // Validação da chave da API
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    console.log('Iniciando análise da imagem com OpenAI...');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de refeição e retorne um JSON com:
- foodItems: array de strings com os alimentos identificados
- totalCalories: número total estimado de calorias
- protein: gramas de proteína
- carbs: gramas de carboidratos
- fats: gramas de gorduras
- confidence: nível de confiança da análise (0-100)
- description: descrição breve da refeição

Seja preciso e realista nas estimativas. Retorne APENAS o JSON, sem texto adicional.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    console.log('Resposta recebida da OpenAI');

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('A OpenAI retornou uma resposta vazia');
    }

    // Remove markdown code blocks se existirem
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    console.log('Parseando resposta JSON...');
    const analysis = JSON.parse(cleanContent) as MealAnalysis;
    
    // Validação básica dos dados
    if (!analysis.foodItems || !Array.isArray(analysis.foodItems)) {
      throw new Error('A resposta não contém os alimentos identificados');
    }

    if (typeof analysis.totalCalories !== 'number' || analysis.totalCalories <= 0) {
      throw new Error('Calorias inválidas na resposta');
    }

    console.log('Análise concluída com sucesso:', analysis);
    return analysis;

  } catch (error) {
    console.error('Erro detalhado ao analisar imagem:', error);
    
    // Tratamento específico de erros da OpenAI
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('Chave da API OpenAI inválida ou expirada');
      } else if (error.status === 429) {
        throw new Error('Limite de requisições atingido. Tente novamente em alguns minutos');
      } else if (error.status === 400) {
        throw new Error('Imagem inválida ou muito grande. Tente uma foto menor');
      } else {
        throw new Error(`Erro da OpenAI: ${error.message}`);
      }
    }
    
    // Erro de parsing JSON
    if (error instanceof SyntaxError) {
      throw new Error('Erro ao processar resposta da IA. Tente novamente');
    }
    
    // Outros erros
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro desconhecido ao analisar a imagem');
  }
}

export async function analyzeMealDescription(description: string): Promise<MealAnalysis> {
  try {
    // Validação da chave da API
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    console.log('🎯 Iniciando análise com USDA FoodData Central...');

    // PASSO 1: Extrair alimentos e quantidades da descrição
    const extractedFoods = await extractFoodsFromDescription(description);
    
    if (extractedFoods.length === 0) {
      throw new Error('Não foi possível identificar alimentos na descrição');
    }

    // PASSO 2: Consultar USDA para obter dados nutricionais reais
    const nutrients = await calculateNutrientsWithUSDA(extractedFoods);

    // PASSO 3: Criar descrição formatada
    const formattedDescription = extractedFoods
      .map(f => `${f.name} (${f.quantity}${f.unit})`)
      .join(', ');

    const analysis: MealAnalysis = {
      foodItems: nutrients.foodItems,
      totalCalories: nutrients.totalCalories,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fats: nutrients.fats,
      fiber: nutrients.fiber,
      confidence: 85, // Confiança alta pois usamos dados reais da USDA
      description: formattedDescription,
      usdaSource: true // Indica que os dados vieram da USDA
    };

    console.log('✅ Análise concluída com dados da USDA:', analysis);
    return analysis;

  } catch (error) {
    console.error('❌ Erro ao analisar descrição:', error);
    
    // Tratamento específico de erros da OpenAI
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('Chave da API OpenAI inválida ou expirada');
      } else if (error.status === 429) {
        throw new Error('Limite de requisições atingido. Tente novamente em alguns minutos');
      } else if (error.status === 400) {
        throw new Error('Descrição inválida ou muito longa');
      } else {
        throw new Error(`Erro da OpenAI: ${error.message}`);
      }
    }
    
    // Erro de parsing JSON
    if (error instanceof SyntaxError) {
      throw new Error('Erro ao processar resposta da IA. Tente novamente');
    }
    
    // Outros erros
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro desconhecido ao analisar a descrição');
  }
}
