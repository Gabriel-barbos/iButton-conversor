/**
 * @param ibutton - String a ser validada
 * @returns true se for um código válido, false caso contrário
 */
export const validateHexInput = (ibutton: string): boolean => {
  if (!ibutton || ibutton.trim() === '') return false;
  
  const cleanIButton = ibutton.trim();
  
  const hexRegex = /^[0-9A-Fa-f]+$/;
  
  // Deve ter exatamente 16 dígitos no formato completo
  return hexRegex.test(cleanIButton) && cleanIButton.length === 16;
};

/**
 * Converte um código de iButton para código MZone
 * Extrai o código principal (posições 2-14), remove zeros à esquerda e converte para decimal
 * @param ibutton - Código completo do iButton (16 dígitos)
 * @returns Código MZone como string
 */
export const convertHexToDecimal = (ibutton: string): string => {
  if (!validateHexInput(ibutton)) {
    return 'INVÁLIDO';
  }
  
  try {
    const cleanIButton = ibutton.trim().toUpperCase();
    
    // Extrai o código principal (posições 2-14, excluindo primeiros 2 e últimos 2 dígitos)
    const mainCode = cleanIButton.substring(2, 14); // 000001A00BC4
    
    // Remove zeros à esquerda
    const hexWithoutLeadingZeros = mainCode.replace(/^0+/, '') || '0';
    
    // Converte para decimal
    const decimal = parseInt(hexWithoutLeadingZeros, 16);
    
    if (isNaN(decimal)) {
      return 'INVÁLIDO';
    }
    
    return decimal.toString();
  } catch (error) {
    console.error('Erro na conversão:', error);
    return 'ERRO';
  }
};

/**
 * Formatar código de iButton para exibição
 * @param ibutton - Código do iButton
 * @returns Código formatado
 */
export const formatHexDisplay = (ibutton: string): string => {
  return ibutton.trim().toUpperCase();
};

/**
 * Função auxiliar para debug - mostra o processo de conversão passo a passo
 * @param ibutton - Código do iButton
 * @returns Objeto com detalhes da conversão
 */
export const debugConversion = (ibutton: string) => {
  const cleanIButton = ibutton.trim().toUpperCase();
  
  const firstTwo = cleanIButton.substring(0, 2);
  const mainCode = cleanIButton.substring(2, 14);
  const lastTwo = cleanIButton.substring(14, 16);
  const hexWithoutZeros = mainCode.replace(/^0+/, '') || '0';
  const decimal = parseInt(hexWithoutZeros, 16);
  
  return {
    original: cleanIButton,
    firstTwo,
    mainCode,
    lastTwo,
    hexWithoutZeros,
    decimal: decimal.toString()
  };
};