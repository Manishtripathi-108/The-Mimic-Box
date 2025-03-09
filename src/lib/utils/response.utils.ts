// import { NextApiResponse } from 'next';

// export const successResponse = (res: NextApiResponse, data: object) => {
//     res.status(200).json({ success: true, ...data });
// };

// /**
//  * Sends an error response with a specified HTTP status code, logs the error, and
//  * includes the error message in the response.
//  *
//  * @param res - The Next.js response object.
//  * @param message - The error message to log and send in the response.
//  * @param error - The error object to log.
//  * @param status - The HTTP status code to send in the response.
//  */
// export const errorResponse = (
//     res: NextApiResponse,
//     message: string = 'Internal Server Error',
//     { error, status = 500 }: { error?: Error; status?: number }
// ) => {
//     if (error) console.error(error);
//     res.status(status).json({ success: false, message });
// };

// /**
//  * Sends an error response with a specified HTTP status code, logs the error, and
//  * includes retry-after and x-ratelimit-remaining headers from the AniList API error
//  * response.
//  *
//  * @param res - The Next.js response object.
//  * @param message - The error message to send in the response.
//  * @param error - The error object to log.
//  */
// export const anilistErrorResponse = (res: NextApiResponse, message: string, error: any) => {
//     const retryAfterSeconds = error.response?.headers['retry-after'];
//     const remainingRateLimit = error.response?.headers['x-ratelimit-remaining'];

//     if (error.response?.status === 401 || error.response?.status === 400) {
//         return res.status(error.response?.status || 400).json({
//             message: error?.response?.data.hint || 'Session expired. Please log in again.',
//             error: error?.response?.data || 'Invalid or expired token.',
//             retryAfterSeconds,
//             remainingRateLimit,
//         });
//     }

//     res.status(500).json({
//         message,
//         error: error || 'Unexpected server error.',
//         retryAfterSeconds,
//         remainingRateLimit,
//     });
// };
