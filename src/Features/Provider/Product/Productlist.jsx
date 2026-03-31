// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { convertToTimezone } from '../../Common/Shared/Hooks/useTimezonecontext';

// const ProductList = ({ products = [], onEdit, onDelete }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const timezone = useSelector((state) => state.timezone.timezone);

//   // Filter products
//   const filteredProducts = products.filter(product =>
//     product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.description?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calculate pagination
//   const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
//   const currentProducts = filteredProducts.slice(startIndex, endIndex);

//   // Reset page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   // Fixed: Use functional update + latest totalPages
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       setCurrentPage(page);
//     }
//   };

//   const goToPrevious = () => goToPage(currentPage - 1);
//   const goToNext = () => goToPage(currentPage + 1);

//   return (
//     <div style={{ padding: '5px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Available Products</h2>

//       {/* Search Bar */}
//       <div style={{ marginBottom: '20px' }}>
//         <input
//           type="text"
//           placeholder="Search by name or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: '10px',
//             width: '100%',
//             maxWidth: '400px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             fontSize: '16px'
//           }}
//         />
//         {searchTerm && (
//           <button
//             onClick={() => setSearchTerm('')}
//             style={{
//               marginLeft: '10px',
//               padding: '10px 15px',
//               backgroundColor: '#6c757d',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {currentProducts.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <>
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
//                  <th style={{ padding: '12px' }}>Created At ({timezone.split('/')[1]?.replace('_', ' ') || timezone})</th>
//                 <th style={{ padding: '12px' }}>Name</th>
//                 <th style={{ padding: '12px' }}>Description</th>
//                 <th style={{ padding: '12px' }}>Price</th>
//                 <th style={{ padding: '12px' }}>Category</th>
//                 <th style={{ padding: '12px' }}>Stock</th>
//                 <th style={{ padding: '12px' }}>Start Time</th>
//                 <th style={{ padding: '12px' }}>End Time</th>
//                 <th style={{ padding: '12px' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentProducts.map((product) => (
//                 <tr key={product._id} style={{ borderBottom: '1px solid #ddd' }}>
//                   <td style={{ padding: '12px' }}>{convertToTimezone(product.createdAt, timezone)}</td>
//                   <td style={{ padding: '12px' }}>{product.name}</td>
//                   <td style={{ padding: '12px' }}>
//                     {product.description?.length > 60
//                       ? product.description.substring(0, 60) + '...'
//                       : product.description}
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     {Array.isArray(product.category)
//                       ? product.category.join(', ')
//                       : product.category || '-'}
//                   </td>
//                   <td style={{ padding: '12px' }}>{product.stockQuantity ?? 'N/A'}</td>
//                   <td style={{ padding: '12px' }}>
//                     {product.startTime ? convertToTimezone(product.startTime, timezone) : 'N/A'}
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     {product.endTime ? convertToTimezone(product.endTime, timezone) : 'N/A'}
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <button
//                       onClick={() => onEdit(product)}
//                       style={{
//                         padding: '8px 12px',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         marginRight: '5px'
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => onDelete(product._id)}
//                       style={{
//                         padding: '8px 12px',
//                         backgroundColor: '#dc3545',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination - Only show if more than one page OR has items */}
//           {filteredProducts.length > itemsPerPage && (
//             <div style={{ marginTop: '20px', textAlign: 'center' }}>
//               <button
//                 onClick={goToPrevious}
//                 disabled={currentPage === 1}
//                 style={{
//                   padding: '8px 12px',
//                   margin: '0 5px',
//                   backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 Previous
//               </button>

//               <span style={{ margin: '0 15px', fontSize: '16px' }}>
//                 Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//               </span>

//               <button
//                 onClick={goToNext}
//                 disabled={currentPage === totalPages}
//                 style={{
//                   padding: '8px 12px',
//                   margin: '0 5px',
//                   backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ProductList;



