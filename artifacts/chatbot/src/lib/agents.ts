import lalaImg from "@assets/ChatGPT_Image_21_de_dez._de_2025,_13_03_23_1781388637862.png";
import mamaImg from "@assets/Gemini_Generated_Image_bbk739bbk739bbk7_(1)_(1)_1781444751909.png";
import papaImg from "@assets/1000003192-removebg-preview_(1)_1781444751908.png";

export type AgentId = "lala" | "mama" | "papa";

export interface AgentDef {
  id: AgentId;
  name: string;
  role: string;
  tagline: string;
  color: string;
  colorRgb: string;
  gradient: string;
  img: string;
  welcomeText: string;
  welcomeChips: string[];
  lsPrefix: string;
}

export const AGENTS: AgentDef[] = [
  {
    id: "lala",
    name: "Lala",
    role: "🦜 Passeios",
    tagline: "Sua guia de aventuras em Natal!",
    color: "#1E90FF",
    colorRgb: "30,144,255",
    gradient: "linear-gradient(135deg, #1E90FF, #0a7acc)",
    img: lalaImg,
    welcomeText: "Oi oi oi! 🦜 Sou a Lala! Conta pra mim: qual é o estilo da sua turma — aventura nas dunas, mergulho no mar ou conhecer a cidade histórica? Bora planejar juntos!",
    welcomeChips: ["🏄 Aventura", "🌊 Praia", "🏛️ História", "📋 Roteiros"],
    lsPrefix: "lala",
  },
  {
    id: "mama",
    name: "Mamãe Lara",
    role: "💰 Financeiro",
    tagline: "Preços, pagamento e reservas!",
    color: "#e91e8c",
    colorRgb: "233,30,140",
    gradient: "linear-gradient(135deg, #e91e8c, #c2185b)",
    img: mamaImg,
    welcomeText: "Bem-vindo à nossa família! 💕 Sou a Mamãe Lara, cuido de tudo que é financeiro aqui na La Vai La Vem. Quer saber preços, formas de pagamento ou política de cancelamento? Pode perguntar!",
    welcomeChips: ["💵 Preços", "💳 Formas de pagamento", "❌ Cancelamento", "🎫 Confirmar reserva"],
    lsPrefix: "mama",
  },
  {
    id: "papa",
    name: "Papai Lalo",
    role: "🛟 Suporte",
    tagline: "Problema? Aqui a gente resolve!",
    color: "#00d4aa",
    colorRgb: "0,212,170",
    gradient: "linear-gradient(135deg, #00d4aa, #00a884)",
    img: papaImg,
    welcomeText: "Eaê! 😎 Papai Lalo na área! Se tá com algum problema, dúvida ou precisando resolver algo, pode falar comigo. Vou dar um jeito, pode deixar! 🤙",
    welcomeChips: ["🆘 Tive um problema", "📞 Falar com atendente", "❓ Tenho uma dúvida", "⭐ Deixar elogio"],
    lsPrefix: "papa",
  },
];
