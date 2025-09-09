# WalletDashboard Component

## Overview

The `WalletDashboard` component provides a next-gen wallet UI for BTN blockchain, supporting:

- Wallet creation, import, and MetaMask connection
- Multi-wallet management and switching
- Transaction analytics and chart
- Wallet backup/export (copy mnemonic)
- Notifications and feedback

## Features

- **Create Wallet**: Generates a new wallet with mnemonic and address.
- **Import Wallet**: Imports wallet using a 12-word mnemonic.
- **MetaMask Connect**: Connects to MetaMask and adds wallet.
- **Multi-Wallet Support**: Switch between multiple wallets.
- **Transaction Analytics**: Visualizes transaction activity with charts.
- **Backup/Export**: Copy mnemonic for secure backup.
- **Notifications**: Toast feedback for all major actions.

## Usage

```tsx
import WalletDashboard from "./wallet-dashboard";

<WalletDashboard />
```

## Props

None.

## Accessibility

- Wallet selector uses accessible label and title.
- All actions provide feedback via toast notifications.

## Testing

See `wallet-dashboard.test.tsx` for automated tests using React Testing Library.

## Security

- **Encrypted Mnemonic Storage**: All wallet mnemonics are encrypted using AES before being stored in memory. Users must set a password when creating or importing a wallet. The mnemonic is only decrypted after entering the correct password.
- **Password Prompts**: Password prompts are required for wallet creation, import, and viewing/copying the mnemonic. Passwords must be at least 6 characters.
  - **Best Practices**:
    - Never share your mnemonic or password.
    - Use a strong, unique password for each wallet.
    - Store backup mnemonics securely offline.
    - The dashboard does not store mnemonics or passwords on any server; all operations are local.

## File Location

`components/wallet/wallet-dashboard.tsx`
