import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getRecipe } from '@/services/geminiAI/get-recipe';
import { getNutrition } from '@/services/spoonacular/get-nutrients';
import { getRecipeImage } from '@/services/serpAPI/get-image';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    const { ingredients } = await req.json();


    const response = await getRecipe(ingredients);
    const nutrition = await getNutrition(response.ingredients);
    const images = await getRecipeImage(response.title);

    const data = {
        text: ingredients.join(';'),
        geminiAI: response,
        nutrition: nutrition,
        images: images,
    }


    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Erro interno no servidor',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}