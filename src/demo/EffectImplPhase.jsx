import React, { useEffect, useLayoutEffect } from "react";

const EffectImplPhase = (props = { unMount: () => {} }) => {
  useLayoutEffect(function useLayoutEffectCbOnMount() {
    console.log("useLayoutEffectCbOnMount");
    alert("useLayoutEffect-useLayoutEffectCbOnMount");
    debugger; // 请观察调用栈

    return function useLayoutEffectCbOnUnMount() {
      console.log("useLayoutEffectCbOnUnMount");
      alert("useLayoutEffect-useLayoutEffectCbOnUnMount");
      debugger; // 请观察调用栈
    };
  }, []);

  useEffect(function useEffectCbOnMount() {
    console.log("useEffectCbOnMount");
    alert("useEffect-commitHookEffectListMount");
    debugger; // 请观察调用栈

    return function useEffectCbOnUnMount() {
      console.log("useEffectCbOnUnMount");
      alert("useEffect-commitHookEffectListUnmount");
      debugger; // 请观察调用栈
    };
  }, []);

  console.log("effectDemo");
  return (
    <div>
      <h1>EffectImplPhase-副作用执行时机</h1>
      <button
        onClick={() => {
          props.unMount(false);
        }}
      >
        卸载
      </button>
    </div>
  );
};

export default EffectImplPhase;
