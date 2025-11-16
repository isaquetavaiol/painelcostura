'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Percent } from 'lucide-react';
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
    
    // If an operator was the last thing typed, start a new display
    if (['+', '-', '*', '/'].includes(display)) {
        setDisplay(value);
    } else if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(prev => (prev.length < 12 ? prev + value : prev));
    }
    setExpression(prev => prev + value);
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
    if (display === 'Error' || expression === '') return;
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

  const handlePercentage = () => {
    if (display === 'Error' || display === '0') return;
    try {
      const currentValue = parseFloat(display);
      const result = currentValue / 100;
      const resultString = result.toString();
      
      // Heuristic to replace the last number in expression with its percentage value
      const match = expression.match(/(\d+\.?\d*)$/);
      if (match) {
        const lastNumber = match[0];
        const newExpression = expression.slice(0, -lastNumber.length) + resultString;
        setExpression(newExpression);
      } else {
        setExpression(resultString);
      }
      
      setDisplay(resultString);

    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  }
  
  const copyToClipboard = () => {
    if (display !== 'Error' && display !== '0') {
      navigator.clipboard.writeText(display);
      toast({
        title: 'Resultado Copiado',
        description: `O valor ${display} foi copiado para a área de transferência.`,
      });
    }
  };

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
            <Button onClick={clearDisplay} variant="destructive" className="h-full text-xl col-span-2">Limpar</Button>
            <Button onClick={handlePercentage} variant="default" className="h-full text-xl"><Percent className="w-5 h-5"/></Button>
            <Button onClick={() => handleOperator('/')} variant="default" className="h-full text-xl">/</Button>

            <Button onClick={() => handleInput('7')} variant="secondary" className="h-full text-xl">7</Button>
            <Button onClick={() => handleInput('8')} variant="secondary" className="h-full text-xl">8</Button>
            <Button onClick={() => handleInput('9')} variant="secondary" className="h-full text-xl">9</Button>
            <Button onClick={() => handleOperator('*')} variant="default" className="h-full text-xl">*</Button>

            <Button onClick={() => handleInput('4')} variant="secondary" className="h-full text-xl">4</Button>
            <Button onClick={() => handleInput('5')} variant="secondary" className="h-full text-xl">5</Button>
            <Button onClick={() => handleInput('6')} variant="secondary" className="h-full text-xl">6</Button>
            <Button onClick={() => handleOperator('-')} variant="default" className="h-full text-xl">-</Button>

            <Button onClick={() => handleInput('1')} variant="secondary" className="h-full text-xl">1</Button>
            <Button onClick={() => handleInput('2')} variant="secondary" className="h-full text-xl">2</Button>
            <Button onClick={() => handleInput('3')} variant="secondary" className="h-full text-xl">3</Button>
            <Button onClick={() => handleOperator('+')} variant="default" className="h-full text-xl">+</Button>

            <Button onClick={() => handleInput('0')} variant="secondary" className="h-full text-xl col-span-2">0</Button>
            <Button onClick={() => handleInput('.')} variant="secondary" className="h-full text-xl">.</Button>
            <Button onClick={calculateResult} variant="default" className="h-full text-xl">=</Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={copyToClipboard} className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copiar Resultado
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalculatorComponent;
