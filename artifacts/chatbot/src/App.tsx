import { useState } from "react";
import { AgentSelectPage } from "./pages/AgentSelectPage";
import { ChatPage } from "./pages/ChatPage";
import type { AgentDef } from "./lib/agents";

function App() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(null);

  if (selectedAgent) {
    return (
      <ChatPage
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
      />
    );
  }

  return <AgentSelectPage onSelect={setSelectedAgent} />;
}

export default App;
