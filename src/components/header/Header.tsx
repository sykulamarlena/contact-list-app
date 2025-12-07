import React from "react";

type HeaderProps = {
  selectedCount: number;
};

function Header({ selectedCount }: HeaderProps) {
  return (
    <header className="header">Selected contacts: {selectedCount}</header>
  );
}

export default Header;
