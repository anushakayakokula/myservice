const AWS = require('aws-sdk');
const sesV2 = new AWS.SESV2();

exports.handler = async () => {
  AWS.config.update({ region: 'ap-south-1' }); 
  const sesV2 = new AWS.SESV2();

  try {
    let allBounces = [];
    let allComplaints = [];
    let nextToken;

    do {
      const response = await sesV2.listSuppressedDestinations({
        NextToken: nextToken // Pass the NextToken for pagination
      });

      if (response.SuppressedDestinationSummaries) {
        const bounces = response.SuppressedDestinationSummaries.filter(item => item.Reason === 'BOUNCE');
        const complaints = response.SuppressedDestinationSummaries.filter(item => item.Reason === 'COMPLAINT');

        allBounces = allBounces.concat(bounces);
        allComplaints = allComplaints.concat(complaints);

        // If there is a NextToken, it means there are more results to fetch
        nextToken = response.NextToken;
      } else {
        console.log('No suppressed destinations found.');
        break;
      }
    } while (nextToken);

    console.log('Bounces:', allBounces);
    console.log('Complaints:', allComplaints);

    // Return the results as the output of the Lambda function (optional)
    return {
      statusCode: 200,
      body: JSON.stringify({ bounces: allBounces, complaints: allComplaints }),
    };
  } catch (err) {
    console.error('Error fetching suppression list:', err);

    // Return an error response (optional)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching suppression list.' }),
    };
  }
};


