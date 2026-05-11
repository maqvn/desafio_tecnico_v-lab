import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../components/EmptyState';

describe('EmptyState', () => {
  test('renderiza a mensagem passada via prop', () => {
    render(<EmptyState message="Nenhum curso encontrado." />);
    expect(screen.getByText('Nenhum curso encontrado.')).toBeInTheDocument();
  });

  test('renderiza mensagens diferentes corretamente', () => {
    render(<EmptyState message="Este curso ainda não possui aulas." />);
    expect(
      screen.getByText('Este curso ainda não possui aulas.')
    ).toBeInTheDocument();
  });
});
