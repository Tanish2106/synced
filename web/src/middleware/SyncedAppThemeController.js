import { createTheme } from "@mui/material";

let appTheme = {
    palette: {
         mode: 'light',
         primary: {
            main: '#e71302'
         }
    },
    components: {
        MuiOutlinedInput: {
            defaultProps: {
                sx: {
                    borderRadius: '10px',
                }
            }
        },

    }
};

const isLightMode = () => {
    /* Called During First Render, Set Mode Here */
    if (!localStorage.getItem("theme"))
        localStorage.setItem("theme", "dark");

    return (localStorage.getItem("theme") == "light");
}

const toggleTheme = () => {
    /* Toggle the Theme */
    localStorage.setItem(
        "theme",
        (localStorage.getItem("theme") == "light") ?
            "dark" : "light"
    );

    /* Return a new Theme Object */
    return getCurrentTheme();
}

const getCurrentTheme = () => {
    appTheme.palette.mode = (isLightMode()) ? 'light' : 'dark';
    return createTheme(appTheme);
}

export default { toggleTheme, getCurrentTheme, isLightMode };