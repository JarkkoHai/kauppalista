import { Apple, Milk, Beef } from 'lucide-react';

export const CATEGORIES = [
  { 
    id: 'hevi', 
    name: 'HeVi', 
    icon: Apple,  // ← Pelkkä komponentti, ei JSX!
    items: ['Omena', 'Banaani', 'Kurkku', 'Tomaatti', 'Porkkana', 'Sipuli'] 
  },
  { 
    id: 'maito', 
    name: 'Maitotuotteet', 
    icon: Milk, 
    items: ['Maito', 'Kaurajuoma', 'Juusto', 'Voi', 'Jogurtti', 'Rahka'] 
  },
  { 
    id: 'liha', 
    name: 'Liha & Proteiini', 
    icon: Beef, 
    items: ['Jauheliha', 'Kanafilee', 'Lohi', 'Kananmuna', 'Nakki'] 
  },
];

export const RECIPES = [
  { 
    id: 'r1', 
    name: 'Bolognese', 
    items: ['Jauheliha', 'Tomaattimurska', 'Spagetti', 'Sipuli', 'Valkosipuli'] 
  },
  { 
    id: 'r2', 
    name: 'Kanakeitto', 
    items: ['Kana', 'Keittojuurekset', 'Peruna', 'Kanaliemikuutio'] 
  },
  { 
    id: 'r3', 
    name: 'Lohipasta', 
    items: ['Lohi', 'Kerma', 'Pasta', 'Sitruuna', 'Tilli'] 
  },
];