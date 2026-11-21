import type { DropdownMenuProps, DropdownNodeProps } from 'naive-ui'

// R3B-05: Naive UI's NDropdown renders its options as plain <div>s with no
// ARIA roles — `getByRole('menuitem')` returns 0 while a menu is visibly
// open. Naive exposes usage-level hooks for exactly this: `menu-props` is
// merged onto the menu container (Dropdown.mjs:340-343) and `node-props`
// is spread onto every option node (DropdownOption.mjs:248), so stamping
// roles needs no fork of Naive UI. Pass both to every NDropdown:
//
//   <NDropdown :menu-props="dropdownMenuProps" :node-props="dropdownNodeProps" ...>
//
// `node-props` runs per option (including dividers and groups), so every
// option node gets `role="menuitem"`; the menu container gets `role="menu"`.
// The callbacks ignore their arguments — the role is the same for every node.
export const dropdownMenuProps: DropdownMenuProps = () => ({ role: 'menu' })

export const dropdownNodeProps: DropdownNodeProps = () => ({ role: 'menuitem' })
