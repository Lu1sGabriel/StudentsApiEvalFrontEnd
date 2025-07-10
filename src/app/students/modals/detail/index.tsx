import {
  Modal,
  Group,
  Text,
  Badge,
  Avatar,
  Card,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Paper,
  Progress,
  Grid,
  Title,
  CopyButton,
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
  IconBookmark,
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
      size="lg"
      title={
        <Group>
          <ThemeIcon size={32} className="bg-gradient-to-br from-blue-500 to-purple-600">
            <IconUser size={18} />
          </ThemeIcon>
          <div>
            <Text size="lg" className="font-bold !text-black">
              Perfil do Estudante
            </Text>
            <Text size="sm" c="dimmed">
              Informações detalhadas e histórico
            </Text>
          </div>
        </Group>
      }
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      transitionProps={{ transition: 'fade', duration: 200 }}
      className="overflow-hidden"
    >
      <div className="space-y-6">
        {/* Header do Estudante */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <Group>
            <Avatar size={80} className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
              {getInitials(student.name)}
            </Avatar>
            <div className="flex-1">
              <Title order={3} className="text-gray-900 mb-2">
                {student.name}
              </Title>
              <Group mb="xs">
                <Badge
                  color={getGradeBadgeColor(student.grade)}
                  size="lg"
                  variant="filled"
                  className="font-bold"
                  leftSection={<GradeIcon size={16} />}
                >
                  Nota: {student.grade.toFixed(1)}
                </Badge>
                <Badge variant="outline" color={gradeInfo.color} size="lg">
                  {gradeInfo.status}
                </Badge>
              </Group>
              <Progress
                value={(student.grade / 10) * 100}
                color={getGradeBadgeColor(student.grade)}
                size="md"
                className="w-full"
              />
            </div>
          </Group>
        </Card>

        <Card className="border-2 border-gray-200">
          <Title order={4} className="text-gray-800 mb-4 flex items-center gap-2">
            <IconUser size={20} className="text-blue-500" />
            Informações Pessoais
          </Title>

          <Grid>
            <Grid.Col span={12}>
              <Paper className="bg-gray-50 p-4 rounded-lg">
                <Group justify="space-between" className="mb-3">
                  <Group>
                    <ThemeIcon size={36} className="bg-blue-100 text-blue-600">
                      <IconMail size={18} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed" className="font-medium">
                        Email
                      </Text>
                      <Text className="font-medium text-gray-900">{student.email}</Text>
                    </div>
                  </Group>
                  <CopyButton value={student.email}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copiado!' : 'Copiar email'}>
                        <ActionIcon color={copied ? 'green' : 'blue'} variant="subtle" onClick={copy}>
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>

                <Group justify="space-between" className="mb-3">
                  <Group>
                    <ThemeIcon size={36} className="bg-green-100 text-green-600">
                      <IconId size={18} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed" className="font-medium">
                        CPF
                      </Text>
                      <Text className="font-mono font-medium text-gray-900">{formatCPF(student.cpf)}</Text>
                    </div>
                  </Group>
                  <CopyButton value={student.cpf}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copiado!' : 'Copiar CPF'}>
                        <ActionIcon color={copied ? 'green' : 'blue'} variant="subtle" onClick={copy}>
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>

                <Group>
                  <ThemeIcon size={36} className="bg-purple-100 text-purple-600">
                    <IconBookmark size={18} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed" className="font-medium">
                      Primeira Letra Única
                    </Text>
                    <Badge variant="outline" color="purple" size="lg" className="font-bold">
                      {student.firstLetterThatDontRepeat}
                    </Badge>
                  </div>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>
      </div>
    </Modal>
  );
}
