const sendEmail = async (to, subject, text) => {
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject, text })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      const data = await response.json();
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  // Example usage:
  sendEmail('recipient@example.com', 'Hello', 'This is a test email.');