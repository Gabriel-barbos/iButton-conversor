
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, ArrowRight } from 'lucide-react';
import { validateHexInput, convertHexToDecimal } from '@/utils/converter';
import { useToast } from '@/hooks/use-toast';

const SingleConverter = () => {
  const [firstDigits, setFirstDigits] = useState('');
  const [mainCode, setMainCode] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { toast } = useToast();

  // Combina os 3 inputs para formar o código completo
  const fullCode = firstDigits + mainCode + lastDigits;

  useEffect(() => {
    if (fullCode.trim() === '') {
      setDecimalResult('');
      setIsValid(true);
      return;
    }

    const isValidHex = validateHexInput(fullCode);
    setIsValid(isValidHex);

    if (isValidHex) {
      const result = convertHexToDecimal(fullCode);
      setDecimalResult(result);
    } else {
      setDecimalResult('');
    }
  }, [fullCode]);

  const handleCopy = async () => {
    if (decimalResult) {
      try {
        await navigator.clipboard.writeText(decimalResult);
        toast({
          title: "Copiado!",
          description: "Código MZone copiado para a área de transferência.",
        });
      } catch (err) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o código.",
          variant: "destructive",
        });
      }
    }
  };

  const handleClear = () => {
    setFirstDigits('');
    setMainCode('');
    setLastDigits('');
    setDecimalResult('');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-blue-800 text-lg">Código do iButton</CardTitle>
            <CardDescription>
              Digite o código completo do iButton em partes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <Label htmlFor="first-digits" className="text-xs font-medium text-gray-700">
                     Primeiros 2
                  </Label>
                  <Input
                    id="first-digits"
                    type="text"
                    placeholder="Ex: 3F"
                    value={firstDigits}
                    onChange={(e) => setFirstDigits(e.target.value.toUpperCase())}
                    className="mt-1 font-mono border-2 border-red-400 focus:border-red-600 focus:ring-red-600"
                    maxLength={2}
                  />
                </div>
                
                <div className="col-span-6">
                  <Label htmlFor="main-code" className="text-xs font-medium text-gray-700">
                    Código Principal
                  </Label>
                  <Input
                    id="main-code"
                    type="text"
                    placeholder="Ex: 000001156660"
                    value={mainCode}
                    onChange={(e) => setMainCode(e.target.value.toUpperCase())}
                    className={`mt-1 font-mono border-2 ${!isValid ? 'border-red-500 focus:border-red-500' : 'border-green-400 focus:border-green-600 focus:ring-green-600'}`}
                  />
                </div>
                
                <div className="col-span-3">
                  <Label htmlFor="last-digits" className="text-xs font-medium text-gray-700">
                    Últimos 2 
                  </Label>
                  <Input
                    id="last-digits"
                    type="text"
                    placeholder="Ex: 01"
                    value={lastDigits}
                    onChange={(e) => setLastDigits(e.target.value.toUpperCase())}
                    className="mt-1 font-mono border-2 border-blue-400 focus:border-blue-600 focus:ring-blue-600"
                    maxLength={2}
                  />
                </div>
              </div>
              
              {!isValid && fullCode && (
                <p className="text-red-500 text-xs mt-1">
                  Por favor, digite um código iButton válido (mínimo 15 dígitos hexadecimais)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50/50">
            <CardTitle className="text-green-800 text-lg">Código MZone</CardTitle>
            <CardDescription>
              Código convertido para MZone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="decimal-output" className="text-xs font-medium text-gray-700">
                  Código MZone
                </Label>
                <div className="relative">
                  <Input
                    id="decimal-output"
                    type="text"
                    value={decimalResult}
                    readOnly
                    className="mt-1 font-mono bg-gray-50 border-green-300"
                    placeholder="Código aparecerá aqui"
                  />
                  {decimalResult && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={handleClear}
          className="border-gray-300 hover:bg-gray-50"
        >
          Limpar
        </Button>
      </div>

      {/* Visual Flow Indicator */}
      {fullCode && isValid && (
        <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">iButton</p>
            <p className="font-mono text-lg font-bold text-blue-700">{fullCode}</p>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400" />
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">MZone</p>
            <p className="font-mono text-lg font-bold text-green-700">{decimalResult}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleConverter;
