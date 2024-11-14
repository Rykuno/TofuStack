export const bucketPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: '*', // Allow access from anyone
      Action: ['s3:GetObject'], // Only allow read access
      Resource: ['arn:aws:s3:::dev/*'] // Apply to all objects in the bucket
    }
  ]
};
