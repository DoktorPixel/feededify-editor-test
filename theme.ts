import { createTheme } from "@mui/material/styles";

const onestFont = '"Onest", sans-serif';

const theme = createTheme({
  typography: {
    // fontFamily: '"Onest", "Inter", sans-serif',
    subtitle1: {
      fontSize: "22px",
      fontWeight: 400,
      fontFamily: onestFont,
      // color: "#333",
    },
    subtitle2: {
      fontSize: "16px",
      fontWeight: 400,
      fontFamily: onestFont,
      // color: "#666",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          scrollbar-width: thin;
          scrollbar-color: #F1F1F1 transparent;
        }

        *::-webkit-scrollbar {
          width: 5px;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #F1F1F1;
          border-radius: 6px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: #CFCACA;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: onestFont,
          textTransform: "none",
          borderRadius: "5px",
          padding: "6px 10px",
          fontWeight: "700",
        },
        containedPrimary: {
          backgroundColor: "#1840CE",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#161C24", // ???
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: onestFont,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: onestFont,
        },
      },
    },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       fontFamily: onestFont,
    //     },
    //   },
    // },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F1F1",
          borderRadius: "5px",
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          fontFamily: onestFont,
        },
        input: {
          padding: "6px ",
        },
        inputMultiline: {
          minHeight: "44px!important",
          overflow: "auto",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F1F1",
          borderRadius: "5px",
          border: "none",
          fontFamily: onestFont,
        },
        input: {
          padding: "0px ",
          // padding: "6px ",
        },
      },
    },

    //
  },
});

export default theme;
