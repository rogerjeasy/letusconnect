import { FC } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from "@nextui-org/react";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "./Icons";
import { LetUsConnectLogo } from "./LetUsConnectLogo";

const NavbarUI: FC = () => {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: <Activity className="text-secondary" fill="currentColor" size={30} />,
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  return (
    <Navbar>
      {/* Navbar Brand */}
      <NavbarBrand>
        <LetUsConnectLogo />
        <p className="font-bold text-inherit">LetUsConnect</p>
      </NavbarBrand>

      {/* Center Content */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* Mentorship Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent"
              endContent={icons.chevron}
              radius="sm"
              variant="light"
            >
              Mentorship
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Mentorship Actions">
                <DropdownItem key="find">
                  <Link href="/mentorship/find">Find a Mentor</Link>
                </DropdownItem>
                <DropdownItem key="manage">
                  <Link href="/mentorship/manage">Manage Requests</Link>
                </DropdownItem>
              </DropdownMenu>
        </Dropdown>

        {/* Static Navbar Items */}
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Content */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarUI;