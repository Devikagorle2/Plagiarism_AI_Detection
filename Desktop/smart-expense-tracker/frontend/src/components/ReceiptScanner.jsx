import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import toast from 'react-hot-toast';

const ReceiptScanner = ({ onExtracted }) => {
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const parseReceiptText = (text) => {
    const amountMatch = text.match(/\$\s*(\d+(?:\.\d{2})?)/i) || text.match(/total:\s*(\d+(?:\.\d{2})?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    const date = dateMatch ? dateMatch[1] : null;
    
    let category = 'Others';
    if (text.match(/restaurant|cafe|lunch|dinner|food/i)) category = 'Food';
    else if (text.match(/uber|taxi|flight|train|travel/i)) category = 'Travel';
    else if (text.match(/amazon|walmart|target|shopping/i)) category = 'Shopping';
    else if (text.match(/electric|water|internet|bill/i)) category = 'Bills';
    
    return { amount, date, category };
  };

  const handleImage = async (file) => {
    setScanning(true);
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    
    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      const extracted = parseReceiptText(text);
      onExtracted(extracted);
      toast.success('Receipt scanned successfully!');
    } catch (error) {
      console.error('OCR error:', error);
      toast.error('Failed to scan receipt. Please try manual entry.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-2">
        <label className="bg-indigo-600 text-white p-2 rounded cursor-pointer hover:bg-indigo-700">
          <span>📷 Upload Receipt</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={e => handleImage(e.target.files[0])} 
          />
        </label>
      </div>
      {scanning && <p className="mt-2 dark:text-white">Scanning receipt... ⏳</p>}
      {imagePreview && (
        <img 
          src={imagePreview} 
          alt="Receipt" 
          className="mt-2 max-h-40 rounded" 
        />
      )}
    </div>
  );
};

export default ReceiptScanner;
