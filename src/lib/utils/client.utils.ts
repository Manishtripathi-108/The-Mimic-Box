// import { UseFormSetError } from 'react-hook-form';
// import { toast } from 'react-hot-toast';
// import { z } from 'zod';

// import { ErrorResponseOutput, SuccessResponseOutput } from '@/lib/types/response.types';

// export const handleResponse = <T = unknown, D>(
//     response: SuccessResponseOutput<T> | ErrorResponseOutput<z.ZodIssue[]>,
//     setError: UseFormSetError<D>
// ) => {
//     if (!response) {
//         setError('root.serverError', { message: 'Something went wrong. Please try again later.' });
//         return;
//     }

//     if (response.success) {
//         toast.success(response.message || 'Profile updated successfully');
//     } else {
//         if (response.extraData) {
//             response.extraData.forEach((err) => {
//                 setError(err.path[0] as 'name' | 'email' | 'image', {
//                     message: err.message,
//                 });
//             });
//         }
//         if (response.message) {
//             setError('root.serverError', { message: response.message });
//         }
//     }
// };
