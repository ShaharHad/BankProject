import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container

            sx={{
                textAlign: "center",
                mt: 10,
            }}
        >
            <Box>
                <Typography variant="h1" color="error" gutterBottom>
                    404
                </Typography>
                <Typography variant="h3" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="h4" color="text.secondary" sx={{ mb: 4, fontWeight: 'bold' }}>
                    The page you are looking for doesn't exist
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login")}
                    size="large"
                >
                    Go Back Login
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
