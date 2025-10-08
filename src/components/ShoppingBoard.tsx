// import React from "react";
// import { useAppSelector } from "../../ReduxHooks";

// const ShoppingBoard: React.FC = () => {
//   const { items } = useAppSelector((state) => state.shoppingList);

//   // Group items by category
//   const grouped = items.reduce((acc: Record<string, typeof items>, item) => {
//     if (!acc[item.category]) acc[item.category] = [];
//     acc[item.category].push(item);
//     return acc;
//   }, {});

//   return (
//     <div className="shopping-board">
//       {Object.entries(grouped).map(([category, items]) => (
//         <div key={category} className="shopping-card">
//           <h3 className="shopping-card-title">{category}</h3>
//           <ul className="shopping-list">
//             {items.map((item) => (
//               <li key={item.id} className="shopping-list-item">
//                 <input type="checkbox" id={item.id} />
//                 <label htmlFor={item.id}>{item.name}</label>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ShoppingBoard;
