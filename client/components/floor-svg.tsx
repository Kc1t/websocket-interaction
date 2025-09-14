// import React from 'react'

// const FloorSvg = () => {
//     return (
//         <svg viewBox="0 0 512 288" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
//             <defs>
//                 <!-- Basic office floor pattern -->
//                 <pattern id="office_floor" patternUnits="userSpaceOnUse" width="32" height="32">
//                     <rect width="32" height="32" fill="#e8e0d6" />
//                     <rect x="1" y="1" width="30" height="30" fill="#ebe3d9" />
//                     <rect x="2" y="2" width="28" height="28" fill="#ede5db" />
//                     <rect x="3" y="3" width="26" height="26" fill="#efe7dd" />
//                 </pattern>

//                 <!-- Alternate floor with subtle variation -->
//                 <pattern id="office_floor_alt" patternUnits="userSpaceOnUse" width="32" height="32">
//                     <rect width="32" height="32" fill="#e5ddd3" />
//                     <rect x="1" y="1" width="30" height="30" fill="#e8e0d6" />
//                     <rect x="2" y="2" width="28" height="28" fill="#eae2d8" />
//                     <rect x="3" y="3" width="26" height="26" fill="#ece4da" />
//                 </pattern>

//                 <!-- Carpet tile pattern -->
//                 <pattern id="carpet_tile" patternUnits="userSpaceOnUse" width="32" height="32">
//                     <rect width="32" height="32" fill="#d2cac0" />
//                     <rect x="1" y="1" width="30" height="30" fill="#d5cdc3" />
//                     <rect x="2" y="2" width="28" height="28" fill="#d8d0c6" />
//                     <rect x="4" y="4" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="8" y="8" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="12" y="4" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="16" y="12" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="20" y="8" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="24" y="4" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="28" y="16" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="4" y="20" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="8" y="24" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="12" y="28" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="20" y="24" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="24" y="20" width="2" height="2" fill="#dbd3c9" />
//                     <rect x="28" y="28" width="2" height="2" fill="#dbd3c9" />
//                 </pattern>

//                 <!-- Polished concrete pattern -->
//                 <pattern id="concrete_floor" patternUnits="userSpaceOnUse" width="32" height="32">
//                     <rect width="32" height="32" fill="#ddd6cc" />
//                     <rect x="1" y="1" width="30" height="30" fill="#e0d9cf" />
//                     <rect x="2" y="2" width="28" height="28" fill="#e2dbd1" />
//                     <rect x="3" y="3" width="26" height="26" fill="#e4ddd3" />
//                 </pattern>

//                 <!-- Marble effect pattern -->
//                 <pattern id="marble_floor" patternUnits="userSpaceOnUse" width="32" height="32">
//                     <rect width="32" height="32" fill="#f0e9df" />
//                     <rect x="1" y="1" width="30" height="30" fill="#f2ebe1" />
//                     <rect x="2" y="2" width="28" height="28" fill="#f4ede3" />
//                     <rect x="3" y="3" width="26" height="26" fill="#f6efe5" />
//                     <!-- Subtle marble veining -->
//                     <rect x="6" y="8" width="8" height="1" fill="#ebe4da" />
//                     <rect x="18" y="12" width="6" height="1" fill="#ebe4da" />
//                     <rect x="4" y="18" width="10" height="1" fill="#ebe4da" />
//                     <rect x="20" y="22" width="8" height="1" fill="#ebe4da" />
//                     <rect x="8" y="26" width="12" height="1" fill="#ebe4da" />
//                 </pattern>
//             </defs>

//             <!-- Create seamless repeating floor pattern -->
//             <!-- Fill entire canvas with alternating floor tiles for seamless repetition -->

//             <!-- Row 1 -->
//             <rect x="0" y="0" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="32" y="0" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="64" y="0" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="96" y="0" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="128" y="0" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="160" y="0" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="192" y="0" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="224" y="0" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="256" y="0" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="288" y="0" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="320" y="0" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="352" y="0" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="384" y="0" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="416" y="0" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="448" y="0" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="480" y="0" width="32" height="32" fill="url(#concrete_floor)" />

//             <!-- Row 2 -->
//             <rect x="0" y="32" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="32" y="32" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="64" y="32" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="96" y="32" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="128" y="32" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="160" y="32" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="192" y="32" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="224" y="32" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="256" y="32" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="288" y="32" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="320" y="32" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="352" y="32" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="384" y="32" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="416" y="32" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="448" y="32" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="480" y="32" width="32" height="32" fill="url(#office_floor)" />

//             <!-- Row 3 -->
//             <rect x="0" y="64" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="32" y="64" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="64" y="64" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="96" y="64" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="128" y="64" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="160" y="64" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="192" y="64" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="224" y="64" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="256" y="64" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="288" y="64" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="320" y="64" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="352" y="64" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="384" y="64" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="416" y="64" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="448" y="64" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="480" y="64" width="32" height="32" fill="url(#office_floor_alt)" />

//             <!-- Row 4 -->
//             <rect x="0" y="96" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="32" y="96" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="64" y="96" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="96" y="96" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="128" y="96" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="160" y="96" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="192" y="96" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="224" y="96" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="256" y="96" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="288" y="96" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="320" y="96" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="352" y="96" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="384" y="96" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="416" y="96" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="448" y="96" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="480" y="96" width="32" height="32" fill="url(#carpet_tile)" />

//             <!-- Row 5 -->
//             <rect x="0" y="128" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="32" y="128" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="64" y="128" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="96" y="128" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="128" y="128" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="160" y="128" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="192" y="128" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="224" y="128" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="256" y="128" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="288" y="128" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="320" y="128" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="352" y="128" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="384" y="128" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="416" y="128" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="448" y="128" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="480" y="128" width="32" height="32" fill="url(#office_floor)" />

//             <!-- Row 6 -->
//             <rect x="0" y="160" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="32" y="160" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="64" y="160" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="96" y="160" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="128" y="160" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="160" y="160" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="192" y="160" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="224" y="160" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="256" y="160" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="288" y="160" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="320" y="160" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="352" y="160" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="384" y="160" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="416" y="160" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="448" y="160" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="480" y="160" width="32" height="32" fill="url(#office_floor_alt)" />

//             <!-- Row 7 -->
//             <rect x="0" y="192" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="32" y="192" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="64" y="192" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="96" y="192" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="128" y="192" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="160" y="192" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="192" y="192" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="224" y="192" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="256" y="192" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="288" y="192" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="320" y="192" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="352" y="192" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="384" y="192" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="416" y="192" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="448" y="192" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="480" y="192" width="32" height="32" fill="url(#marble_floor)" />

//             <!-- Row 8 -->
//             <rect x="0" y="224" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="32" y="224" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="64" y="224" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="96" y="224" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="128" y="224" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="160" y="224" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="192" y="224" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="224" y="224" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="256" y="224" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="288" y="224" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="320" y="224" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="352" y="224" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="384" y="224" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="416" y="224" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="448" y="224" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="480" y="224" width="32" height="32" fill="url(#office_floor_alt)" />

//             <!-- Row 9 -->
//             <rect x="0" y="256" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="32" y="256" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="64" y="256" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="96" y="256" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="128" y="256" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="160" y="256" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="192" y="256" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="224" y="256" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="256" y="256" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="288" y="256" width="32" height="32" fill="url(#carpet_tile)" />
//             <rect x="320" y="256" width="32" height="32" fill="url(#office_floor_alt)" />
//             <rect x="352" y="256" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="384" y="256" width="32" height="32" fill="url(#concrete_floor)" />
//             <rect x="416" y="256" width="32" height="32" fill="url(#marble_floor)" />
//             <rect x="448" y="256" width="32" height="32" fill="url(#office_floor)" />
//             <rect x="480" y="256" width="32" height="32" fill="url(#office_floor_alt)" />
//         </svg>
//     )
// }

// export default FloorSvg
