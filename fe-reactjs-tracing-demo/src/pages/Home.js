import React from 'react';
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
// OpenTelemetry Import
import { startOtelInstrumentation } from '../opentelemetry'

const HandleApiCall = event => {
  event.preventDefault();
    axios({
      method: 'get',
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem('keycloak-token')}`
      },
      url: `${process.env.REACT_APP_PUBLIC_BE_URL}/api/outgoing-http-call`
    })
}

const Home = () => {
  const { keycloak } = useKeycloak();

  if (keycloak.authenticated) {
    localStorage.setItem('keycloak-token', keycloak.token);
    startOtelInstrumentation();
  } else {
    localStorage.removeItem('keycloak-token');
  }
  
  return (
    <div>
      <h1>Welcome to Tracing Page</h1>
      {!keycloak.authenticated && (
        <button type="button" onClick={() => keycloak.login()} >
          Login
        </button>
      )}
      {keycloak.authenticated && (
        <div>
          <button type="button" onClick={() => keycloak.logout()}>
            Logout ({keycloak.tokenParsed.preferred_username})
          </button>
          <form onSubmit={HandleApiCall}>
            <button type="submit">Trace</button>
          </form>
        </div>
      )}
      
    </div>
  );
};

export default Home;