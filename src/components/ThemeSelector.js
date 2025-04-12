// "use client";

// import { useTheme } from "../context/ThemeContext";
// import { useEffect, useState } from "react";

// const ThemeSelector = () => {
//   const { setTheme } = useTheme();
//   const [themeList, setThemeList] = useState([]);

//   useEffect(() => {
//     // Only run on client
//     if (typeof window !== "undefined" && window?.daisyui?.themes) {
//       setThemeList(window.daisyui.themes);
//     } else {
//       // fallback if themes are not found
//       setThemeList([
//         "light",
//         "dark",
//         "cupcake",
//         "bumblebee",
//         "emerald",
//         "corporate",
//         "synthwave",
//         "retro",
//         "cyberpunk",
//         "valentine",
//         "halloween",
//         "garden",
//         "forest",
//         "aqua",
//         "lofi",
//         "pastel",
//         "fantasy",
//         "wireframe",
//         "black",
//         "luxury",
//         "dracula",
//         "cmyk",
//         "autumn",
//         "business",
//         "acid",
//         "lemonade",
//         "night",
//         "coffee",
//         "winter",
//       ]);
//     }
//   }, []);

//   const handleChange = (newTheme) => {
//     setTheme(newTheme);
//   };

//   return (
//     <div className="dropdown dropdown-end">
//       <label tabIndex={0} className="btn btn-outline btn-sm m-1">
//         🎨 Theme
//       </label>
//       <ul
//         tabIndex={0}
//         className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-100 max-h-96 overflow-y-auto"
//       >
//         {themeList.map((themeName) => (
//           <li key={themeName}>
//             <button
//               className="theme-controller btn btn-sm justify-between"
//               data-set-theme={themeName}
//               data-act-class="outline"
//               onClick={() => handleChange(themeName)}
//             >
//               <span>{themeName}</span>
//               <div className="flex gap-1">
//                 <div data-theme={themeName} className="grid grid-cols-5 gap-1 rounded-box p-1">
//                   <div className="bg-primary w-3 h-3 rounded" />
//                   <div className="bg-secondary w-3 h-3 rounded" />
//                   <div className="bg-accent w-3 h-3 rounded" />
//                   <div className="bg-neutral w-3 h-3 rounded" />
//                   <div className="bg-base-100 w-3 h-3 rounded border" />
//                 </div>
//               </div>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ThemeSelector;


"use client";

import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

const ThemeSelector = () => {
  const { setTheme } = useTheme();
  const [themeList, setThemeList] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window?.daisyui?.themes) {
      setThemeList(window.daisyui.themes);
    } else {
      setThemeList([
        "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
        "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
        "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
        "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
        "night", "coffee", "winter",
      ]);
    }
  }, []);

  const handleChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-outline btn-sm m-1">
        🎨 Theme
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-60 max-h-96 overflow-y-auto"
      >
        {themeList.map((themeName) => (
          <li key={themeName}>
            <button
              className="theme-controller btn btn-sm justify-between w-full"
              data-set-theme={themeName}
              data-act-class="outline"
              onClick={() => handleChange(themeName)}
            >
              <span className="capitalize">{themeName}</span>
              <div className="flex gap-1">
                <div data-theme={themeName} className="grid grid-cols-5 gap-1 rounded-box p-1">
                  <div className="bg-primary w-3 h-3 rounded" />
                  <div className="bg-secondary w-3 h-3 rounded" />
                  <div className="bg-accent w-3 h-3 rounded" />
                  <div className="bg-neutral w-3 h-3 rounded" />
                  <div className="bg-base-100 w-3 h-3 rounded border" />
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSelector;
