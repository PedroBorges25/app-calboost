import { NextRequest, NextResponse } from 'next/server';
import { searchUSDAFood, getFoodNutrients } from '@/lib/usda';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const quantity = parseInt(searchParams.get('quantity') || '100');

    if (!query) {
      return NextResponse.json(
        { error: 'Parâmetro "query" é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`🔍 Pesquisando USDA: ${query} (${quantity}g)`);

    // Pesquisar alimentos
    const foods = await searchUSDAFood(query, 5);

    if (foods.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum alimento encontrado', foods: [] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      query,
      quantity,
      foods: foods.map(food => ({
        fdcId: food.fdcId,
        description: food.description,
        dataType: food.dataType
      }))
    });

  } catch (error) {
    console.error('❌ Erro na API USDA:', error);
    
    return NextResponse.json(
      { error: 'Erro ao pesquisar alimentos na USDA' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { foodName, quantity = 100 } = body;

    if (!foodName) {
      return NextResponse.json(
        { error: 'Parâmetro "foodName" é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`🍽️ Obtendo nutrientes: ${foodName} (${quantity}g)`);

    // Obter nutrientes
    const nutrients = await getFoodNutrients(foodName, quantity);

    if (!nutrients) {
      return NextResponse.json(
        { error: 'Não foi possível obter nutrientes para este alimento' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      foodName,
      quantity,
      nutrients
    });

  } catch (error) {
    console.error('❌ Erro ao obter nutrientes:', error);
    
    return NextResponse.json(
      { error: 'Erro ao obter dados nutricionais' },
      { status: 500 }
    );
  }
}
