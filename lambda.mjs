import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const handler = async (event) => {
    const { answer, questionIndex } = JSON.parse(event.body);
    const bucketName = 'astroa11y';
    const key = 'questions.json';

    try {
        const data = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
        const questions = JSON.parse(data.Body.toString('utf-8'));

        if (questionIndex < 0 || questionIndex >= questions.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid question index' }),
            };
        }

        const correctAnswer = questions[questionIndex].correctAnswer;

        return {
            statusCode: 200,
            body: JSON.stringify({ correct: answer === correctAnswer }),
        };
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};