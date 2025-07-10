'use client';

import { Modal, Text, Group, Button, Stack, Alert, Divider, ThemeIcon } from '@mantine/core';
import { IconTrash, IconAlertTriangle, IconUserX } from '@tabler/icons-react';

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
  loading?: boolean;
}

export default function ConfirmDeactivateModal({ opened, onClose, onConfirm, studentName, loading = false }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      radius="lg"
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      transitionProps={{
        transition: 'fade',
        duration: 200,
      }}
      classNames={{
        content: 'overflow-hidden',
        body: 'p-0',
      }}
    >
      <Stack gap={0}>
        {/* Header com ícone de alerta */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-red-100">
          <Group gap="md" align="center">
            <ThemeIcon size={50} radius="xl" color="red" variant="light">
              <IconAlertTriangle size={28} />
            </ThemeIcon>
            <div>
              <Text size="xl" fw={700} className="text-red-800">
                Confirmar Desativação
              </Text>
              <Text size="sm" c="dimmed" className="text-red-600">
                Esta ação não pode ser desfeita
              </Text>
            </div>
          </Group>
        </div>

        {/* Conteúdo principal */}
        <div className="p-6">
          <Stack gap="lg">
            {/* Informações do estudante */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <Group gap="sm" mb="sm">
                <IconUserX size={18} className="text-gray-600" />
                <Text size="sm" fw={500} className="text-gray-700">
                  Estudante a ser desativado:
                </Text>
              </Group>
              <Text size="lg" fw={600} className="text-gray-900 ml-6">
                {studentName}
              </Text>
            </div>

            {/* Alerta de confirmação */}
            <Alert
              icon={<IconAlertTriangle size={16} />}
              title="Atenção!"
              color="red"
              variant="light"
              className="border border-red-200"
            >
              <Text size="sm">
                Ao confirmar, o estudante será <strong>desativado</strong> do sistema. Certifique-se de que esta é
                realmente a ação desejada.
              </Text>
            </Alert>

            <Divider />

            {/* Botões de ação */}
            <Group justify="space-between" mt="md">
              <Button variant="default" onClick={onClose} disabled={loading} size="md" className="flex-1 mr-2">
                Cancelar
              </Button>
              <Button
                color="red"
                loading={loading}
                onClick={onConfirm}
                size="md"
                className="flex-1 ml-2"
                leftSection={<IconTrash size={16} />}
              >
                {loading ? 'Desativando...' : 'Confirmar'}
              </Button>
            </Group>
          </Stack>
        </div>
      </Stack>
    </Modal>
  );
}
