
import React from 'react';
import { 
  Utensils, 
  Home, 
  Car, 
  Zap, 
  GraduationCap, 
  Gamepad2, 
  ShoppingBag, 
  HeartPulse, 
  Wallet,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  { name: 'Food', icon: <Utensils className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
  { name: 'Rent', icon: <Home className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  { name: 'Travel', icon: <Car className="w-4 h-4" />, color: 'bg-green-100 text-green-600' },
  { name: 'Bills', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Education', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
  { name: 'Entertainment', icon: <Gamepad2 className="w-4 h-4" />, color: 'bg-pink-100 text-pink-600' },
  { name: 'Shopping', icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-rose-100 text-rose-600' },
  { name: 'Health', icon: <HeartPulse className="w-4 h-4" />, color: 'bg-red-100 text-red-600' },
  { name: 'Other', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600' },
];

export const INCOME_CATEGORIES = [
  { name: 'Salary', icon: <Wallet className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Freelance', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-teal-100 text-teal-600' },
  { name: 'Other Income', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600' },
];

export const CURRENCY_SYMBOL = '₹';
