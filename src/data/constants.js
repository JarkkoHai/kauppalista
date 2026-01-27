import { Apple, Milk, Beef } from 'lucide-react';

export const CATEGORIES = [
  { 
    id: 'hevi', 
    nameKey: 'sidebar.categories.hevi',
    icon: Apple,
    itemKeys: ['omena', 'banaani', 'kurkku', 'tomaatti', 'porkkana', 'sipuli']
  },
  { 
    id: 'maito', 
    nameKey: 'sidebar.categories.dairy',
    icon: Milk, 
    itemKeys: ['maito', 'kaurajuoma', 'juusto', 'voi', 'jogurtti', 'rahka']
  },
  { 
    id: 'liha', 
    nameKey: 'sidebar.categories.meat',
    icon: Beef, 
    itemKeys: ['jauheliha', 'kanafilee', 'lohi', 'kananmuna', 'nakki']
  },
];

export const RECIPES = [
  { 
    id: 'r1', 
    nameKey: 'sidebar.recipeNames.bolognese',
    itemKeys: ['jauheliha', 'tomaattimurska', 'spagetti', 'sipuli', 'valkosipuli']
  },
  { 
    id: 'r2', 
    nameKey: 'sidebar.recipeNames.kanakeitto',
    itemKeys: ['kana', 'keittojuurekset', 'peruna', 'kanaliemikuutio']
  },
  { 
    id: 'r3', 
    nameKey: 'sidebar.recipeNames.lohipasta',
    itemKeys: ['lohi', 'kerma', 'pasta', 'sitruuna', 'tilli']
  },
];