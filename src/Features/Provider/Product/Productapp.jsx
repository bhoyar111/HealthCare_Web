
import React, { useEffect } from 'react';
import Productvideos from './Productvideos';

const ProductApp = () => {
  useEffect(() => {
    // Temporary: Set your Postman token here for testing
    localStorage.setItem('token',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzU3VydmV5IjpmYWxzZSwiX2lkIjoiNjhjMTA2YzlkZTY5ZDkwZGJlYjg2NGY5IiwiZmlyc3ROYW1lIjoiTWFjayIsImxhc3ROYW1lIjoiTGVvIiwiZnVsbE5hbWUiOiJNYWNrIExlbyIsImFkZHJlc3MiOiJCZWhpbmQgcG9saWNlIHN0YXRpb24gS2hhcmJpIE5hZ3B1ciIsImVtYWlsIjoibWFjazAxQHlvcG1haWwuY29tIiwibW9iaWxlIjoiODY5ODI3Mzg1NSIsInJvbGUiOiJQcm92aWRlciIsImlzRGVsZXRlZCI6ZmFsc2UsImlzQWN0aXZlIjp0cnVlLCJ2ZXJpZmllZCI6dHJ1ZSwiZ2VuZGVyIjoiTWFsZSIsImZjbVRva2VuIjpbbnVsbF0sInJlZ2lzdGVyRnJvbSI6Im1hbnVhbCIsInByb2ZpbGVfcGljIjoiNjhjMTA2YzlkZTY5ZDkwZGJlYjg2NGY5L3Byb2ZpbGUvX2ZpbGUtMTc2NDMxOTcwMjgzNS15M2puVTdEb0ozLnBuZyIsImRvYiI6IjE5OTQtMDktMjIiLCJpc090cFZlcmlmaWVkIjpmYWxzZSwic3BlY2lhbGl0eSI6WyJEZXJtYXRvbG9neSJdLCJsaWNlbnNlRGV0YWlscyI6W3sic3RhdGUiOiJBbGFza2EiLCJsaWNlbnNlX251bWJlciI6IjEyNVBPSzA5IiwiZXhwaXJ5X2RhdGUiOiIyMDkwLTExLTMwIn0seyJzdGF0ZSI6IkFya2Fuc2FzIiwibGljZW5zZV9udW1iZXIiOiJIVUo5ODA4IiwiZXhwaXJ5X2RhdGUiOiIyMDUzLTA5LTI2In1dLCJleHBlcmllbmNlIjoiMDkiLCJhYm91dCI6Ikdvb2RmIiwiY3JlYXRlZEF0IjoiMjAyNS0wOS0xMFQwNTowNDowOS42MTZaIiwidXBkYXRlZEF0IjoiMjAyNS0xMi0xOFQwOTozNToxOC4xODRaIiwiX192IjowLCJsYXN0QWN0aXZlIjoiMjAyNS0xMi0xOFQwOTozNToxNy42OTlaIn0sImlhdCI6MTc2NjA1MDYwMCwiZXhwIjoxNzY2MDc5NDAwfQ.DRUOF9RegQUD7QKCf4TFiJ1AFMlcQES0_gArQ7EDBWk");
  }, []);
  
  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '1200px',
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <div className="card-container" style={cardStyle}>
        <h1>Videos</h1>
        <Productvideos />
      </div>
    </div>
  );
};

export default ProductApp;
