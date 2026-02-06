import{j as i}from"./jsx-runtime.D_zvdyIk.js";import"./index.DiEladB3.js";function d({children:o,className:n="",colors:r=["#2bf8d4","#ffffff","#2bf8d4"],animationSpeed:e=6,direction:t="horizontal"}){const a=t==="horizontal"?"to right":t==="vertical"?"to bottom":"to bottom right",s=r.join(", ");return i.jsxs("span",{className:`inline-block ${n}`,style:{backgroundImage:`linear-gradient(${a}, ${s})`,backgroundSize:"300% 100%",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:`gradientShift ${e}s ease infinite`},children:[o,i.jsx("style",{children:`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `})]})}export{d as default};
