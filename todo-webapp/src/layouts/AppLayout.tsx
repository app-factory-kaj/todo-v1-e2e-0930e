import { AppShell, Footer, Header } from "@wso2/oxygen-ui";
import { Outlet } from "react-router-dom";
import type { JSX } from "react";

// The single-screen shell (wireframes.dsl draws one `navbar "Todo App"` and no
// `sidebar` — this app has one screen and no roles, so there is nothing to put
// in a navigation rail). AppShell renders without a Sidebar slot when none is
// given (verified against the installed component), so no rail is built here.
export default function AppLayout(): JSX.Element {
  return (
    <AppShell>
      <AppShell.Navbar>
        <Header>
          <Header.Brand>
            <Header.BrandTitle>Todo App</Header.BrandTitle>
          </Header.Brand>
          <Header.Spacer />
        </Header>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer>
        <Footer>
          <Footer.Copyright>© WSO2 LLC</Footer.Copyright>
        </Footer>
      </AppShell.Footer>
    </AppShell>
  );
}
