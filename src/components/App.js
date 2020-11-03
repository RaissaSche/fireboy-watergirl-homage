import React, { useState } from "react";
import Cliente from "./Cliente";

//export default class App extends React.Component {
function App() {
  const [loadClient, setLoadClient] = useState(true);
  return (
    <div>
      <h2>Hello World</h2>
      {/* LOAD OR UNLOAD THE CLIENT */}
      <button onClick={() => setLoadClient((prevState) => !prevState)}>
        STOP CLIENT
      </button>
      {/* SOCKET IO CLIENT*/}
      {loadClient ? <Cliente /> : null}
    </div>
  );
}

export default App;
