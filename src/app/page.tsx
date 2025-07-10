import Link from 'next/link';
import { Container, Title, Text, Button, Card, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconUsers, IconSchool, IconChartBar } from '@tabler/icons-react';

export default function Home() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl" align="center">
        {/* Header */}
        <div className="text-center">
          <Title order={1} size="h1" className="text-4xl font-bold text-gray-800 mb-4">
            Sistema de Gestão de Estudantes
          </Title>
          <Text size="lg" c="dimmed" className="max-w-2xl mx-auto">
            Gerencie informações dos estudantes de forma simples e eficiente. Visualize dados como nome, email, CPF e
            notas em uma interface intuitiva.
          </Text>
        </div>

        {/* Cards de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="md" mb="md">
              <ThemeIcon size={40} radius="md" color="blue">
                <IconUsers size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500}>Estudantes</Text>
                <Text size="sm" c="dimmed">
                  Visualize todos os estudantes cadastrados
                </Text>
              </div>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="md" mb="md">
              <ThemeIcon size={40} radius="md" color="green">
                <IconSchool size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500}>Informações</Text>
                <Text size="sm" c="dimmed">
                  Acesse dados completos dos alunos
                </Text>
              </div>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="md" mb="md">
              <ThemeIcon size={40} radius="md" color="orange">
                <IconChartBar size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500}>Notas</Text>
                <Text size="sm" c="dimmed">
                  Acompanhe o desempenho acadêmico
                </Text>
              </div>
            </Group>
          </Card>
        </div>

        {/* Botão principal */}
        <div className="mt-8">
          <Link href="/students/list">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold" variant="filled" color="blue">
              Ver Lista de Estudantes
            </Button>
          </Link>
        </div>

        {/* Informações adicionais */}
        <Card className="w-full max-w-2xl mt-8" padding="xl" withBorder>
          <Title order={3} size="h3" className="text-center mb-4">
            Sobre o Sistema
          </Title>
          <Text c="dimmed" className="text-center">
            Este é um sistema simples para gerenciamento de informações de estudantes, desenvolvido com as mais modernas
            tecnologias web: Next.js, React, TypeScript, Tailwind CSS e Mantine UI.
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
