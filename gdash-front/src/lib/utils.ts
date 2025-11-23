import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const weatherCodeMap: Record<number, string> = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro com deposição",
  51: "Chuvisco leve",
  53: "Chuvisco moderado",
  55: "Chuvisco intenso",
  56: "Chuvisco congelante leve",
  57: "Chuvisco congelante intenso",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  66: "Chuva congelante leve",
  67: "Chuva congelante forte",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Aguaceiros leves",
  81: "Aguaceiros moderados",
  82: "Aguaceiros fortes",
  85: "Aguaceiros de neve leves",
  86: "Aguaceiros de neve fortes",
  95: "Trovoada",
  96: "Trovoada com granizo leve",
  99: "Trovoada com granizo forte"
};