const AWS = require('aws-sdk');
const sesV2 = new AWS.SESV2();
const AWS = require('aws-sdk');

exports.handler = async () => {
  AWS.config.update({ region: 'ap-south-1' }); 
  const sesV2 = new AWS.SESV2();

  try {
    const response = await sesV2.listSuppressedDestinations({});

    if (response.SuppressedDestinationSummaries) {
      const bounces = response.SuppressedDestinationSummaries.filter(item => item.Reason === 'BOUNCE');
      const complaints = response.SuppressedDestinationSummaries.filter(item => item.Reason === 'COMPLAINT');

      console.log('Bounces:', bounces);
      console.log('Complaints:', complaints);

      // Return the results as the output of the Lambda function (optional)
      return {
        statusCode: 200,
        body: JSON.stringify({ bounces, complaints }),
      };
    } else {
      console.log('No suppressed destinations found.');

      // Return a message when no suppressed destinations are found (optional)
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No suppressed destinations found.' }),
      };
    }
  } catch (err) {
    console.error('Error fetching suppression list:', err);

    // Return an error response (optional)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching suppression list.' }),
    };
  }
};


// exports.hello = async (event, context) => {
//   try {
//     const response = await sesV2.listSuppressedDestinations({});

//     if (response.SuppressedDestinationSummaries) {
//       const bounces = response.SuppressedDestinationSummaries.filter(item => item.Reason === 'BOUNCE');
//       const complaints = response.SuppressedDestinationSummaries.filter(item => item.Reason === 'COMPLAINT');

//       console.log('Bounces:', bounces);
//       console.log('Complaints:', complaints);
//     } else {
//       console.log('No suppressed destinations found.');
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Suppression list fetched successfully.' }),
//     };
//   } catch (err) {
//     console.error('Error fetching suppression list:', err);

//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Error fetching suppression list.', error: err }),
//     };
//   }
// };

