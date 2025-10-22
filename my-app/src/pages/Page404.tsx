// src/pages/NotFound.tsx
import React from "react";
import { Button, Container, Title, Text, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Title order={1} size="h1" style={{ fontSize: 80, marginBottom: 20 }}>
        404
      </Title>
      <Text size="xl"  mb="xl">
        Oops! Page not found.
      </Text>
      <Text color="dimmed" size="md" mb="xl">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Text>
      <Group>
        <Button color="orange" onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </Group>
    </Container>
  );
};

export default Page404;
