// https://github.com/facebook/react/issues/15156
// https://codesandbox.io/s/00yn9yqzjw?file=/src/index.js

// TODO 我用得少，先不研究
import React, { useContext } from "react";
import { ThemeContext } from "../App";

const ContextDemo = () => {
  const theme = useContext(ThemeContext);
  console.log("theme", theme, "ThemeContext", ThemeContext);
  return <button style={{ background: theme.background, color: theme.foreground }}>I am styled by theme context!</button>;
};

export default ContextDemo;
