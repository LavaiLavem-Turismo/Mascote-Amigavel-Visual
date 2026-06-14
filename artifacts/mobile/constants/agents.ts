import type { ImageSourcePropType } from "react-native";

export type AgentId = "lala" | "mama" | "papa";

export interface AgentDef {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  color: string;
  colorRgb: string;
  gradient: [string, string];
  image: ImageSourcePropType;
  welcomeText: string;
  welcomeChips: string[];
}

export const AGENTS: AgentDef[] = [
  {
    id: "lala",
    name: "Lala",
    role: "Passeios",
    tagline: "Sua guia de aventuras em Natal!",
    color: "#1E90FF",
    colorRgb: "30,144,255",
    gradient: ["#1E90FF", "#0a7acc"],
    image: require("@/assets/images/lala.png"),
    welcomeText:
      "Oi oi oi! Sou a Lala! Conta pra mim: qual é o estilo da sua turma — aventura nas dunas, mergulho no mar ou conhecer a cidade histórica?",
    welcomeChips: ["Aventura nas dunas", "Praias e mergulho", "City Tour Natal"],
  },
  {
    id: "mama",
    name: "Mamãe Lara",
    role: "Financeiro",
    tagline: "Preços, pagamento e reservas!",
    color: "#e91e8c",
    colorRgb: "233,30,140",
    gradient: ["#e91e8c", "#c2185b"],
    image: require("@/assets/images/mama.png"),
    welcomeText:
      "Bem-vindo à nossa família! Sou a Mamãe Lara, cuido de tudo que é financeiro. Quer saber preços, formas de pagamento ou política de cancelamento?",
    welcomeChips: ["Preços dos passeios", "Formas de pagamento", "Cancelamento"],
  },
  {
    id: "papa",
    name: "Papai Lalo",
    role: "Suporte",
    tagline: "Problema? Aqui a gente resolve!",
    color: "#00d4aa",
    colorRgb: "0,212,170",
    gradient: ["#00d4aa", "#00a884"],
    image: require("@/assets/images/papa.png"),
    welcomeText:
      "Eaê! Papai Lalo na área! Se tá com algum problema, dúvida ou precisando resolver algo, pode falar comigo. Vou dar um jeito!",
    welcomeChips: ["Tive um problema", "Falar com atendente", "Tenho uma dúvida"],
  },
];
