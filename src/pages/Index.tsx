
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SingleConverter from '@/components/SingleConverter';
import BatchConverter from '@/components/BatchConverter';
import { Calculator, FileText } from 'lucide-react';
import logo from "../assets/logo.png"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
       <div className="text-center">
  <h1 className="text-4xl font-bold mb-2">Conversor de iButton</h1>
  <p className="text-blue-100 text-lg">Scope Technology</p>
  <img
    src={logo}
    alt="Logo"
    className="mx-auto w-32 h-auto mt-4"
  />
</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Image Section */}
          <Card className="mb-8 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Guia de Utilização
              </CardTitle>
              <CardDescription>
                Identifique os números do iButton que devem ser digitados conforme a imagem abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/c5cfaaca-d882-4304-96f2-22b1a4816d33.png" 
                  alt="iButton - Exemplo de números a serem digitados"
                  className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-md border border-gray-200"
                />
                <p className="text-gray-600 text-sm mt-4">
                  Digite os números conforme mostrado na imagem do iButton acima
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Converter Tabs */}
          <Card className="shadow-xl border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
              <CardTitle className="text-blue-800">Conversor iButton → Código MZone</CardTitle>
              <CardDescription>
                Escolha o modo de conversão: individual ou em lote
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="single" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Conversão Individual
                  </TabsTrigger>
                  <TabsTrigger value="batch" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Conversão em Lote
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-6">
                  <SingleConverter />
                </TabsContent>

                <TabsContent value="batch" className="space-y-6">
                  <BatchConverter />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              © 2025 Scope Technology - Conversor de iButton
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
