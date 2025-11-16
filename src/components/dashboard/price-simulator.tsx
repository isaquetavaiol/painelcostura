'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CalculatorComponent = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const { toast } = useToast();

  const handleInput = (value: string) => {
    if (display === 'Error') {
      setDisplay(value);
      setExpression(value);
      return;
    }
    if (display === '0' && value !== '.') {
      setDisplay(value);
      setExpression(prev => prev + value);
    } else {
      setDisplay(prev => prev + value);
      setExpression(prev => prev + value);
    }
  };

  const handleOperator = (operator: string) => {
    if (display === 'Error') return;
    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      setExpression(prev => prev.slice(0, -1) + operator);
    } else {
      setExpression(prev => prev + operator);
    }
    setDisplay(operator);
  };
  
  const clearDisplay = () => {
    setDisplay('0');
    setExpression('');
  };

  const calculateResult = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(expression.replace(/--/g, '+'));
      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation");
      }
      const resultString = parseFloat(result.toPrecision(10)).toString();
      setDisplay(resultString);
      setExpression(resultString);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };
  
  const copyToClipboard = () => {
    if (display !== 'Error' && display !== '0') {
      navigator.clipboard.writeText(display);
      toast({
        title: 'Resultado Copiado',
        description: `O valor ${display} foi copiado para a área de transferência.`,
      });
    }
  };


  const buttons = [
    { label: '7', action: () => handleInput('7') },
    { label: '8', action: () => handleInput('8') },
    { label: '9', action: () => handleInput('9') },
    { label: '/', action: () => handleOperator('/') },
    { label: '4', action: () => handleInput('4') },
    { label: '5', action: () => handleInput('5') },
    { label: '6', action: () => handleInput('6') },
    { label: '*', action: () => handleOperator('*') },
    { label: '1', action: () => handleInput('1') },
    { label: '2', action: () => handleInput('2') },
    { label: '3', action: () => handleInput('3') },
    { label: '-', action: () => handleOperator('-') },
    { label: '0', action: () => handleInput('0') },
    { label: '.', action: () => handleInput('.') },
    { label: '=', action: calculateResult, className: 'col-span-2' },
    { label: '+', action: () => handleOperator('+') },
  ];

  return (
    <Card className="h-full flex flex-col animate-card-in" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Calculadora</CardTitle>
        <CardDescription>Faça cálculos rápidos para seus projetos.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow space-y-4">
        <div className="relative">
          <Input 
            readOnly 
            value={display} 
            className="h-16 text-4xl text-right pr-4 bg-muted/50"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 flex-grow">
          {buttons.map(btn => (
            <Button
              key={btn.label}
              onClick={btn.action}
              variant={['/', '*', '-', '+', '='].includes(btn.label) ? 'default' : 'secondary'}
              className={`h-full text-xl ${btn.className || ''}`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
         <Button onClick={clearDisplay} variant="outline" className="w-full">
            Limpar
          </Button>
        <Button onClick={copyToClipboard} className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copiar Resultado
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalculatorComponent;
