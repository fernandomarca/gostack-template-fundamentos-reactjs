import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import Header from '../../components/Header';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [balanceApi, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const { transactions, balance } = response.data;

      const transactionsFormatted: Transaction[] = transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
          formattedDate: new Date(transaction.created_at).toLocaleDateString(
            'pt-br',
          ),
        }),
      );

      const balanceFormatted = {
        income: formatValue(balance.income),
        outcome: formatValue(balance.outcome),
        total: formatValue(balance.total),
      };

      setTransactions(transactionsFormatted);
      setBalance(balanceFormatted);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />

      <Container>
        {balanceApi ? (
          <CardContainer>
            <Card>
              <header>
                <p>Entradas</p>
                <img src={income} alt="Income" />
              </header>
              <h1 data-testid="balance-income">{balanceApi.income}</h1>
            </Card>
            <Card>
              <header>
                <p>Saídas</p>
                <img src={outcome} alt="Outcome" />
              </header>
              <h1 data-testid="balance-outcome">{balanceApi.outcome}</h1>
            </Card>
            <Card total>
              <header>
                <p>Total</p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">{balanceApi.total}</h1>
            </Card>
          </CardContainer>
        ) : (
            <p>Carregando...</p>
          )}

        {transactions ? (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(item => (
                  <tr key={item.id}>
                    <td className="title">{item.title}</td>
                    <td className={item.type}>
                      {item.type === 'outcome' && ' - '}
                      {item.formattedValue}
                    </td>
                    <td>{item.category.title}</td>
                    <td>{item.formattedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        ) : (
            <p>Carregando...</p>
          )}
      </Container>
    </>
  );
};

export default Dashboard;
