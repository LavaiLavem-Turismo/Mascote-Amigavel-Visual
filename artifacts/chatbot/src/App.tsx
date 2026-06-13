import { Switch, Route, Router as WouterRouter } from "wouter";
import { ChatPage } from "./pages/ChatPage";

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={ChatPage} />
        <Route component={ChatPage} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
