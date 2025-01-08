import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: "#90d5ff",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    text: {
                        primary: "#FFFFFF",
                    }
                },
            },
        },
    },
});

export default theme;