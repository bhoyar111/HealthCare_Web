// import React, { useState, useEffect } from 'react';
// import { axiosInstance } from '../../../Interceptors/axiosInterceptor';

// const availableCategories = ['electronics', 'furniture', 'home goods', 'clothing', 'books', 'groceries'];
// const ProductForm = ({ editingProduct, onSuccess, onCancel, API_URL }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: [], 
//     stockQuantity: '',
//     startTime: '',
//     endTime: ''
//   });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (editingProduct) {
//       setFormData({
//         name: editingProduct.name,
//         description: editingProduct.description,
//         price: editingProduct.price,
//         category: editingProduct.category || [], 
//         stockQuantity: editingProduct.stockQuantity,
//         startTime: editingProduct.startTime ? new Date(editingProduct.startTime).toISOString().slice(0, 16) : '',
//         endTime: editingProduct.endTime ? new Date(editingProduct.endTime).toISOString().slice(0, 16) : ''
//       });
//     } else {
//       setFormData({ name: '', description: '', price: '', category: [], stockQuantity: '', startTime: '', endTime: '' });
//     }
//     setError(null);
//   }, [editingProduct]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (formData.category.length === 0) {
//         setError("Please select at least one category.");
//         return;
//     }

//     try {
//       let response;
//       if (editingProduct) {
//         response = await axiosInstance.put(`${API_URL}/${editingProduct._id}`, formData);
//       } else {
//         response = await axiosInstance.post(API_URL, formData);
//       }
      
//       if (response.status === true || response.data?.status === true) {
//           setError(null);
//           // Show success message
//           alert('Product created successfully!');
//           // Redirect to product list immediately
//           onSuccess();
//       } else {
//           setError(response.message || response.data?.message || 'An unknown error occurred.');
//       }

//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Error saving product. Check server connection.';
//       console.error('Error saving product:', err);
//       setError(errorMessage);
//     }
//   };

//   const styles = {
//     formContainer: {
//       marginBottom: '30px',
//       border: '1px solid #e0e0e0',
//       padding: '20px',
//       maxWidth: '450px',
//       borderRadius: '8px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//       backgroundColor: '#ffffff'
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '15px' 
//     },
//     formGroup: {
//         display: 'flex',
//         flexDirection: 'column',
//     },
//     label: {
//         marginBottom: '5px',
//         fontWeight: '600',
//         color: '#333333',
//         fontSize: '0.9rem'
//     },
//     input: {
//       padding: '10px',
//       border: '1px solid #cccccc',
//       borderRadius: '4px',
//       width: '100%',
//       boxSizing: 'border-box', 
//       fontSize: '1rem'
//     },
//     textarea: {
//       padding: '10px',
//       border: '1px solid #cccccc',
//       borderRadius: '4px',
//       width: '100%',
//       boxSizing: 'border-box',
//       fontSize: '1rem',
//       height: '100px',
//       resize: 'horizontal' 
//     },
//     buttonGroup: {
//       display: 'flex',
//       gap: '10px',
//       marginTop: '15px'
//     },
//     buttonPrimary: {
//       padding: '10px 18px',
//       backgroundColor: '#007bff', 
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '1rem',
//       fontWeight: '600'
//     },
//     buttonSecondary: {
//       padding: '10px 18px',
//       backgroundColor: '#6c757d', 
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '1rem',
//       fontWeight: '600'
//     }
//   };

//   return (
//     <div style={styles.formContainer}>
//       <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
//       {error && <div style={styles.errorAlert}>{error}</div>}
//       <form onSubmit={handleSubmit} style={styles.form}>
       
//         <div style={styles.formGroup}>
//             <label htmlFor="name" style={styles.label}>Name</label>
//             <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
//         </div>
//         <div style={styles.formGroup}>
//             <label htmlFor="description" style={styles.label}>Description</label>
//             <textarea id="description" name="description" value={formData.description} onChange={handleChange} required style={styles.textarea} />
//         </div>
//         <div style={styles.formGroup}>
//             <label htmlFor="price" style={styles.label}>Price</label>
//             <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" style={styles.input} />
//         </div>
        
//         <div style={styles.formGroup}>
//             <label htmlFor="category" style={styles.label}>Category</label>
//             <select
//                 id="category"
//                 name="category" 
//                 value={formData.category} 
//                 onChange={handleChange}   
//                 required
//                 style={styles.input} 
//             >
//                 <option value="">-- Select an option --</option>
//                 {availableCategories.map(categoryOption => (
//                     <option key={categoryOption} value={categoryOption}>
//                         {categoryOption}
//                     </option>
//                 ))}
//             </select>
//         </div>

//         <div style={styles.formGroup}>
//             <label htmlFor="stockQuantity" style={styles.label}>Stock Quantity</label>
//             <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required min="0" style={styles.input} />
//         </div>

//         <div style={styles.formGroup}>
//             <label htmlFor="startTime" style={styles.label}>Start Time</label>
//             <input type="datetime-local" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} style={styles.input} />
//         </div>

//         <div style={styles.formGroup}>
//             <label htmlFor="endTime" style={styles.label}>End Time</label>
//             <input type="datetime-local" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} style={styles.input} />
//         </div>

//          <div style={styles.buttonGroup}>
//           <button type="submit" style={styles.buttonPrimary}>
//             {editingProduct ? 'Save Changes' : 'Create Product'}
//           </button>
//           <button type="button" onClick={onCancel} style={styles.buttonSecondary}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;




