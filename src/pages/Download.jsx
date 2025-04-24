import React, { useEffect, useState } from 'react';
import { getShows } from '../services/api';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver'; // Install: npm install file-saver
import './Download.css';

const generateToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const Download = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uniqueToken, setUniqueToken] = useState('');

  useEffect(() => {
    getShows()
      .then(response => {
        if (response.data?.length > 0) {
          setShowDetails(response.data[0]);
        } else {
          setError('No show details available.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching show details:', err);
        setError('Failed to load show details.');
        setLoading(false);
      });
    setUniqueToken(generateToken());
  }, []);

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 15;

    // Header Section
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text("EVENT TICKET", pageWidth / 2, 25, { align: 'center' });

    // QR Code
    try {
      const qrData = await QRCode.toDataURL(uniqueToken);
      doc.addImage(qrData, 'PNG', pageWidth - 45, 45, 30, 30);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }

    // Ticket Details
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 40, pageWidth, doc.internal.pageSize.getHeight() - 40, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Ticket Information
    doc.setFont('helvetica', 'bold');
    doc.text("TICKET INFORMATION:", 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Token: ${uniqueToken}`, 20, 70);
    doc.text(`Status: Confirmed ✔️`, 20, 80);

    // Event Details
    doc.setFont('helvetica', 'bold');
    doc.text("EVENT DETAILS:", 20, 100);
    doc.setFont('helvetica', 'normal');
    
    if (showDetails) {
      let detailY = 110;
      doc.text(`Event: ${showDetails.name}`, 20, detailY);
      doc.text(`Venue: ${showDetails.venue}`, 20, detailY + 10);
      
      if (showDetails.occurrences?.[0]) {
        const occurrence = showDetails.occurrences[0];
        detailY += 20;
        doc.text(`Date: ${occurrence.dayOfWeek}`, 20, detailY);
        
        if (occurrence.timings?.length > 0) {
          detailY += 10;
          occurrence.timings.forEach((timing, index) => {
            const startTime = new Date(timing.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });
            const endTime = new Date(timing.endTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });
            doc.text(`Session ${index + 1}: ${startTime} - ${endTime}`, 20, detailY);
            detailY += 10;
          });
        }
      }
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('* Present this ticket at the entrance for admission', 
      20, doc.internal.pageSize.getHeight() - 10);

    // Mobile-friendly download
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, 'event-ticket.pdf');
  };

  return (
    <div className="download-container">
      <h1>Payment Confirmation</h1>
      
      <div className="payment-info">
        <h2>Thank you! 😊</h2>
        <p>Your payment was successfully processed.</p>
        <p>Your ticket details are below:</p>
        {uniqueToken && (
          <p className="unique-token">
            <strong>Ticket ID:</strong> {uniqueToken}
          </p>
        )}
      </div>

      {loading ? (
        <p>Loading event details...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : showDetails ? (
        <div className="show-details">
          <h2>{showDetails.name}</h2>
          <div className="occurrence">
            <p><strong>Venue:</strong> {showDetails.venue}</p>
            {showDetails.occurrences?.[0] && (
              <>
                <p><strong>Date:</strong> {showDetails.occurrences[0].dayOfWeek}</p>
                {showDetails.occurrences[0].timings?.[0] && (
                  <ul>
                    {showDetails.occurrences[0].timings.map((timing) => (
                      <li key={timing.id}>
                        {new Date(timing.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(timing.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <p>No event details available.</p>
      )}

      <button onClick={handleDownloadPDF} className="download-btn">
        Download Your Ticket
      </button>
    </div>
  );
};

export default Download;