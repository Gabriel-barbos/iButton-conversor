
/**
 * @param ibutton - String a ser validada
 * @returns true se for um código válido, false caso contrário
 */
export const validateHexInput = (ibutton: string): boolean => {
  if (!ibutton || ibutton.trim() === '') return false;
  
  const cleanIButton = ibutton.trim();
  
  const hexRegex = /^[0-9A-Fa-f]+$/;
  
  // Deve ter pelo menos 15 dígitos para extrair a parte necessária (posições 8-15)
  return hexRegex.test(cleanIButton) && cleanIButton.length >= 15;
};

/**
 * Converte um código de iButton para código MZone
 * Extrai os dígitos 8-15 e converte para decimal
 * @param ibutton - Código completo do iButton
 * @returns Código MZone como string
 */
export const convertHexToDecimal = (ibutton: string): string => {
  if (!validateHexInput(ibutton)) {
    return 'INVÁLIDO';
  }
  
  try {
    const cleanIButton = ibutton.trim().toUpperCase();
    
    // Extrai apenas os dígitos 8-15
    const extractedHex = cleanIButton.substring(7, 15);
    
    const decimal = parseInt(extractedHex, 16);
    
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
