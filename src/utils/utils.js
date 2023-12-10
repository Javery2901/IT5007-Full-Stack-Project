export async function sendEmail(data) {
	try {
        const response = await fetch('http://localhost:3001/api/send_email', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
        return result; // or handle the response as needed
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
