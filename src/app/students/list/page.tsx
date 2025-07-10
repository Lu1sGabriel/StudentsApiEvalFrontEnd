'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Text,
  Badge,
  Card,
  Title,
  Alert,
  TextInput,
  Select,
  Group,
  Button,
  ActionIcon,
  Tooltip,
  Container,
  Stack,
  Avatar,
  ThemeIcon,
  Skeleton,
  Progress,
  Center,
} from '@mantine/core';
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconAlertCircle,
  IconUserPlus,
  IconRefresh,
  IconFilter,
  IconSortDescending,
  IconSortAscending,
  IconUsers,
  IconTrendingUp,
  IconMail,
  IconId,
  IconCalendar,
  IconStar,
  IconSchool,
} from '@tabler/icons-react';
import InsertStudentModal from '../modals/insert';
import StudentViewModal from '../modals/detail';
import { formatCPF } from '@/utils/formatCpfUtils';
import { formatDate } from '@/utils/formatDateUtils';
import { CreateStudent, Student, studentApi } from '@/services/client/student';
import EditStudentModal from '../modals/edit';
import ConfirmDeactivateModal from '../modals/deactivate';

type SortField = 'name' | 'email' | 'grade' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [studentToDeactivate, setStudentToDeactivate] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getAll();
      setStudents(data);
    } catch {
      setError('Ocorreu um erro ao carregar a lista de estudantes.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeactivateStudent = async () => {
    if (!studentToDeactivate) return;

    setDeleting(true);
    try {
      await studentApi.deactivate(studentToDeactivate.id);
      setConfirmModalOpen(false);
      fetchStudents();
    } catch (err) {
      setError('Erro ao desativar estudante.');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    let filtered = students;

    if (searchFilter.trim()) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.cpf.includes(search),
      );
    }

    if (gradeFilter) {
      const gradeNum = parseFloat(gradeFilter);
      filtered = filtered.filter(s => s.grade === gradeNum);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'grade':
          aValue = a.grade;
          bValue = b.grade;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredStudents(filtered);
  }, [students, searchFilter, gradeFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (student: CreateStudent) => {
    try {
      await studentApi.create(student);
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error('Erro ao adicionar estudante:', err);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleConfirmDeactivate = (student: Student) => {
    setStudentToDeactivate(student);
    setConfirmModalOpen(true);
  };

  const getGradeBadgeColor = (grade: number) => {
    if (grade >= 9) return 'green';
    if (grade >= 7) return 'blue';
    if (grade >= 5) return 'yellow';
    return 'red';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <IconSortAscending size={14} className="ml-1" />
    ) : (
      <IconSortDescending size={14} className="ml-1" />
    );
  };

  const getGradeStats = () => {
    const total = students.length;
    const excellent = students.filter(s => s.grade >= 9).length;
    const good = students.filter(s => s.grade >= 7 && s.grade < 9).length;
    const average = students.filter(s => s.grade >= 5 && s.grade < 7).length;
    const poor = students.filter(s => s.grade < 5).length;

    return { total, excellent, good, average, poor };
  };

  const stats = getGradeStats();

  if (loading)
    return (
      <Container size="xl" className="py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton height={40} width={200} />
            <Skeleton height={40} width={160} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={120} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton height={40} className="flex-1" />
              <Skeleton height={40} width={200} />
            </div>
            <Skeleton height={400} />
          </div>
        </div>
      </Container>
    );

  if (error)
    return (
      <Container size="xl" className="py-8">
        <Card className="border-red-200 bg-red-50">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Erro"
            color="red"
            mb="md"
            className="border-none bg-transparent"
          >
            {error}
          </Alert>
          <Button leftSection={<IconRefresh size="1rem" />} onClick={fetchStudents} variant="filled" color="red">
            Tentar novamente
          </Button>
        </Card>
      </Container>
    );

  const uniqueGrades = Array.from(new Set(students.map(s => s.grade))).sort((a, b) => b - a);

  return (
    <Container size="xl" className="py-8 space-y-6">
      <InsertStudentModal opened={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddStudent} />

      <StudentViewModal
        student={selectedStudent}
        opened={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={handleEditStudent}
      />

      <EditStudentModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={selectedStudent}
        onSave={fetchStudents}
      />

      <ConfirmDeactivateModal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeactivateStudent}
        studentName={studentToDeactivate?.name || ''}
        loading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title
            order={1}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Estudantes
          </Title>
          <Text size="sm" c="dimmed" className="mt-1">
            Gerencie todos os estudantes cadastrados no sistema
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconUserPlus size="1rem" />}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => setModalOpen(true)}
          >
            Adicionar Estudante
          </Button>
        </Group>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed" className="font-medium">
                Total de Estudantes
              </Text>
              <Text size="xl" className="font-bold text-blue-700">
                {stats.total}
              </Text>
            </div>
            <ThemeIcon size={48} className="bg-blue-500">
              <IconUsers size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed" className="font-medium">
                Excelente (9+)
              </Text>
              <Text size="xl" className="font-bold text-green-700">
                {stats.excellent}
              </Text>
            </div>
            <ThemeIcon size={48} className="bg-green-500">
              <IconStar size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed" className="font-medium">
                Bom (7-8.9)
              </Text>
              <Text size="xl" className="font-bold text-yellow-700">
                {stats.good}
              </Text>
            </div>
            <ThemeIcon size={48} className="bg-yellow-500">
              <IconTrendingUp size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed" className="font-medium">
                Média Geral
              </Text>
              <Text size="xl" className="font-bold text-purple-700">
                {students.length > 0
                  ? (students.reduce((acc, s) => acc + s.grade, 0) / students.length).toFixed(1)
                  : '0.0'}
              </Text>
            </div>
            <ThemeIcon size={48} className="bg-purple-500">
              <IconSchool size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
        <Group mb="md" grow>
          <TextInput
            placeholder="Buscar por nome, email ou CPF..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            leftSection={<IconSearch size="1rem" />}
            className="flex-1"
            size="md"
          />
          <Select
            placeholder="Filtrar por nota"
            value={gradeFilter}
            onChange={val => setGradeFilter(val || '')}
            leftSection={<IconFilter size="1rem" />}
            data={[
              { value: '', label: 'Todas as notas' },
              ...uniqueGrades.map(grade => ({
                value: grade.toString(),
                label: `Nota ${grade}`,
              })),
            ]}
            clearable
            size="md"
          />
        </Group>
      </Card>

      {/* Results */}
      {filteredStudents.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <Center className="py-16">
            <Stack align="center">
              <ThemeIcon size={80} className="bg-gray-400">
                <IconUsers size={40} />
              </ThemeIcon>
              <Text size="lg" className="font-medium text-gray-600">
                {students.length === 0 ? 'Nenhum estudante cadastrado' : 'Nenhum estudante encontrado'}
              </Text>
              <Text size="sm" c="dimmed" className="text-center max-w-md">
                {students.length === 0
                  ? 'Comece adicionando o primeiro estudante ao sistema'
                  : 'Tente ajustar os filtros para encontrar o que procura'}
              </Text>
              {students.length === 0 && (
                <Button leftSection={<IconUserPlus size="1rem" />} onClick={() => setModalOpen(true)} className="mt-4">
                  Adicionar Primeiro Estudante
                </Button>
              )}
            </Stack>
          </Center>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table striped highlightOnHover className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="p-4">
                    <Button
                      variant="subtle"
                      onClick={() => handleSort('name')}
                      className="font-semibold text-gray-700 hover:text-blue-600"
                      rightSection={renderSortIcon('name')}
                    >
                      Estudante
                    </Button>
                  </th>
                  <th className="p-4">
                    <Button
                      variant="subtle"
                      onClick={() => handleSort('email')}
                      className="font-semibold text-gray-700 hover:text-blue-600"
                      rightSection={renderSortIcon('email')}
                    >
                      Contato
                    </Button>
                  </th>
                  <th className="p-4">
                    <Button
                      variant="subtle"
                      onClick={() => handleSort('grade')}
                      className="font-semibold text-gray-700 hover:text-blue-600"
                      rightSection={renderSortIcon('grade')}
                    >
                      Desempenho
                    </Button>
                  </th>
                  <th className="p-4">
                    <Text className="font-semibold text-gray-700">Identificação</Text>
                  </th>
                  <th className="p-4">
                    <Button
                      variant="subtle"
                      onClick={() => handleSort('createdAt')}
                      className="font-semibold text-gray-700 hover:text-blue-600"
                      rightSection={renderSortIcon('createdAt')}
                    >
                      Data
                    </Button>
                  </th>
                  <th className="p-4">
                    <Text className="font-semibold text-gray-700">Ações</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4">
                      <Group>
                        <Avatar
                          size={40}
                          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold"
                        >
                          {getInitials(student.name)}
                        </Avatar>
                        <div>
                          <Text className="font-medium text-gray-900">{student.name}</Text>
                          <Badge variant="outline" size="xs" className="mt-1">
                            {student.firstLetterThatDontRepeat}
                          </Badge>
                        </div>
                      </Group>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Group>
                          <IconMail size={14} className="text-gray-400" />
                          <Text size="sm" className="text-gray-600">
                            {student.email}
                          </Text>
                        </Group>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Badge
                          color={getGradeBadgeColor(student.grade)}
                          size="lg"
                          variant="filled"
                          className="font-bold"
                        >
                          {student.grade.toFixed(1)}
                        </Badge>
                        <Progress
                          value={(student.grade / 10) * 100}
                          color={getGradeBadgeColor(student.grade)}
                          size="xs"
                          className="w-20"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <Group>
                        <IconId size={14} className="text-gray-400" />
                        <Text size="sm" className="font-mono text-gray-600">
                          {formatCPF(student.cpf)}
                        </Text>
                      </Group>
                    </td>
                    <td className="p-4">
                      <Group>
                        <IconCalendar size={14} className="text-gray-400" />
                        <Text size="sm" className="text-gray-600">
                          {formatDate(student.createdAt)}
                        </Text>
                      </Group>
                    </td>
                    <td className="p-4">
                      <Group>
                        <Tooltip label="Visualizar detalhes">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewStudent(student)}
                            className="hover:bg-blue-100"
                          >
                            <IconEye size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Editar estudante">
                          <ActionIcon
                            variant="subtle"
                            color="yellow"
                            onClick={() => handleEditStudent(student)}
                            className="hover:bg-yellow-100"
                          >
                            <IconEdit size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Desativar um estudante">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleConfirmDeactivate(student)}
                            className="hover:bg-red-100"
                          >
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Footer */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-t-4 border-t-blue-500">
        <Group justify="space-between">
          <Text size="sm" className="font-medium text-gray-700">
            Exibindo {filteredStudents.length} de {students.length} estudante(s)
          </Text>
          <Group>
            <Text size="xs" c="dimmed">
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </Text>
            <Button variant="subtle" size="xs" leftSection={<IconRefresh size="0.8rem" />} onClick={fetchStudents}>
              Atualizar
            </Button>
          </Group>
        </Group>
      </Card>
    </Container>
  );
}
