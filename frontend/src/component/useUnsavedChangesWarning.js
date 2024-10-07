// import React,{useState, useEffect} from 'react'
// import { useBeforeUnload } from 'react-router-dom';

// const useUnsavedChangesWarning=(message="정말로 나가시겠습니까? 나갈 시 저장이 되지 않습니다.")=>{
//     useBeforeUnload(isDirty ? message : undefined);

//     useEffect(() => {
//         if (isDirty) {
//             const handleBeforeUnload = (event) => {
//                 event.preventDefault();
//                 event.returnValue = message; // Legacy support
//             };

//             window.addEventListener('beforeunload', handleBeforeUnload);

//             return () => {
//                 window.removeEventListener('beforeunload', handleBeforeUnload);
//             };
//         }
//     }, [isDirty, message]);
// };

// export default useUnsavedChangesWarning