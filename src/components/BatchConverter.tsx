
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Download, Trash2 } from 'lucide-react';
import { validateHexInput, convertHexToDecimal } from '@/utils/converter';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

const BatchConverter = () => {
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<Array<{hex: string, decimal: string, isValid: boolean}>>([]);
  const { toast } = useToast();

  const processBatch = () => {
    const lines = batchInput.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      toast({
        title: "Atenção",
        description: "Por favor, digite pelo menos um código iButton.",
        variant: "destructive",
      });
      return;
    }

    const results = lines.map(line => {
      const hex = line.trim().toUpperCase();
      const isValid = validateHexInput(hex);
      const decimal = isValid ? convertHexToDecimal(hex) : 'INVÁLIDO';
      
      return { hex, decimal, isValid };
    });

    setBatchResults(results);

    const validCount = results.filter(r => r.isValid).length;
    const invalidCount = results.length - validCount;

    toast({
      title: "Conversão concluída",
      description: `${validCount} conversões válidas, ${invalidCount} inválidas.`,
    });
  };

  const handleCopyResults = async () => {
    if (batchResults.length === 0) return;

    const resultText = batchResults
      .map(result => `${result.hex} → ${result.decimal}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(resultText);
      toast({
        title: "Copiado!",
        description: "Resultados copiados para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar os resultados.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (batchResults.length === 0) return;

    // Criar dados para o Excel
    const data = [
      ['iButton', 'MZone'], // Cabeçalho
      ...batchResults.map(result => [result.hex, result.decimal])
    ];

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Adicionar a planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Conversao iButton');
    
    // Fazer download do arquivo
    XLSX.writeFile(wb, 'conversao_ibutton.xlsx');

    toast({
      title: "Download iniciado",
      description: "Arquivo Excel baixado com sucesso.",
    });
  };

  const handleClear = () => {
    setBatchInput('');
    setBatchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-blue-800 text-lg">Códigos em Lote</CardTitle>
            <CardDescription>
              Digite um código iButton por linha
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
                  placeholder={`3F000001156660301\n3F000001234ABCD01\n3F00000ABCDEF1234\n...`}
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value.toUpperCase())}
                  className="mt-1 font-mono h-32 border-blue-300 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Linhas vazias serão ignoradas
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={processBatch}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!batchInput.trim()}
                >
                  Converter Lote
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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
                  <div className="max-h-32 overflow-y-auto border border-green-300 rounded-md p-3 bg-gray-50">
                    <div className="space-y-1 font-mono text-sm">
                      {batchResults.map((result, index) => (
                        <div key={index} className={`flex justify-between items-center p-1 rounded ${
                          result.isValid ? 'text-green-700' : 'text-red-600 bg-red-50'
                        }`}>
                          <span>{result.hex}</span>
                          <span>→</span>
                          <span className="font-bold">{result.decimal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCopyResults}
                      className="flex-1 border-green-300 hover:bg-green-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDownload}
                      className="flex-1 border-green-300 hover:bg-green-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar para Excel
                    </Button>
                  </div>

                  <div className="text-xs text-gray-600 text-center">
                    {batchResults.filter(r => r.isValid).length} de {batchResults.length} conversões válidas
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Os códigos MZone aparecerão aqui após a conversão</p>
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
