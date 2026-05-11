import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CourseCard } from '../../components/CourseCard';

// CourseCard precisa de MemoryRouter porque usa useNavigate internamente
const renderCard = (props) =>
  render(
    <MemoryRouter>
      <CourseCard {...props} />
    </MemoryRouter>
  );

const mockCourse = {
  id: 1,
  name: 'Introdução ao React',
  description: 'Aprenda React do zero.',
  start_date: '2025-01-01T00:00:00.000Z',
  end_date: '2025-06-30T00:00:00.000Z',
  creator_id: 42,
};

describe('CourseCard', () => {
  test('renderiza o nome do curso', () => {
    renderCard({ course: mockCourse, userId: 99 });
    expect(screen.getByText('Introdução ao React')).toBeInTheDocument();
  });

  test('renderiza a descrição do curso', () => {
    renderCard({ course: mockCourse, userId: 99 });
    expect(screen.getByText('Aprenda React do zero.')).toBeInTheDocument();
  });

  test('exibe badge "Meu curso" quando userId === creator_id', () => {
    renderCard({ course: mockCourse, userId: 42 });
    expect(screen.getByText('Meu curso')).toBeInTheDocument();
  });

  test('não exibe badge "Meu curso" quando userId !== creator_id', () => {
    renderCard({ course: mockCourse, userId: 99 });
    expect(screen.queryByText('Meu curso')).not.toBeInTheDocument();
  });

  test('exibe "Sem descrição disponível." quando description está vazio', () => {
    const courseWithoutDesc = { ...mockCourse, description: '' };
    renderCard({ course: courseWithoutDesc, userId: 99 });
    expect(screen.getByText('Sem descrição disponível.')).toBeInTheDocument();
  });
});
