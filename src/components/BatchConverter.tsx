import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Download, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { validateHexInput, convertHexToDecimal } from '@/utils/converter';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface BatchResult {
  original: string;
  hex: string;
  decimal: string;
  isValid: boolean;
  error?: string;
}

const BatchConverter = () => {
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processBatch = () => {
    setIsProcessing(true);
    
    const lines = batchInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    if (lines.length === 0) {
      toast({
        title: "Atenção",
        description: "Por favor, digite pelo menos um código iButton.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    const results: BatchResult[] = lines.map((line, index) => {
      const original = line;
      const hex = line.toUpperCase().replace(/[^0-9A-F]/g, ''); // Remove caracteres não-hex
      
      // Validações específicas
      let error = '';
      let isValid = false;
      let decimal = 'INVÁLIDO';

      if (hex.length !== 16) {
        error = `Deve ter exatamente 16 dígitos (atual: ${hex.length})`;
      } else if (!validateHexInput(hex)) {
        error = 'Contém caracteres inválidos';
      } else {
        isValid = true;
        const result = convertHexToDecimal(hex);
        if (result === 'INVÁLIDO' || result === 'ERRO') {
          isValid = false;
          error = 'Erro na conversão';
          decimal = result;
        } else {
          decimal = result;
        }
      }
      
      return { 
        original, 
        hex, 
        decimal, 
        isValid,
        error: isValid ? undefined : error
      };
    });

    setBatchResults(results);

    const validCount = results.filter(r => r.isValid).length;
    const invalidCount = results.length - validCount;

    toast({
      title: "Conversão concluída",
      description: `${validCount} conversões válidas, ${invalidCount} inválidas.`,
    });
    
    setIsProcessing(false);
  };

  const handleCopyResults = async () => {
    if (batchResults.length === 0) return;

    const validResults = batchResults.filter(r => r.isValid);
    
    if (validResults.length === 0) {
      toast({
        title: "Atenção",
        description: "Não há resultados válidos para copiar.",
        variant: "destructive",
      });
      return;
    }

    const resultText = validResults
      .map(result => `${result.hex} → ${result.decimal}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(resultText);
      toast({
        title: "Copiado!",
        description: `${validResults.length} resultados válidos copiados.`,
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar os resultados.",
        variant: "destructive",
      });
    }
  };

  const handleCopyOnlyMZone = async () => {
    const validResults = batchResults.filter(r => r.isValid);
    
    if (validResults.length === 0) {
      toast({
        title: "Atenção",
        description: "Não há códigos MZone válidos para copiar.",
        variant: "destructive",
      });
      return;
    }

    const mzoneOnly = validResults
      .map(result => result.decimal)
      .join('\n');

    try {
      await navigator.clipboard.writeText(mzoneOnly);
      toast({
        title: "Copiado!",
        description: `${validResults.length} códigos MZone copiados.`,
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar os códigos.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (batchResults.length === 0) return;

    // Criar dados para o Excel
    const data = [
      ['Original', 'iButton Limpo', 'MZone', 'Status', 'Erro'], // Cabeçalho
      ...batchResults.map(result => [
        result.original,
        result.hex,
        result.decimal,
        result.isValid ? 'Válido' : 'Inválido',
        result.error || ''
      ])
    ];

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Definir a largura das colunas
    ws['!cols'] = [
      { width: 20 }, // Original
      { width: 20 }, // iButton Limpo
      { width: 15 }, // MZone
      { width: 10 }, // Status
      { width: 30 }  // Erro
    ];
    
    // Adicionar a planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Conversao iButton');
    
    // Fazer download do arquivo
    const fileName = `conversao_ibutton_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Download iniciado",
      description: `Arquivo ${fileName} baixado com sucesso.`,
    });
  };

  const handleClear = () => {
    setBatchInput('');
    setBatchResults([]);
  };

  const validCount = batchResults.filter(r => r.isValid).length;
  const invalidCount = batchResults.length - validCount;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-blue-800 text-lg">Códigos em Lote</CardTitle>
            <CardDescription>
              Digite um código iButton por linha (16 dígitos hexadecimais)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="batch-input" className="text-sm font-medium text-gray-700">
                  Códigos iButton (um por linha)
                </Label>
                <Textarea
                  id="batch-input"
                  placeholder={`0C000001A00BC401\n0C000001234ABC01\n0C00000ABCDEF401\n...`}
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="mt-1 font-mono h-32 border-blue-300 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Linhas vazias e caracteres não-hexadecimais serão ignorados
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={processBatch}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!batchInput.trim() || isProcessing}
                >
                  {isProcessing ? 'Processando...' : 'Converter Lote'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="border-gray-300 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {batchInput && (
                <div className="text-xs text-gray-600">
                  <p>Linhas para processar: {batchInput.split('\n').filter(line => line.trim() !== '').length}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50/50">
            <CardTitle className="text-green-800 text-lg">Códigos MZone</CardTitle>
            <CardDescription>
              Conversões iButton → MZone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {batchResults.length > 0 ? (
                <>
                  <div className="max-h-40 overflow-y-auto border border-green-300 rounded-md p-3 bg-gray-50">
                    <div className="space-y-1 font-mono text-sm">
                      {batchResults.map((result, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded ${
                          result.isValid ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          <div className="flex items-center space-x-2 flex-1">
                            {result.isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="truncate">{result.hex}</span>
                          </div>
                          <span className="mx-2">→</span>
                          <div className="text-right">
                            <div className="font-bold">{result.decimal}</div>
                            {result.error && (
                              <div className="text-xs text-red-500">{result.error}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCopyResults}
                      className="border-green-300 hover:bg-green-50"
                      disabled={validCount === 0}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Pares
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCopyOnlyMZone}
                      className="border-green-300 hover:bg-green-50"
                      disabled={validCount === 0}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Só MZone
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDownload}
                      className="col-span-2 border-green-300 hover:bg-green-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>{validCount} válidos</span>
                    </div>
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{invalidCount} inválidos</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">📋</p>
                  <p>Os códigos MZone aparecerão aqui após a conversão</p>
                  <p className="text-xs mt-2">Formato esperado: 16 dígitos hexadecimais</p>
                  <p className="text-xs">Exemplo: 0C000001A00BC401</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BatchConverter;