import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let scanner = null;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode('qr-reader');
        
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Extrair token do URL ou usar direto
            let token = decodedText;
            
            // Se for uma URL completa, extrair o token
            if (decodedText.includes('/mesa/')) {
              const parts = decodedText.split('/mesa/');
              token = parts[1];
            }

            scanner.stop();
            onScan(token);
          }
        );

        setScanning(true);
        setErro('');
      } catch (error) {
        console.error('Erro ao iniciar scanner:', error);
        setErro('Não foi possível acessar a câmera. Verifique as permissões.');
      }
    };

    startScanner();

    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="space-y-4">
      <div 
        id="qr-reader" 
        className="rounded-xl overflow-hidden border-4 border-mare-600"
        style={{ width: '100%' }}
      />
      
      {erro && (
        <div className="p-3 bg-coral-100 text-coral-700 rounded-lg text-center text-sm">
          {erro}
        </div>
      )}

      {scanning && !erro && (
        <p className="text-center text-gray-600 text-sm">
          Posicione o QR Code dentro do quadrado
        </p>
      )}
    </div>
  );
};

export default QRScanner;
