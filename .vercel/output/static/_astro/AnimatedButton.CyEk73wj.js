import{j as e}from"./jsx-runtime.D_zvdyIk.js";import"./index.DiEladB3.js";function b({children:l,className:d="",glow:c=!0,shimmerColor:n="#2bf8d4",shimmerSize:u="0.15em",shimmerDuration:m="3s",background:p="linear-gradient(135deg, #2bf8d4, #1cc4a8)",borderRadius:a="0.75rem",href:r,onClick:o}){const i=e.jsxs("span",{className:`relative inline-flex items-center gap-2 font-semibold text-white cursor-pointer overflow-hidden ${d}`,style:{background:p,borderRadius:a,padding:"0.875rem 2rem",border:"none",position:"relative",isolation:"isolate",transition:"transform 0.3s ease, box-shadow 0.3s ease"},onMouseEnter:s=>{const t=s.currentTarget;t.style.transform="translateY(-2px)",c&&(t.style.boxShadow=`0 10px 40px ${n}66`)},onMouseLeave:s=>{const t=s.currentTarget;t.style.transform="translateY(0)",t.style.boxShadow="none"},children:[e.jsx("span",{className:"absolute inset-0 pointer-events-none",style:{background:`linear-gradient(
            110deg,
            transparent 33%,
            ${n}33 44%,
            ${n}55 48%,
            ${n}33 52%,
            transparent 66%
          )`,backgroundSize:"300% 100%",animation:`shimmer ${m} ease-in-out infinite`,borderRadius:a}}),e.jsx("span",{className:"relative z-10 flex items-center gap-2",children:l}),e.jsx("style",{children:`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `})]});return r?e.jsx("a",{href:r,style:{textDecoration:"none"},onClick:o,children:i}):e.jsx("button",{onClick:o,style:{all:"unset"},children:i})}export{b as default};
