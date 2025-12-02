import { NextRequest, NextResponse } from 'next/server';
import { analyzeMealImage, analyzeMealDescription } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, description } = body;

    // Modo 1: Análise por imagem
    if (image) {
      if (!image.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Formato de imagem inválido. Use uma imagem JPG ou PNG' },
          { status: 400 }
        );
      }

      // Verificar tamanho da imagem (base64)
      const sizeInBytes = (image.length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      if (sizeInMB > 20) {
        return NextResponse.json(
          { error: 'Imagem muito grande. Use uma foto menor que 20MB' },
          { status: 400 }
        );
      }

      console.log('Processando análise da refeição por imagem...');
      const analysis = await analyzeMealImage(image);
      return NextResponse.json(analysis);
    }

    // Modo 2: Análise por descrição (voz ou manual)
    if (description) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        return NextResponse.json(
          { error: 'Descrição inválida. Por favor, descreva sua refeição' },
          { status: 400 }
        );
      }

      console.log('Processando análise da refeição por descrição...');
      const analysis = await analyzeMealDescription(description);
      return NextResponse.json(analysis);
    }

    // Nenhum input fornecido
    return NextResponse.json(
      { error: 'Forneça uma imagem ou descrição da refeição' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erro na API de análise:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar a refeição';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
