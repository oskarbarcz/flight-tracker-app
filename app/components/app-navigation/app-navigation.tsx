import {Avatar, Dropdown, Navbar, ThemeMode, useThemeMode} from "flowbite-react";
import lightLogo from '~/assets/logo.light.svg';
import darkLogo from '~/assets/logo.dark.svg';

export function AppNavigation() {
  const {mode: currentMode, setMode} = useThemeMode();

  return (
    <Navbar fluid>
      <Navbar.Brand>
        <img src={lightLogo} className="mr-4 h-6 sm:h-9 dark:hidden" alt="Flight Tracker Logo"/>
        <img src={darkLogo} className="mr-4 h-6 sm:h-9 hidden dark:block" alt="Flight Tracker Logo"/>
        <span
          className="self-center whitespace-nowrap text-xl font-semibold text-gray-950 dark:text-white">Flight Tracker</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">John Doe</span>
            <span className="block truncate text-xs text-gray-500 font-medium">oskar.barcz@example.com</span>
          </Dropdown.Header>
          <Dropdown.Header>
            <span className="block text-xs">Theme</span>
            <span className="block">
              {['light', 'dark', 'auto'].map((mode, index) => {
                let classList = 'truncate cursor-pointer text-xs'
                if(currentMode === mode) {
                  classList += ' font-bold'
                }

                return <span
                  key={index}
                  onClick={() => setMode(mode as ThemeMode)}
                  className={classList}>
                  {mode + " "}
                  </span>;
              })}
            </span>
            <span className="block truncate text-xs text-gray-500 font-medium"></span>
          </Dropdown.Header>
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Schedule flight</Navbar.Link>
        <Navbar.Link href="#">Track flight</Navbar.Link>
        <Navbar.Link href="#">Flights history</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
