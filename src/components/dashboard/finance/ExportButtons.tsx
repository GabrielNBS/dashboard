'use client';

import React, { useState } from 'react';
import { FileText, Table, FileSpreadsheet, CheckCircle2, Loader2 } from 'lucide-react';
import { FinanceSummary } from '@/hooks/business';
import { Sale } from '@/types/sale';
import { formatCurrency } from '@/utils/formatting/formatCurrency';
import { Button } from '@/components/ui/base';
import { cn } from '@/utils/utils';

interface ExportButtonsProps {
  financialSummary: FinanceSummary;
  sales: Sale[];
  fileName?: string;
}

interface ExportButtonsProps {
  financialSummary: FinanceSummary;
  sales: Sale[];
  fileName?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  financialSummary,
  sales,
  fileName = 'financial-report',
}) => {
  const [exportStatus, setExportStatus] = useState<Record<string, 'idle' | 'loading' | 'success'>>(
    {}
  );

  const setStatus = (type: string, status: 'idle' | 'loading' | 'success') => {
    setExportStatus(prev => ({ ...prev, [type]: status }));
    if (status === 'success') {
      setTimeout(() => setExportStatus(prev => ({ ...prev, [type]: 'idle' })), 2000);
    }
  };

  const exportToCSV = () => {
    setStatus('csv', 'loading');

    setTimeout(() => {
      // ---- Resumo Financeiro ----
      const summaryData = [
        ['Métrica', 'Valor'],
        ['Receita Total', financialSummary.totalRevenue],
        ['Custo Fixo', financialSummary.totalFixedCost],
        ['Custo Variável', financialSummary.totalVariableCost],
        ['Lucro Bruto', financialSummary.grossProfit],
        ['Lucro Líquido', financialSummary.netProfit],
        ['Margem de Lucro', financialSummary.margin],
        ['Ponto de Equilíbrio', financialSummary.breakEven],
      ];

      // ---- Vendas ----
      const salesData = sales.map(sale => ({
        'ID da Venda': sale.id,
        Data: new Date(sale.date).toLocaleDateString(),
        'Total da Venda': sale.sellingResume.totalValue,
        Itens: sale.items.map(item => `${item.product.name} (x${item.quantity})`).join(', '),
      }));

      // ---- Combina as duas seções ----
      const csvHeader = 'Resumo Financeiro\n';
      const summaryCSV = summaryData.map(row => row.join(',')).join('\n');
      const salesHeader = '\n\nVendas\n';
      const salesCSV = [
        'ID da Venda,Data,Total da Venda,Itens',
        ...salesData.map(sale =>
          [sale['ID da Venda'], sale.Data, sale['Total da Venda'], `"${sale.Itens}"`].join(',')
        ),
      ].join('\n');

      const finalCSV = csvHeader + summaryCSV + salesHeader + salesCSV;

      // ---- Download do arquivo ----
      const blob = new Blob([finalCSV], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setStatus('csv', 'success');
    }, 1000);
  };

  const exportToXLSX = () => {
    setStatus('xlsx', 'loading');

    setTimeout(() => {
      // Simulando a funcionalidade XLSX sem a biblioteca
      const summaryData = [
        ['Métrica', 'Valor'],
        ['Receita Total', financialSummary.totalRevenue],
        ['Custo Fixo', financialSummary.totalFixedCost],
        ['Custo Variável', financialSummary.totalVariableCost],
        ['Lucro Bruto', financialSummary.grossProfit],
        ['Lucro Líquido', financialSummary.netProfit],
        ['Margem de Lucro', financialSummary.margin],
        ['Ponto de Equilíbrio', financialSummary.breakEven],
      ];

      const salesData = sales.map(sale => ({
        'ID da Venda': sale.id,
        Data: new Date(sale.date).toLocaleDateString(),
        'Total da Venda': sale.sellingResume.totalValue,
        Itens: sale.items.map(item => `${item.product.name} (x${item.quantity})`).join(', '),
      }));

      // Para esta demonstração, vamos criar um CSV estruturado que simula XLSX
      const xlsxContent = [
        'Planilha: Resumo Financeiro',
        ...summaryData.map(row => row.join(',')),
        '',
        'Planilha: Vendas',
        'ID da Venda,Data,Total da Venda,Itens',
        ...salesData.map(sale =>
          [sale['ID da Venda'], sale.Data, sale['Total da Venda'], `"${sale.Itens}"`].join(',')
        ),
      ].join('\n');

      const blob = new Blob([xlsxContent], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setStatus('xlsx', 'success');
    }, 1200);
  };

  const exportToHTML = () => {
    setStatus('html', 'loading');

    setTimeout(() => {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Relatório Financeiro</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 1rem;
              padding: 2rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            h1 { 
              color: #1a202c;
              border-bottom: 3px solid #667eea;
              padding-bottom: 1rem;
              margin-bottom: 2rem;
            }
            h2 {
              color: #2d3748;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
              margin-bottom: 2rem;
            }
            .metric-card {
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              padding: 1.5rem;
              border-radius: 0.5rem;
              border: 1px solid #e2e8f0;
            }
            .metric-label {
              font-weight: 600;
              color: #4a5568;
              font-size: 0.875rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .metric-value {
              font-size: 1.5rem;
              font-weight: 700;
              color: #1a202c;
              margin-top: 0.5rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
              background: white;
              border-radius: 0.5rem;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            th, td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            th {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-weight: 600;
            }
            tr:hover {
              background-color: #f7fafc;
            }
            .footer {
              margin-top: 2rem;
              text-align: center;
              color: #718096;
              font-size: 0.875rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📊 Relatório Financeiro</h1>
            
            <h2>💰 Resumo Financeiro</h2>
            <div class="summary-grid">
              <div class="metric-card">
                <div class="metric-label">Receita Total</div>
                <div class="metric-value">${formatCurrency(financialSummary.totalRevenue)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Custo Fixo</div>
                <div class="metric-value">${formatCurrency(financialSummary.totalFixedCost || 0)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Custo Variável</div>
                <div class="metric-value">${formatCurrency(financialSummary.totalVariableCost || 0)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Lucro Bruto</div>
                <div class="metric-value">${formatCurrency(financialSummary.grossProfit)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Lucro Líquido</div>
                <div class="metric-value">${formatCurrency(financialSummary.netProfit)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Margem de Lucro</div>
                <div class="metric-value">${financialSummary.margin}%</div>
              </div>
            </div>

            <h2>🛒 Vendas Realizadas</h2>
            <table>
              <thead>
                <tr>
                  <th>ID da Venda</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Itens</th>
                </tr>
              </thead>
              <tbody>
                ${sales
                  .map(
                    sale => `
                  <tr>
                    <td><strong>${sale.id}</strong></td>
                    <td>${new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                    <td><strong>${formatCurrency(sale.sellingResume.totalValue)}</strong></td>
                    <td>${sale.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setStatus('html', 'success');
    }, 1200);
  };

  const ButtonContent = ({
    type,
    icon: Icon,
    label,
  }: {
    type: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) => {
    const status = exportStatus[type] || 'idle';

    if (status === 'loading') {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Exportando...</span>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Exportado!</span>
        </>
      );
    }

    return (
      <>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </>
    );
  };

  const buttonClassName =
    'group border-1 border-secondary hover:border-transparent relative overflow-hidden rounded-lg px-4 py-2 transition-all duration-300 hover:-translate-y-0.5  hover:from-green-100 hover:to-emerald-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCSV}
        disabled={exportStatus.csv === 'loading'}
        className={cn(buttonClassName, 'hover:bg-great-hover hover:text-primary')}
      >
        <div className="relative flex items-center gap-2">
          <ButtonContent type="csv" icon={Table} label="Exportar CSV" />
        </div>
      </Button>

      <Button
        onClick={exportToXLSX}
        disabled={exportStatus.xlsx === 'loading'}
        className={cn(buttonClassName, 'hover:bg-warning-hover hover:text-primary')}
      >
        <div className="relative flex items-center gap-2">
          <ButtonContent type="xlsx" icon={FileSpreadsheet} label="Exportar XLSX" />
        </div>
      </Button>

      <Button
        onClick={exportToHTML}
        disabled={exportStatus.html === 'loading'}
        className={cn(buttonClassName, 'hover:bg-info-hover hover:text-primary')}
      >
        <div className="relative flex items-center gap-2">
          <ButtonContent type="html" icon={FileText} label="Exportar HTML" />
        </div>
      </Button>
    </div>
  );
};
