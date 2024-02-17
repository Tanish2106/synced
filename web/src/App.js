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
import { Route, Routes } from 'react-router-dom';
import SyncedRouterPage from './integrals/SyncedRouterPage';
import SyncedAuthPage from './integrals/SyncedAuthPage';

const App = () => {
  /*
    Primary roles of this component.
    1. Check for JWT Auth in required Middleware
  */

  /* Define Required States */
  const [appTheme, setAppTheme] = React.useState(SyncedAppThemeController.getCurrentTheme());

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
        <Route path='/*' element={<SyncedRouterPage toggleTheme={toggleTheme} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;