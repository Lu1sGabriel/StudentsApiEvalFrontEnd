import {
  Modal,
  Group,
  Text,
  Badge,
  Avatar,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Paper,
  Progress,
  Title,
  CopyButton,
  Stack,
  Divider,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconId,
  IconCopy,
  IconCheck,
  IconStar,
  IconTrendingUp,
  IconSchool,
  IconChartBar,
  IconEye,
} from '@tabler/icons-react';
import { formatCPF } from '@/utils/formatCpfUtils';
import { Student } from '@/services/client/student';

interface StudentViewModalProps {
  student: Student | null;
  opened: boolean;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export default function StudentViewModal({ student, opened, onClose }: StudentViewModalProps) {
  if (!student) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradeBadgeColor = (grade: number) => {
    if (grade >= 9) return 'green';
    if (grade >= 7) return 'blue';
    if (grade >= 5) return 'yellow';
    return 'red';
  };

  const getGradeStatus = (grade: number) => {
    if (grade >= 9) return { status: 'Excelente', color: 'green', icon: IconStar };
    if (grade >= 7) return { status: 'Bom', color: 'blue', icon: IconTrendingUp };
    if (grade >= 5) return { status: 'Regular', color: 'yellow', icon: IconSchool };
    return { status: 'Precisa Melhorar', color: 'red', icon: IconChartBar };
  };

  const gradeInfo = getGradeStatus(student.grade);
  const GradeIcon = gradeInfo.icon;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      radius="lg"
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      transitionProps={{
        transition: 'slide-up',
        duration: 300,
      }}
      classNames={{
        content: 'overflow-hidden',
        body: 'p-0',
      }}
    >
      <Stack gap={0}>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-blue-100">
          <Group gap="md" align="center">
            <ThemeIcon size={50} radius="xl" color="blue" variant="light">
              <IconEye size={28} />
            </ThemeIcon>
            <div>
              <Text size="xl" fw={700} className="text-blue-800">
                Perfil do Estudante
              </Text>
              <Text size="sm" c="dimmed" className="text-blue-600">
                Informações detalhadas
              </Text>
            </div>
          </Group>
        </div>

        {/* Student Header Card */}
        <div className="px-6 pt-6">
          <Paper className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-lg">
            <Group align="center" gap="lg">
              <Avatar size={80} radius="xl">
                {getInitials(student.name)}
              </Avatar>
              <div className="flex-1">
                <Title order={3} className="text-gray-900 mb-3">
                  {student.name}
                </Title>
                <Group mb="md" gap="sm">
                  <Badge
                    color={getGradeBadgeColor(student.grade)}
                    size="lg"
                    variant="filled"
                    className="font-bold"
                    leftSection={<GradeIcon size={16} />}
                  >
                    Nota: {student.grade.toFixed(1)}
                  </Badge>
                  <Badge variant="outline" color={gradeInfo.color} size="lg" className="font-medium">
                    {gradeInfo.status}
                  </Badge>
                </Group>
                <div className="space-y-2">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" className="font-medium">
                      Desempenho Acadêmico
                    </Text>
                    <Text size="sm" fw={500} className="text-gray-700">
                      {student.grade.toFixed(1)}/10
                    </Text>
                  </Group>
                  <Progress
                    value={(student.grade / 10) * 100}
                    color={getGradeBadgeColor(student.grade)}
                    size="lg"
                    className="w-full"
                    radius="md"
                  />
                </div>
              </div>
            </Group>
          </Paper>
        </div>

        <div className="p-6">
          <Stack gap="lg">
            <div>
              <Group mb="md" gap="sm">
                <ThemeIcon size={24} color="blue" variant="light">
                  <IconUser size={16} />
                </ThemeIcon>
                <Title order={4} className="text-gray-800">
                  Informações Pessoais
                </Title>
              </Group>

              <Paper className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  {/* Linha do Email */}
                  <div className="flex items-center gap-4">
                    <ThemeIcon size={36} className="bg-blue-100 text-blue-600" variant="light">
                      <IconMail size={18} />
                    </ThemeIcon>
                    <Text className="font-medium text-gray-900 break-all flex-1">{student.email}</Text>
                    <CopyButton value={student.email}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copiado!' : 'Copiar email'}>
                          <ActionIcon color={copied ? 'green' : 'blue'} variant="subtle" onClick={copy} size="lg">
                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </div>

                  {/* Linha do CPF */}
                  <div className="flex items-center gap-4">
                    <ThemeIcon size={36} className="bg-green-100 text-green-600" variant="light">
                      <IconId size={18} />
                    </ThemeIcon>
                    <Text className="font-mono font-medium text-gray-900 flex-1">{formatCPF(student.cpf)}</Text>
                    <CopyButton value={student.cpf}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copiado!' : 'Copiar CPF'}>
                          <ActionIcon color={copied ? 'green' : 'blue'} variant="subtle" onClick={copy} size="lg">
                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </div>
                </div>
              </Paper>
            </div>

            <Divider />

            <Paper className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 p-5 rounded-lg">
              <Group justify="space-between" align="center">
                <div>
                  <Text size="sm" c="dimmed" className="font-medium mb-1">
                    Resumo do Desempenho
                  </Text>
                  <Text size="lg" fw={600} className="text-gray-900">
                    {gradeInfo.status}
                  </Text>
                </div>
                <ThemeIcon size={48} color={gradeInfo.color} variant="light">
                  <GradeIcon size={24} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Stack>
        </div>
      </Stack>
    </Modal>
  );
}
