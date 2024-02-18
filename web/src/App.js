/*
    Synced
    Copyright (C) 2024  Atheesh Thirumalairajan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import SyncedAppThemeController from './middleware/SyncedAppThemeController'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SyncedAuthPage from './integrals/SyncedAuthPage';
import axios from "axios";
import SyncedAppConfig from './middleware/SyncedAppConfig';
import SyncedDashboardPage from './integrals/SyncedDashboardPage';

const App = () => {
  /*
    Primary roles of this component.
    1. Check for JWT Auth in required Middleware
  */

  /* Define Required States */
  const [appTheme, setAppTheme] = React.useState(SyncedAppThemeController.getCurrentTheme());

  const RequiresAuth = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [children, setChildren] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
      /* Verify JWT Token */
      axios.get(`${SyncedAppConfig.getServerURL()}/auth/verify`, { withCredentials: true })
        .then((res) => {
          /* Set Children Props userData */
          setChildren(
            React.cloneElement(
              props.children,
              { userData: res.data.userData }
            )
          );

          /* Set Authenticated */
          setIsAuthenticated(true);
        })
        .catch((err) => { setIsAuthenticated(false); })
        .finally(() => { setIsLoading(false); });
    }, []);

    return (
      (isLoading) ?
        <></> :
        (isAuthenticated) ?
          children :
          <Navigate to={`/login?for=${location.pathname}`} />
    );
  }

  /* Write Theme Change Middleware here */
  const toggleTheme = () => {
    setAppTheme(SyncedAppThemeController.toggleTheme());
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />

      { /* Define Frontend Routing */}
      <Routes>
        <Route path='/login' element={<SyncedAuthPage />} />
        <Route path='/*' element={<RequiresAuth><SyncedDashboardPage toggleTheme={toggleTheme} /></RequiresAuth>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;