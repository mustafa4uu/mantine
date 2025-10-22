import { useState } from "react";
import { Group, Text, Flex, Button, Image,Stack,Avatar,Popover,Menu } from "@mantine/core";
import { IconUsers, } from "@tabler/icons-react";
import logo from '../../assets/logo.svg';
import { Link } from "react-router-dom"; 
type Role = string;

export default function Header() {
  const [selectedRole, setSelectedRole] = useState('Admin');
    const [openedPop, setOpenedPop] = useState(false);

  const roles: Role[] = ['Company Analyst 1', 'Company Analyst 2', 'Supervisor', 'Admin'];

  const currentuser = {
  name: 'abc ',
  email: 'abc@fermion.in',
  role: 'Admin',
  avatarUrl: '/avatar.webp',
};

  return (
    <Flex w="100%" h="100%" justify="space-between" align="center">
      <Link to={"/"}>
        <Group justify="space-between">
          <Image src={logo} alt="Logo" width={120} />
        </Group>
      </Link>
      <Group align="center" gap={'md'}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group px={10}>
                <IconUsers color="#ffa26b" />
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label fw={500} c={'primary.6'} fz={16}>Roles</Menu.Label>
              {roles.map((role) => (
                <Menu.Item
                  key={role}
                  disabled={selectedRole === role}
                  onClick={() => setSelectedRole(role)}
                  c={'primary.6'} fz={14}
                >
                  {role}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Text fz={'sm'} c={'primary.6'} fw={700}>
            Last Login:
            <br /> 21 Aug, 16:30
          </Text>
          <Popover
            opened={openedPop}
            onChange={setOpenedPop}
            width={320}
            position="bottom-end"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Avatar
                radius="xl"
                size={40}
                style={{
                  cursor: 'pointer',
                  border: '2px solid white',
                  background: '#e6e6e6',
                  color: '#3a435e',
                  fontWeight: 600,
                }}
                onClick={() => setOpenedPop((o) => !o)}
              >
                {currentuser.name?.[0] || 'U'}
              </Avatar>
            </Popover.Target>
            <Popover.Dropdown
              p={0}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                minWidth: 300,
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Stack style={{ padding: 0 }}>
                <div
                  style={{
                    background: '#fff1e8',
                    padding: '20px 16px 12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                >
                  <Avatar
                    src={currentuser.avatarUrl}
                    radius="xl"
                    size={48}
                    style={{
                      background: '#bfc9d1',
                      color: '#3a435e',
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {currentuser.name?.[0] || 'U'}
                  </Avatar>
                  <Text fw={600} fz={18} style={{ marginBottom: 2 }} c={"primary.10"}>
                    {currentuser.name || 'Username'}
                  </Text>
                  <Text fz={13} c={"primary.8"} style={{ marginBottom: 8, letterSpacing: 1 }}>
                    {currentuser.email?.toUpperCase().split('@')[0] || 'USERID'}
                  </Text>
                </div>
                <div style={{ padding: '16px 16px 0 16px' }}>
                  <Text fz={15} style={{ marginBottom: 6 }}>
                    <span style={{ color: '#6c757d' }}>User Role :</span>{' '}
                    <span style={{ color: '#3a435e', fontWeight: 600 }}>{selectedRole}</span>
                  </Text>
                  <Text fz={15} style={{ marginBottom: 12 }}>
                    <span style={{ color: '#6c757d' }}>Last Login :</span>{' '}
                    <span style={{ color: '#3a435e', fontWeight: 600 }}>28-08-2025 9:35 PM</span>
                  </Text>
                  <Button
                    mt={8}
                    bg={"primary.3"}
                    color={"primary.10"}
                    variant="outline"
                    fullWidth
                    radius={8}
                    style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}
                  >
                    Log Out
                  </Button>
                </div>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>
    </Flex>
  );
}
