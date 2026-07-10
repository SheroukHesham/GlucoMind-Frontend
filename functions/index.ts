import {IDayPlan} from '../interfaces';

export const transformDayPlanToMeals = (dayPlan: IDayPlan) => {
  if (!dayPlan || typeof dayPlan !== 'object') {
    return [];
  }
  return Object.entries(dayPlan).map(([key, value]) => {
    const title =
      value.title ||
      key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return {
      id: value._id?.$oid || key,
      title,
      cookTime:
        value.estimated_cooking_time ||
        estimateCookTimeFromInstructions(value.instructions),
      calories: value.total_calories || value.estimated_total_calories || 0,
      caloriePercentage: value.calorie_percentage,
      instructions: value.instructions,
      items: value.items || [],
      beverages:
        Array.isArray(value.beverages) && value.beverages.length > 0
          ? value.beverages
          : ['None'],
      glucoseImpact: value.glucose_impact,
      nutritionalFacts: value.nutritional_facts,
    };
  });
};

const estimateCookTimeFromInstructions = (instructions = '') => {
  const timeMatch = instructions.match(/(\d+)\s*minutes?/i);
  return timeMatch ? `~${timeMatch[1]} mins` : '~10 mins';
};
