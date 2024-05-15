import './App.css';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from './Keycloak.js';
import Home from "./pages/Home.js";
import { startOtelInstrumentation } from './opentelemetry'

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} onTokens={({ token }) => {
          console.log("onTokens event");
          const existingToken = localStorage.getItem('keycloak-token');
          if (existingToken !== null && keycloak.token !== localStorage.getItem('keycloak-token')) {
            localStorage.setItem('keycloak-token', keycloak.token);
            startOtelInstrumentation();
          }
        }}>
        <Home/>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
