import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonModal } from '../../components/LessonModal';

const noop = () => {};

const newLesson = { title: '', video_url: '', status: 'published' };
const existingLesson = { id: 5, title: 'Aula Existente', video_url: 'https://youtube.com', status: 'draft' };

describe('LessonModal — modo Adicionar (sem id)', () => {
  test('exibe o título "Adicionar Nova Aula"', () => {
    render(
      <LessonModal lesson={newLesson} onSubmit={noop} onClose={noop} onChange={noop} />
    );
    expect(screen.getByText('Adicionar Nova Aula')).toBeInTheDocument();
  });

  test('exibe o botão "Salvar Aula"', () => {
    render(
      <LessonModal lesson={newLesson} onSubmit={noop} onClose={noop} onChange={noop} />
    );
    expect(screen.getByRole('button', { name: /Salvar Aula/i })).toBeInTheDocument();
  });
});

describe('LessonModal — modo Editar (com id)', () => {
  test('exibe o título "Editar Aula"', () => {
    render(
      <LessonModal lesson={existingLesson} onSubmit={noop} onClose={noop} onChange={noop} />
    );
    expect(screen.getByText('Editar Aula')).toBeInTheDocument();
  });

  test('exibe o botão "Salvar Alterações"', () => {
    render(
      <LessonModal lesson={existingLesson} onSubmit={noop} onClose={noop} onChange={noop} />
    );
    expect(screen.getByRole('button', { name: /Salvar Alterações/i })).toBeInTheDocument();
  });

  test('pré-popula o campo título com o valor da aula', () => {
    render(
      <LessonModal lesson={existingLesson} onSubmit={noop} onClose={noop} onChange={noop} />
    );
    expect(screen.getByDisplayValue('Aula Existente')).toBeInTheDocument();
  });
});

describe('LessonModal — interação', () => {
  test('chama onClose ao clicar no botão X', async () => {
    const handleClose = vi.fn();
    render(
      <LessonModal lesson={newLesson} onSubmit={noop} onClose={handleClose} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: '' })); // botão X sem texto
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
