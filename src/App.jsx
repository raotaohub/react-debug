import "./index.css";
import React, { useEffect, useLayoutEffect, useState } from "react";
import SchedulerPriorityDemo from "./demo/SchedulerPriorityDemo";
import AutomaticBatchedUpdate from "./demo/AutomaticBatchedUpdate";
import SyntheticEventVsEvent from "./demo/SyntheticEventVsEvent";

function App() {
  const [count, setCount] = useState(0);

  console.log("[Invoke App Function Component]", "count:", count);

  // useLayoutEffect(() => {
  //   if (count < 5) {
  //     setCount((c) => ++c);
  //   }
  // }, [count]);

  // useEffect(() => {
  //   if (count < 10) {
  //     setCount((c) => ++c);
  //   }
  // }, []);

  const debugHandleClick = () => {
    setCount((c) => c + 1);
  };

  return (
    <div className="App" key="App">
      <header className="App-header"></header>
      <p>{count}</p>
      <p onClick={debugHandleClick}>App</p>
      <AutomaticBatchedUpdate></AutomaticBatchedUpdate>
      {/* <SchedulerPriorityDemo></SchedulerPriorityDemo> */}
      {/* <SyntheticEventVsEvent></SyntheticEventVsEvent> */}
    </div>
  );
}

export default App;
